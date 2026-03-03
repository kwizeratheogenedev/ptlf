import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Public Pages
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Achievements from './pages/Achievements';
import AchievementDetail from './pages/AchievementDetail';

// Admin Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import AdminServices from './pages/admin/Services';
import AdminAchievements from './pages/admin/Achievements';
import AdminMessages from './pages/admin/Messages';
import AdminProfile from './pages/admin/Profile';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/achievements/:id" element={<AchievementDetail />} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<Login />} />
              <Route
                path="/admin"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/services"
                element={
                  <PrivateRoute>
                    <AdminServices />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/achievements"
                element={
                  <PrivateRoute>
                    <AdminAchievements />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/messages"
                element={
                  <PrivateRoute>
                    <AdminMessages />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/profile"
                element={
                  <PrivateRoute>
                    <AdminProfile />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
