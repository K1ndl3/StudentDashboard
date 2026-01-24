import { useState } from 'react'
import './App.css'
import Login from './components/login/login'
import DashBoard from './components/dashboard/dashboard';
import GuestDashboard from './components/guest-dashboard/guest-dashboard';
import Calendar from './components/calendar/calendar';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from './components/AuthContext/AuthContext';
import { ProtectedRoute } from './components/protected-route/ProtectedRoute';

function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login/>} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashBoard/>
              </ProtectedRoute>}/>
            <Route path="/guest-dashboard" element={<GuestDashboard/>}/>
            <Route path="/calendar" element={<Calendar/>}/>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App
