# Restaurant Reservation App

A full-stack web application for managing restaurant table reservations. Built with a modern React frontend and a robust Node.js/Express backend with MongoDB.

## Features

- **User Authentication**: Secure login and registration for customers and admins
- **Table Reservations**: Easy booking system with real-time availability checking
- **Admin Dashboard**: Comprehensive management interface for reservations and tables
- **Responsive Design**: Mobile-first UI with dark theme and smooth animations
- **Real-time Filtering**: Dynamic time slot filtering based on current date
- **Role-based Access**: Separate interfaces for users and administrators

## Tech Stack

### Frontend
- **React 19** with Vite
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **Axios** for API calls
- **React Hot Toast** for notifications
- **Date-fns** for date handling

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Validator** for input validation
- **CORS** for cross-origin requests

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance like MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd restaurant-reservation-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   - Create a `.env` file in the root directory
   - Add your MongoDB URI and JWT secret key
   - Example:
     ```env
     MONGODB_URI=<your-mongodb-uri>
     JWT_SECRET=<your-jwt-secret>
     ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Access the app**
   - Frontend: `reserve-app-frontend.vercel.app`
   - Backend: `https://reserve-app-gcyx.onrender.com`

## Usage

- **Customer**: Browse available tables, make reservations, and manage your profile
- **Admin**: View and manage all reservations, tables, and user accounts

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add your feature'`)
5. Push to the branch (`git push origin feature/your-feature`)
6. Create a pull request

Areas for Improvement with Additional Time
Email/SMS Integration: Add notifications for reservation confirmations, updates, and reminders using services like SendGrid or Twilio.
Advanced Scheduling: Support for variable time slots, multi-day reservations, or recurring bookings.
Payment Processing: Integrate Stripe or razorpay for deposits or full payments.
Multi-Location Support: Extend to handle multiple restaurants with location-based filtering.
Performance Optimization: Add Redis caching for availability checks and implement pagination for large datasets.
Enhanced Security: Add rate limiting, input sanitization, and possibly OAuth for social logins.
Analytics Dashboard: Add charts and reports for admin insights using libraries like Chart.js.
Offline Mode: Implement service workers for basic offline functionality.
Accessibility: Improve ARIA labels, keyboard navigation, and screen reader support.
API Documentation: Generate Swagger/OpenAPI docs for better developer experience.
Deployment: Set up CI/CD pipelines with Docker and cloud hosting (e.g., Vercel for frontend, Heroku for backend).


Project Structure
API Endpoints
Authentication
POST /api/auth/register - User registration
POST /api/auth/login - User login
Reservations
POST /api/reservations - Create new reservation
GET /api/reservations/me - Get user's reservations
PATCH /api/reservations/:id/cancel - Cancel reservation
Availability
POST /api/availability - Check table availability
Admin (Protected)
GET /api/admin/reservations - Get all reservations
PATCH /api/admin/reservations/:id/cancel - Admin cancel reservation
PATCH /api/admin/reservations/:id/complete - Mark reservation complete
POST /api/admin/tables - Create new table
GET /api/admin/tables - Get all tables
PATCH /api/admin/tables/:id - Update table
PATCH /api/admin/tables/:id/disable - Enable/disable table
Contributing
Fork the repository
Create a feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request
License
