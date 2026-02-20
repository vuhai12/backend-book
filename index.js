import express from 'express';
import cors from 'cors';
require('dotenv').config();
import initRoutes from './src/routes';
require('./connection_database');
import http from 'http';
import { Server } from 'socket.io';
import { socketMiddleware } from './src/middlewares/socketMiddleware';

const app = express();

const server = http.createServer(app);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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

initRoutes(app);
const PORT = process.env.PORT || 5000;
const listener = server.listen(PORT, () => {
  console.log(`Server is running on the port ` + PORT);
});
