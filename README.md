# Handii (Urban Services Finder)

Handii is a full-stack web application designed to connect users with local urban service providers (workers/handymen). It features a robust role-based system for users, workers, and admins, along with real-time messaging for active bookings.

## 🌟 Features

- **Role-Based Authentication:** Secure JWT-based authentication supporting `user`, `worker`, and `admin` roles.
- **Worker Discovery:** Users can browse and search for verified workers based on service type and location.
- **Service Bookings:** Users can book workers for specific services.
- **Real-time Messaging:** Integrated Socket.io allows users and workers to chat in real-time within an active booking.
- **Admin Dashboard Actions:** Admins can verify worker profiles or remove them.
- **Responsive UI:** Built with Next.js and modern Tailwind CSS v4.

## 🛠️ Tech Stack

### Frontend (`/client`)
- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **UI Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Real-time:** `socket.io-client`

### Backend (`/server`)
- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express.js](https://expressjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) & Mongoose
- **Authentication:** `jsonwebtoken` (JWT) & `bcryptjs`
- **Real-time:** `socket.io`

## 📂 Project Structure

```
Handii/
├── client/           # Next.js frontend application
│   ├── public/       # Static assets
│   └── src/          # Source code (App Router, Contexts)
├── server/           # Node.js Express backend API
│   ├── middleware/   # Custom middlewares (e.g., Auth, Roles)
│   ├── models/       # Mongoose Schemas (User, Worker, Booking)
│   ├── server.js     # Main entry point for the backend
│   └── seed.js       # Database seeding script
├── db_data/          # Local MongoDB data directory
├── .env              # Environment variables
└── package.json      # Root package file for managing backend scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB running locally or a MongoDB Atlas URI

### 1. Clone the repository
```bash
git clone <repository-url>
cd Handii-master
```

### 2. Backend Setup
Install the backend dependencies:
```bash
npm install
```

Configure your environment variables in the root `.env` file:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/urban_services
JWT_SECRET=your_jwt_secret_key
```

Run the backend development server:
```bash
npm start
```
*The backend server will start on `http://localhost:5000`.*

### 3. Frontend Setup
Open a new terminal and navigate to the `client` directory:
```bash
cd client
npm install
```

Run the frontend development server:
```bash
npm run dev
```
*The frontend application will be available at `http://localhost:3000`.*

## 🔌 API Endpoints Summary

### Authentication
- `POST /api/auth/register` - Register a new user/worker
- `POST /api/auth/login` - Login and receive JWT

### Workers
- `POST /api/workers` - Create a worker profile (requires worker role)
- `GET /api/workers` - List verified workers (supports filters)
- `PATCH /api/admin/workers/:id/verify` - Verify a worker (admin only)
- `DELETE /api/admin/workers/:id` - Delete a worker (admin only)

### Bookings
- `POST /api/bookings` - Create a booking
- `GET /api/bookings/user/me` - Get bookings for the logged-in user
- `GET /api/bookings/worker/me` - Get bookings for the logged-in worker
- `PATCH /api/bookings/:id/status` - Update booking status
- `POST /api/bookings/:id/messages` - Add a real-time message to a booking

## 📄 License
This project is private and intended for internal use.
