# Car Rental System

Hệ thống cho thuê xe theo kiến trúc microservices sử dụng MERN stack.

## Cấu trúc dự án

```
car-rental-system/
├── frontend/                 # React frontend
├── backend/                  # Backend services
│   ├── user-service/        # User management service
│   ├── car-service/         # Car management service
│   ├── booking-service/     # Booking management service
│   ├── payment-service/     # Payment processing service
│   ├── notification-service/# Notification service
│   └── review-service/      # Review management service
├── api-gateway/             # API Gateway
└── docker/                  # Docker configuration files
```

## Yêu cầu hệ thống

- Node.js >= 18.x
- MongoDB >= 6.x
- Docker & Docker Compose
- Redis
- RabbitMQ

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
docker-compose up
```

## Các service

1. User Service (Port: 3001)
   - Quản lý người dùng
   - Xác thực và phân quyền

2. Car Service (Port: 3002)
   - Quản lý thông tin xe
   - Tìm kiếm và lọc xe

3. Booking Service (Port: 3003)
   - Quản lý đặt xe
   - Xử lý thanh toán

4. Payment Service (Port: 3004)
   - Xử lý thanh toán
   - Quản lý giao dịch

5. Notification Service (Port: 3005)
   - Gửi email
   - Gửi thông báo

6. Review Service (Port: 3006)
   - Quản lý đánh giá
   - Quản lý bình luận

## API Documentation

API documentation có thể truy cập tại: `http://localhost:3000/api-docs`

## License

MIT 