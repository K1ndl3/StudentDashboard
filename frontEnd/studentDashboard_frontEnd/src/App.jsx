import { useState } from 'react'
import './App.css'
import Login from './components/login/login'
import DashBoard from './components/dashboard/dashboard';
import GuestDashboard from './components/guest-dashboard/guest-dashboard';
import Calendar from './components/calendar/calendar';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/dashboard" element={<DashBoard/>}/>
        <Route path="/guest-dashboard" element={<GuestDashboard/>}/>
        <Route path="/calendar" element={<Calendar/>}/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
