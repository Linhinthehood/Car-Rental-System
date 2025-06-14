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



## License

MIT 