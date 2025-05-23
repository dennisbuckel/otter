import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { DatabaseProvider } from './db/DatabaseContext';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Login from './pages/Login';
import Feed from './pages/Feed';
import Championships from './pages/Championships';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

// Assets
import './assets/.gitkeep'; // Ensure assets directory is created

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <DatabaseProvider>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              
              {/* Protected routes */}
              <Route element={<PrivateRoute />}>
                <Route path="/feed" element={<Feed />} />
                <Route path="/championships" element={<Championships />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
              
              {/* Redirect to feed by default */}
              <Route path="/" element={<Navigate to="/feed" replace />} />
              <Route path="*" element={<Navigate to="/feed" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </DatabaseProvider>
    </ThemeProvider>
  );
};

export default App;
