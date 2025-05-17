import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminDash from "./Components/ADMIN/AdminDashboard"
import Analysis from "./Components/ADMIN/AdminAnalysis";
import UserManagement from "./Components/ADMIN/UserManagement";
import UserDash from "./Components/USER/UserDashboard";
import UserAnalysis from "./Components/USER/UserAnalysis";
import Register from "./Components/Common/Account/Register";
import UserLogin from "./Components/Common/Account/UserLogin";
import AdminLogin from "./Components/Common/Account/AdminLogin";



const App = () => {
  return (
    <BrowserRouter>
      <Routes>  
        <Route>
          <Route index element={<UserLogin />} />
          <Route path="user/login" element={<UserLogin />} />
          <Route path="admin/login" element={<AdminLogin />} />
          <Route path="register" element={<Register />} />

          <Route path="admin/dashboard" element={<AdminDash />} />
          <Route path="admin/analysis" element={<Analysis />} />
          <Route path="admin/usermanagement" element={<UserManagement />} />

{/* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */}

          <Route path="user/dashboard" element={<UserDash />} />
          <Route path="user/analysis" element={<UserAnalysis/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
