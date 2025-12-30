import { useState } from 'react'
import './App.css'
import Login from './components/login/login'
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login/>} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
