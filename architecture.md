# Hotel Booking Platform - Backend Architecture

## 1. Project Overview

This project is a backend system for a hotel booking platform. It has three main users:

- Customer App
- Seller/Hotel Panel
- Admin Panel

Customers can search hotels, book rooms, make payments, cancel bookings, and see notifications. Sellers can add hotels and rooms, and manage bookings for their hotels. Admin can approve or reject hotels and see all bookings.

The backend is made using Node.js, Express.js, TypeScript, MongoDB, Mongoose, JWT authentication, and Razorpay for payments.

## 2. Architecture Diagram

```txt
Customer App        Seller Panel        Admin Panel
     |                  |                  |
     ---------------------------------------
                    |
                    v
              Express Backend API
                    |
        -----------------------------
        | Auth Middleware           |
        | Role Middleware           |
        | Validation Handling       |
        -----------------------------
                    |
   ------------------------------------------------
   | Auth | Hotels | Rooms | Bookings | Payments  |
   | Notifications                                |
   ------------------------------------------------
                    |
                    v
              Mongoose Models
                    |
                    v
                 MongoDB
                    |
                    v
            Razorpay Payment Gateway
```

## 3. Folder Structure

```txt
src/
  index.ts

  middlewares/
    auth.middleware.ts
    role.middleware.ts

  models/
    user.model.ts
    hotel.model.ts
    room.model.ts
    booking.model.ts
    payment.model.ts
    notification.model.ts

  modules/
    auth/
      auth.routes.ts
      auth.controller.ts
      auth.service.ts

    hotels/
      hotel.routes.ts
      hotel.controller.ts
      hotel.service.ts

    rooms/
      room.routes.ts
      room.controller.ts
      room.service.ts

    bookings/
      booking.routes.ts
      booking.controller.ts
      booking.service.ts

    payments/
      payment.routes.ts
      payment.controller.ts
      payment.service.ts

    notifications/
      notification.routes.ts
      notification.controller.ts
      notification.service.ts
```

This folder structure is good because every feature has its own routes, controller, and service file. It makes the project clean and easy to understand.

## 4. User Roles

There are three roles in this project:

| Role | Work |
| --- | --- |
| Customer | Can book rooms, make payment, cancel booking, view booking history |
| Seller | Can add hotels, add rooms, and manage hotel bookings |
| Admin | Can approve/reject hotels and view all bookings |

## 5. Authentication and Authorization

Authentication is done using JWT token.

When a user logs in, backend checks email and password. If details are correct, backend creates a JWT token. This token contains user id and role.

For protected routes, user must send token in header:

```txt
Authorization: Bearer token_here
```

The `authMiddleware` checks the token. If token is valid, user details are added in request.

The `roleMiddleware` checks if the user has correct role or not. Example:

```ts
roleMiddleware("seller")
```

This means only seller can access that route.

## 6. API Design

### Auth APIs

```txt
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/auth/me
```

### Hotel APIs

```txt
GET    /api/v1/hotel
GET    /api/v1/hotel/:id
POST   /api/v1/hotel
PUT    /api/v1/hotel/:id
DELETE /api/v1/hotel/:id
PATCH  /api/v1/hotel/:id/approve
PATCH  /api/v1/hotel/:id/reject
```

### Room APIs

```txt
GET    /api/v1/hotels/:hotelId/rooms
POST   /api/v1/hotels/:hotelId/rooms
GET    /api/v1/rooms/:id
PUT    /api/v1/rooms/:id
DELETE /api/v1/rooms/:id
```

### Booking APIs

```txt
POST  /api/v1/bookings
GET   /api/v1/bookings/my-bookings
GET   /api/v1/bookings/:id
PATCH /api/v1/bookings/:id/cancel
GET   /api/v1/bookings/hotel/:hotelId
PATCH /api/v1/bookings/:id/checkin
PATCH /api/v1/bookings/:id/checkout
GET   /api/v1/bookings
```

### Payment APIs

```txt
POST /api/v1/payments/initiate
POST /api/v1/payments/verify
POST /api/v1/payments/refund
GET  /api/v1/payments/:bookingId
POST /api/v1/payments/webhook
```

### Notification APIs

```txt
GET    /api/v1/notifications
PATCH  /api/v1/notifications/:id/read
PATCH  /api/v1/notifications/read-all
DELETE /api/v1/notifications/:id
```

## 7. Database Structure

### User Collection

Stores user details.

```txt
name
email
password
role
phone
createdAt
updatedAt
```

### Hotel Collection

Stores hotel details.

```txt
seller_id
name
description
city
address
star_rating
status
amenities
images
createdAt
updatedAt
```

### Room Collection

Stores room details.

