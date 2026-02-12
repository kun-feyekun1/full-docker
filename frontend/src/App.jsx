import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
// import Dashboard from './pages/Dashboard';
// import Login from './pages/Login';

import Home from "./pages/Home/Home";
// import Market from "./pages/market/Market";
import EmailDashboard from "./pages/Dashboard/EmailDashboard";
import OrderManagement from "./pages/orders/OrderManagement";
import ProductManagement from "./pages/products/ProductManagement";
import UserManagement from "./pages/users/UserManagement";
import ContactUs from "./pages/ContactUs/ContactUs";
import AboutUs from "./pages/About/AboutUs";
import Features from "./pages/features/Features";
import Auths from "./pages/auth/Auths";
import Footer from "./components/Footer";
import Profile from "./pages/users/Profile"

import Privacy from "./pages/policies/Privacy";
import Terms from "./pages/policies/Terms";
import Cookies from "./pages/policies/Cookies";

import "./styles/App.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="w-full flex flex-col">
          <Navbar />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              {/* <Route path="/market" element={<Market />} /> */}
              <Route path="/EmailDashboard" element={<EmailDashboard />} />
              <Route path="/OrderManagement" element={<OrderManagement />} />
              <Route
                path="/ProductManagement"
                element={<ProductManagement />}
              />
              <Route path="/UserManagement" element={<UserManagement />} />
              <Route path="/ContactUs" element={<ContactUs />} />
              <Route path="/AboutUs" element={<AboutUs />} />
              <Route path="/Features" element={<Features />} />
              <Route path="/Auths" element={<Auths />} />
              <Route path="/Profile" element={<Profile />} />
              {/* <Route path="/dashboard" element={<Dashboard />} /> */}
              {/* <Route path="/login" element={<Login />} /> */}
              <Route path="/" element={<Home />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/cookies" element={<Cookies />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
