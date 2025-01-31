// src/App.js

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import GrievanceForm from "./pages/GrievanceForm";
import Login from "./pages/Login";
import AdminPage from "./pages/AdminPage"; // AdminPage is the page that includes AdminDashboard
import Admin from "./pages/Admin";

function App() {
  return (
    <Router>
      <Routes>
        {/* Regular routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/grievanceform" element={<GrievanceForm />} />

        <Route path="/admin" element={<Admin />} />

        {/* Admin routes */}
        <Route path="/adminpage" element={<AdminPage />} /> {/* AdminPage includes AdminDashboard */}
      </Routes>
    </Router>
  );
}

export default App;
