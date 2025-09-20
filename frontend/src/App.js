import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastContainer } from 'react-toastify';

// Context providers
import { AuthProvider } from './context/AuthContext';
import { CourseProvider } from './context/CourseContext';

// Components
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Pages
import Home from './pages/Home';
import CoursesPage from './pages/CoursesPage';
import About from './pages/About';
import Contact from './pages/Contact';
import CourseDetail from './components/Course/CourseDetail';
import VideoPlayer from './components/Lesson/VideoPlayer';
import StudentDashboard from './components/Dashboard/StudentDashboard';
import InstructorDashboard from './components/Dashboard/InstructorDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import ProfilePage from './pages/ProfilePage';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import NotFound from './pages/NotFound';

// Hooks
import { useAuth } from './context/AuthContext';

// Styles
import './App.css';
import 'react-toastify/dist/ReactToastify.css';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
    mutations: {
      retry: false,
    },
  },
});

// Dashboard Router Component
const DashboardRouter = () => {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case 'student':
      return <StudentDashboard />;
    case 'instructor':
      return <InstructorDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <StudentDashboard />;
  }
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <CourseProvider>
            <div className="App">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Layout><Home /></Layout>} />
                <Route path="/courses" element={<Layout><CoursesPage /></Layout>} />
                <Route path="/about" element={<Layout><About /></Layout>} />
                <Route path="/contact" element={<Layout><Contact /></Layout>} />
                <Route path="/courses/:id" element={<Layout><CourseDetail /></Layout>} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <DashboardRouter />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />

                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <ProfilePage />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />

                <Route 
                  path="/learn/:courseId/:lessonId" 
                  element={
                    <ProtectedRoute>
                      <VideoPlayer />
                    </ProtectedRoute>
                  } 
                />

                {/* 404 Route */}
                <Route path="*" element={<Layout><NotFound /></Layout>} />
              </Routes>

              {/* Toast notifications */}
              <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
              />
            </div>
          </CourseProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;