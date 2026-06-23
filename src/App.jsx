import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Auth context - wraps the whole app so all pages know who's logged in
import { AuthProvider, useAuth } from "./context/AuthContext";

// Layout
import Navbar from "./components/Navbar";
import CarLoader from "./components/CarLoader"
import Footer from "./components/Footer";

// Public pages - anyone can visit
import Home from "./pages/Home";
import BuyCars from "./pages/BuyCars";
import About from "./pages/About";
import Contact from "./pages/Contact";
import { Rating } from "./pages/Rating";

// Auth pages
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

// Protected pages - only logged-in users
import SellCar from "./pages/SellCar";
import Dashboard from "./pages/Dashboard";

// Admin pages - only admin
import AdminLogin from "./admin/AdminLogin";
import AdminPanel from "./admin/AdminPanel";
import NotFound from "./pages/NotFound";


// ── Protected Route: redirects to /signin if not logged in
function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();
  if (loading) return <div style={{ color: "#fff", padding: 40, textAlign: "center" }}>Loading...</div>;
  if (!isLoggedIn) return <Navigate to="/signin" replace />;
  return children;
}

// ── Admin Route: redirects to /admin/login if not admin
function AdminRoute({ children }) {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  if (!isAdmin) return <Navigate to="/admin/login" replace />;
  return children;
}

// ── Public layout: shows Navbar + Footer around the page
function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <CarLoader />
    </>
  );
}

// ── App with all routes defined
function AppRoutes() {
  return (
    <Routes>
      {/* Public routes - visible to everyone */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/buy" element={<PublicLayout><BuyCars /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
      <Route path="/ratings" element={<PublicLayout><Rating /></PublicLayout>} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="*" element={<NotFound/>} />
      {/* Protected routes - need to be logged in */}
      <Route path="/sell" element={
        <ProtectedRoute>
          <PublicLayout><SellCar /></PublicLayout>
        </ProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <PublicLayout><Dashboard /></PublicLayout>
        </ProtectedRoute>
      } />

      {/* Admin routes - separate login */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />

      {/* Catch-all: redirect unknown URLs to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// ── Root App: AuthProvider wraps everything
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
