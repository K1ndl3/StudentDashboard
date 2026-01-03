import { useState } from 'react'
import './App.css'
import Login from './components/login/login'
import DashBoard from './components/dashboard/dashboard';
import GuestDashboard from './components/guest-dashboard/guest-dashboard';
import Focus from './components/focus/focus';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/dashboard" element={<DashBoard/>}/>
        <Route path="/guest-dashboard" element={<GuestDashboard/>}/>
        <Route path="/focus" element={<Focus/>}/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
