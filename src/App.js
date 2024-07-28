
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';
import CreateEmployee from './pages/CreateEmployee';
import Dashboard from './pages/Dashboard';
import EditEmployee from './pages/EditEmployee';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Welcome from './pages/Welcome';

const App = () => {
  return (
    <Router>
      <Routes>
  
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/create-employee" element={<ProtectedRoute><CreateEmployee /></ProtectedRoute>} />
        <Route path="/edit-employee/:id" element={<ProtectedRoute><EditEmployee /></ProtectedRoute>} />
        
      </Routes>
    </Router>
  );
};

export default App;
