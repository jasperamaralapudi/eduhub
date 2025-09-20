# EduHub - Online Learning Platform

A comprehensive MERN (MongoDB, Express.js, React.js, Node.js) stack application for online learning with course management, user authentication, progress tracking, and video lessons.

## 🚀 Features

### Core Features
- **User Authentication**: JWT-based authentication with role-based access control
- **Course Management**: Full CRUD operations for courses and lessons
- **Progress Tracking**: Real-time student progress monitoring
- **Video Lessons**: Integrated video player with progress tracking
- **File Upload**: Support for course materials and profile pictures
- **Search & Filter**: Advanced course discovery functionality
- **Responsive Design**: Mobile-first responsive user interface

### User Roles
- **Students**: Course enrollment, progress tracking, lesson completion
- **Instructors**: Course creation, student management, analytics
- **Admins**: User management, platform analytics, course approval

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React.js** - Frontend library
- **React Router** - Navigation
- **React Query** - Server state management
- **React Context** - Global state
- **Axios** - HTTP client

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd EduHub
```

2. **Set up the Backend**
```bash
cd backend
npm install
```

3. **Set up the Frontend**
```bash
cd ../frontend
npm install
```

### Environment Variables

Create `.env` files in both backend and frontend directories:

**Backend (.env)**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/eduhub
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

**Frontend (.env)**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_CLIENT_URL=http://localhost:3000
```

### Running the Application

1. **Start the Backend Server**
```bash
cd backend
npm run dev
```

2. **Start the Frontend Development Server**
```bash
cd frontend
npm start
```

The application will be available at http://localhost:3000

## 📝 API Documentation

### Authentication Endpoints
```
POST /api/auth/register - Register a new user
POST /api/auth/login - Login user
GET /api/auth/me - Get current user
PUT /api/auth/profile - Update user profile
```

### Course Endpoints
```
GET /api/courses - Get all courses
POST /api/courses - Create a new course
GET /api/courses/:id - Get course by ID
PUT /api/courses/:id - Update course
DELETE /api/courses/:id - Delete course
POST /api/courses/:id/enroll - Enroll in course
```

## 🎯 Usage

### For Students
1. Register/Login to access courses
2. Browse available courses
3. Enroll in courses
4. Watch lessons and track progress

### For Instructors
1. Create and manage courses
2. Add lessons and course materials
3. Monitor student progress
4. View analytics and reports

### For Admins
1. Manage users and courses
2. View platform analytics
3. Configure system settings

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Authors

- **EduHub Team**

---

**Happy Learning! 🎓**