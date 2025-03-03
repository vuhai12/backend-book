import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { onlineUsers } from '../ultils/onlineUsers';

dotenv.config();

export const socketMiddleware = (io) => {
  //   Middleware để xác thực user từ token
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token; // Lấy token từ auth của socket
    if (!token) return next(new Error('Not authorized'));
    if (!socket.handshake.auth?.token) {
      return next(new Error('Not authorized'));
    }
    if (!token) return;
    const extractedToken = token?.startsWith('Bearer ') ? token.split(' ')[1] : token;
    jwt.verify(extractedToken, process.env.JWT_SECRET, (err, decoded) => {
      console.log('decoded', decoded);
      if (err) return next(new Error('Invalid token'));
      socket.userId = decoded.id; // Gán userId vào socket
      next();
    });
  });
  io.on('connection', (socket) => {
    // ✅ Lưu user online
    onlineUsers[socket.userId] = socket.id;
    io.emit('updateOnlineUsers', Object.keys(onlineUsers)); // Gửi danh sách user online
    // 📌 Lắng nghe tin nhắn từ client

    socket.on('newMessage', ({ userId }) => {
      io.emit('recivedMessage', { userId });
    });

    socket.on('newMessageUserToAdmin', () => {
      io.emit('recivedMessageUserToAdmin', { userId: socket.userId });
    });

    // 📌 Khi user disconnect
    socket.on('disconnect', () => {
      delete onlineUsers[socket.userId];
      io.emit('updateOnlineUsers', Object.keys(onlineUsers));
    });
  });
};
