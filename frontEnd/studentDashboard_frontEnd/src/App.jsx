import { useState } from "react";
import "./App.css";
import Login from "./components/auth/login/login";
import DashBoard from "./components/dashboard/dashboard";
import GuestDashboard from "./components/guest-component/guest-dashboard/guest-dashboard";
import Calendar from "./components/guest-component/calendar/calendar";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./components/context/AuthContext/AuthContext";
import { ProtectedRoute } from "./components/protected-route/ProtectedRoute";
import Register from "./components/auth/register/register";
import { UserProvider } from "./components/context/UserContext/GlobalContext";

function App() {
  return (
    <>
      <AuthProvider>
        <UserProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/register" element={<Register />}></Route>
              <Route path="/login" element={<Login />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashBoard />
                  </ProtectedRoute>
                }
              />
              <Route path="/guest-dashboard" element={<GuestDashboard />} />
              <Route path="/calendar" element={<Calendar />} />
            </Routes>
          </BrowserRouter>
        </UserProvider>
      </AuthProvider>
    </>
  );
}

export default App;
