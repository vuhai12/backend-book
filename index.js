//đây là file cấu hình 1 con server

import express from 'express';
import cors from 'cors';
require('dotenv').config();
import initRoutes from './src/routes';
require('./connection_database');
import http from 'http'; // Import module HTTP
import { Server } from 'socket.io'; // Import socket.io
import { socketMiddleware } from './src/middlewares/socketMiddleware';

const app = express();

const server = http.createServer(app); // Tạo server HTTP từ Express
// const io = new Server(server, {
//   cors: {
//     origin: process.env.CLIENT_URL,
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   },
// });

//sử dụng app.use() để thêm vào các middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);
//đọc dữ liệu gửi lên server từ client
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

//hiển thị file ảnh upload từ formdata
// app.use('/', express.static('./uploads'));
app.use('/uploads', express.static('uploads'));

app.get('/create-table', () => {
  let models = require('./src/models');
  models.sequelize.sync().then(() => {
    console.log('ok');
  });
});

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});
app.set('io', io);
socketMiddleware(io);
// io.on('connection', (socket) => {
//   // console.log('⚡ A user connected:', socket.id);
//   socket.on('newMessage', () => {
//     console.log('cjdnjcdj');
//   });
// });

initRoutes(app);
const PORT = process.env.PORT || 5000;
const listener = server.listen(PORT, () => {
  console.log(`Server is running on the port ` + PORT);
});
