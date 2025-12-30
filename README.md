# DSA Hub - Master Data Structures & Algorithms

A full-stack platform designed to help developers track their progress through a curated list of Data Structures and Algorithms problems.

## 🚀 Features

- **Problem Tracking**: Mark problems as completed and track your progress across different DSA topics.
- **Admin Dashboard**: Comprehensive management interface for administrators to curate topics and problems.
- **User Progress Monitoring**: Admins can view the real-time progress of all registered users.
- **Dynamic Progress Bars**: Visual representation of your journey on the dashboard and topic pages.
- **Role-Based Access**: Secured routes for users and administrators.

## 🛠️ Technology Stack

- **Frontend**: React, Vite, Tailwind CSS, Lucide React, Shadcn UI.
- **Backend**: Node.js, Express.
- **Database**: MongoDB with Mongoose.
- **Authentication**: JWT (JSON Web Tokens) with bcrypt password hashing.

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (Running locally or a connection string)

### 1. Clone the repository
```bash
git clone <repository-url>
cd dsa-mastery-hub-main
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory with:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/dsa-hub
JWT_SECRET=your_super_secret_key
```
Seed the database with initial topics and problems:
```bash
node seed_dsa.js
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ..
npm install
npm run dev
```
The application will be available at `http://localhost:8080`.

## 🔑 Admin Access

For testing purposes, a default administrative account is available (if seeded):
- **Email**: `admin@example.com`
- **Password**: `admin@1234`

## 🔑 User/Student Access

For testing purposes, a default student account is available (if seeded):
- **Email**: `john@example.com`
- **Password**: `john@1234`

## 📱 Responsiveness

The platform is designed to be fully responsive across mobile, tablet, and desktop devices. The admin panel features a mobile-friendly navigation system to allow management on the go.

---
