# Hotel Booking Management Backend

This is a backend project for a hotel booking platform. It is made with Node.js, Express.js, TypeScript, MongoDB, Mongoose, JWT, and Razorpay.

## Features

- User register and login
- Role based access for customer, seller, and admin
- Hotel management
- Room management
- Booking management
- Payment handling
- Notifications
- Booking history

## Project Setup

First install all packages:

```bash
npm install
```

## Environment File

Create a `.env` file in the main project folder.

Add these values:

```env
MONGO_URL=your_mongodb_url
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
```

Do not upload `.env` file to GitHub because it has secret keys.

## Run Project

For development:

```bash
npm run dev
```

The server will run on:

```txt
http://localhost:3000
```

## Build Project

To check TypeScript build:

```bash
npm run build
```

## Start Production Build

After build, run:

```bash
npm start
```

## Main API Base URL

```txt
http://localhost:3000/api/v1
```

## Main Folders

```txt
src/
  middlewares/
  models/
  modules/
  utils/
```

`models` contains database schemas.

`modules` contains feature wise code like auth, hotels, rooms, bookings, payments, and notifications.

`middlewares` contains auth and role checking logic.

`utils` contains common helper functions.

## API Testing

Postman collection is added in:

```txt
postman_collection.json
```

Import this file in Postman and set these variables:

```txt
baseUrl
token
hotelId
roomId
bookingId
notificationId
```

## Architecture Document

Architecture explanation is added in:

```txt
architecture.md
```

It explains backend flow, folder structure, database structure, API flow, security, and scalability.

## User Roles

```txt
customer - can book room, make payment, cancel booking, view notifications
seller   - can add hotel, add room, manage hotel bookings
admin    - can approve/reject hotel and view all bookings
```

## Simple Request Flow

Example booking flow:

```txt
Customer sends request
Auth middleware checks token
Role middleware checks role
Controller validates data
Service runs business logic
Model saves data in MongoDB
Response is sent back
```

## Important Note

Before running payment APIs, Razorpay keys must be added in `.env`.

For protected APIs, send token like this:

```txt
Authorization: Bearer your_token_here
```
