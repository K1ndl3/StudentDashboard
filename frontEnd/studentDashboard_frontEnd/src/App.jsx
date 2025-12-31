import { useState } from 'react'
import './App.css'
import Login from './components/login/login'
import DashBoard from './components/dashboard/dashboard';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/dashboard" element={<DashBoard/>}/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
