# Car Rental System

Hệ thống cho thuê xe theo kiến trúc microservices sử dụng MERN stack.

## Cấu trúc dự án

```
car-rental-system/
├── frontend/                # React frontend
├── backend/                 # Backend services
│   ├── user-service/        # User management service
│   ├── vehicle-service/     # Vehicle management service
│   ├── booking-service/     # Booking management service
├── api-gateway/             # API Gateway

```

## Yêu cầu hệ thống

- Node.js >= 18.x
- MongoDB >= 6.x
- Docker & Docker Compose

## Cài đặt

1. Clone repository:
```bash
git clone [repository-url]
cd car-rental-system
```

2. Cài đặt dependencies cho frontend:
```bash
cd frontend
npm install
```

3. Cài đặt dependencies cho các service:
```bash
cd backend
npm install
```

4. Chạy với Docker Compose:
```bash
docker-compose up --build -d 
```
Lần đầu build docker sẽ chạy khá lâu (tầm 15 - 20p)


## Các service

1. User Service (Port: 3001)
   - Quản lý người dùng
   - Xác thực và phân quyền

2. Vehicle Service (Port: 3002)
   - Quản lý thông tin xe
   - Tìm kiếm và lọc xe

3. Booking Service (Port: 3003)
   - Quản lý đặt xe
   - Xử lý thanh toán

4. API Gateway (Port: 3000)

5. Frontend (Port: 4000)

## Các biến môi trường: 

1. User Service (Port: 3001)
PORT=3001
MONGODB_URI=mongodb+srv://duclinhhopham:duclinh2503@test.d9qvo.mongodb.net/user_db
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h
NODE_ENV=development

2. Vehicle Service (Port: 3002)
PORT=3002
MONGODB_URI=mongodb+srv://duclinhhopham:duclinh2503@test.d9qvo.mongodb.net/vehicle_db
USER_SERVICE_URL=http://localhost:3001
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h
NODE_ENV=development
UPLOAD_VEHICLE_PATH=/usr/src/app/uploads/vehicles
UPLOAD_VEHICLE_URL=/uploads/vehicles/

3. Booking Service (Port: 3003)
PORT=3003
MONGODB_URI=mongodb+srv://duclinhhopham:duclinh2503@test.d9qvo.mongodb.net/booking_db
USER_SERVICE_URL=http://localhost:3001
VEHICLE_SERVICE_URL=http://localhost:3002
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h
NODE_ENV=development

4. API Gateway (Port: 3000)
# Environment
NODE_ENV=development
PORT=3000

# Service URLs
USER_SERVICE_URL=http://user-service:3001
VEHICLE_SERVICE_URL=http://vehicle-service:3002
BOOKING_SERVICE_URL=http://booking-service:3003
BOOKING_SERVICE_WS_URL=http://booking-service:3003

# Logging
LOG_LEVEL=info  # Có thể là: error, warn, info, debug

5. Frontend (Port: 4000)
NODE_ENV=development
REACT_APP_API_URL=http://localhost:3000
REACT_APP_IMAGE_BASE_URL=http://localhost:3002
REACT_APP_WS_BOOKINGS_URL=http://localhost:3000/ws/bookings
REACT_APP_WS_BOOKINGS_PATH=/ws/bookings


## License

MIT 