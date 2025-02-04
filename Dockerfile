FROM node:20-alpine

WORKDIR /app

# Cài đặt dependencies
COPY package*.json . 
RUN npm install

# Copy mã nguồn
COPY . .

# Đọc biến môi trường từ file .env
ENV NODE_ENV=production

EXPOSE 5000

# Chạy ứng dụng
CMD ["npm", "start"]
