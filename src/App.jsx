import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginRegister from "./Components/loginRegister/LoginRegister";
import AdminDash from "./Components/ADMIN/AdminDash"
import Analysis from "./Components/ADMIN/Analysis";
import UserManagement from "./Components/ADMIN/UserManagement";
import UserDash from "./Components/USER/UserDash";
import UserAnalysis from "./Components/USER/UserAnalysis";
import UserLoginRegister from "./Components/loginRegister/UserLoginRegister";



const App = () => {
  return (
    <BrowserRouter>
      <Routes>  
        <Route>
          <Route index element={<LoginRegister />} />
          <Route path="LoginRegister" element={<LoginRegister />} />
          <Route path="AdminDash" element={<AdminDash />} />
          <Route path="Analysis" element={<Analysis />} />
          <Route path="UserManagement" element={<UserManagement />} />

{/* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */}

          <Route path="UserLoginRegister" element={<UserLoginRegister />} />
          <Route path="UserDash" element={<UserDash />} />
          <Route path="UserAnalysis" element={<UserAnalysis/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
