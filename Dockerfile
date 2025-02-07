FROM node:20-alpine

WORKDIR /app

COPY package*.json . 
RUN npm install
RUN npm install -g nodemon  # Thêm nodemon để tự động reload

COPY . .

ENV NODE_ENV=development

EXPOSE 5000

CMD ["nodemon", "index.js"]  # Sử dụng nodemon để chạy server