```txt
hotel_id
room_type
price_per_night
capacity
total_rooms
amenities
images
is_available
createdAt
updatedAt
```

### Booking Collection

Stores booking details.

```txt
customer_id
hotel_id
room_id
check_in
check_out
guests
total_amount
status
cancelled_at
createdAt
updatedAt
```

### Payment Collection

Stores payment details.

```txt
booking_id
user_id
amount
currency
gateway
gateway_order_id
gateway_payment_id
status
refund_id
createdAt
updatedAt
```

### Notification Collection

Stores user notifications.

```txt
user_id
title
message
type
is_read
createdAt
updatedAt
```

## 8. Request-Response Lifecycle

Example: Customer books a room.

1. Customer sends booking request.
2. Request goes to Express route.
3. Auth middleware checks JWT token.
4. Role middleware checks customer role.
5. Controller checks required fields.
6. Service checks room availability and guest capacity.
7. Service calculates total amount.
8. Booking is saved in MongoDB.
9. Notification is created for customer.
10. Backend sends success response.

Example response:

```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "booking_id": "booking_id_here",
    "status": "pending"
  }
}
```

## 9. Payment Flow

1. Customer creates booking.
2. Customer starts payment.
3. Backend creates Razorpay order.
4. Customer pays using Razorpay.
5. Razorpay sends payment id and signature.
6. Backend verifies signature.
7. If signature is valid, payment status becomes success.
8. Booking status becomes confirmed.
9. Notification is sent to customer.

## 10. Notification Flow

Notifications are created when important actions happen.

Examples:

- Booking created
- Booking cancelled
- Payment successful
- Refund initiated

Customer can view notifications and mark them as read.

## 11. API Security and Validation

Security used in this backend:

- Password is hashed using bcrypt.
- JWT token is used for login.
- Auth middleware protects private APIs.
- Role middleware protects seller and admin APIs.
- Razorpay signature is verified for payment.
- Users can access only their own protected data.

Validation should be improved more by using a library like Zod or Joi. This will make validation cleaner and safer.

## 12. Scalability Approach

To make this backend scalable:

- Use pagination in hotel, booking, and notification APIs.
- Add indexes in MongoDB for fields like `email`, `city`, `hotel_id`, `room_id`, and `customer_id`.
- Use Redis cache for hotel search results.
- Use background jobs for sending notifications and emails.
- Keep each module separate so future changes are easy.
- Use environment variables for secrets like MongoDB URL, JWT secret, and Razorpay keys.

## 13. Caching Strategy

Redis can be used for caching.

Good places for caching:

- Popular hotels
- Hotel search by city
- Room list of a hotel

Example:

```txt
User searches hotels in Delhi
Backend checks Redis first
If data exists, return from Redis
If not, fetch from MongoDB and save in Redis
```

This will reduce database load and make response faster.

## 14. Rate Limiting

Rate limiting should be added to protect APIs.

Important routes for rate limiting:

- Login API
- Register API
- Payment APIs
- Webhook API

This helps stop spam requests and brute force attacks.

## 15. Microservices Approach

For small project, monolithic backend is okay. But in future, it can be divided into microservices.

Possible microservices:

```txt
Auth Service
Hotel Service
Booking Service
Payment Service
Notification Service
Admin Service
```

Each service can have its own database or collection. Services can communicate using REST APIs or message queues.

## 16. Deployment Architecture

```txt
Frontend Apps
   |
   v
Nginx / Load Balancer
   |
   v
Node.js Express Server
   |
   v
MongoDB Atlas
   |
   v
Razorpay
```

For deployment:

- Backend can be deployed on Render, Railway, AWS, or DigitalOcean.
- MongoDB can be hosted on MongoDB Atlas.
- Environment variables should be stored safely.
- Logs and monitoring should be added.
- HTTPS should be used in production.

## 17. Technical Decisions

- Express.js is used because it is simple and good for REST APIs.
- TypeScript is used because it gives type safety.
- MongoDB is used because hotel, room, and booking data can be stored easily as documents.
- Mongoose is used to create schemas and connect with MongoDB.
- JWT is used because it is stateless and works well with mobile and web apps.
- Razorpay is used because it is common for Indian payment systems.

## 18. Current Improvements Needed

These improvements should be done before final submission:

- Mount payment routes in `index.ts`.
- Fix TypeScript build errors.
- Move payment success notification after payment verification.
- Add proper validation middleware.
- Add ownership check in payment and room APIs.
- Add pagination in listing APIs.
- Create Postman collection for all APIs.
- Add rate limiting and caching explanation in final document.

## 19. Conclusion

This backend has a good modular structure for a hotel booking platform. It already includes authentication, hotel management, room management, booking management, payment handling, and notifications. With some fixes and better documentation, it can match the assignment requirements properly.
