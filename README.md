# Task Management BE

## Tổng quan

Task Management BE là backend cho hệ thống quản lý công việc theo mô hình Kanban, hỗ trợ quản lý workspace, board, list, card, phân quyền người dùng (RBAC), xác thực JWT, gửi mail, và RESTful API chuẩn hóa với Swagger. Dự án sử dụng Node.js, TypeScript, Prisma ORM, PostgreSQL và Docker.

---

## Hướng dẫn cài đặt nhanh

### 1. Cài đặt dependencies

```bash
yarn install
```

### 2. Khởi động PostgreSQL bằng Docker

```bash
docker-compose up -d
```

### 3. Chạy migration & seed dữ liệu

```bash
yarn prisma migrate deploy
yarn prisma db seed
```

### 4. Khởi động server

```bash
yarn dev
```

Server sẽ chạy ở địa chỉ: [http://localhost:8000](http://localhost:8000)

---

## API Docs

- Truy cập Swagger tại: [http://localhost:8000/api/docs](http://localhost:8000/api/docs)

---

## Kiểm thử

```bash
yarn test
```

---

## Ghi chú

- File `.env` đã được cung cấp sẵn, không cần cấu hình lại.
- Nếu gặp lỗi kết nối database, kiểm tra lại Docker và cấu hình trong `.env`.

---

**Chúc bạn cài đặt thành công!**
