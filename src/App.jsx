import { BrowserRouter, Routes, Route, useLocation, Outlet } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Contact from "./pages/Contact";
import Reservation from "./pages/Reservation";
import { ThemeProvider } from "./context/ThemeProvider";

// Admin
import { AdminProvider } from "./admin/AdminProvider";
import AdminLogin from "./admin/pages/Login";
import AdminDashboard from "./admin/pages/Dashboard";
import AdminMenu from "./admin/pages/Menu";
import AdminReservations from "./admin/pages/Reservations";
import AdminStaff from "./admin/pages/Staff";
import AdminSettings from "./admin/pages/Settings";
import AdminRoute from "./admin/components/AdminRoute";
import NotFound from "./admin/pages/NotFound";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function AdminRouter() {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route
        path="/"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
      <Route
        path="/menu"
        element={
          <AdminRoute>
            <AdminMenu />
          </AdminRoute>
        }
      />
      <Route
        path="/reservations"
        element={
          <AdminRoute>
            <AdminReservations />
          </AdminRoute>
        }
      />
      <Route
        path="/staff"
        element={
          <AdminRoute>
            <AdminStaff />
          </AdminRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <AdminRoute>
            <AdminSettings />
          </AdminRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <AdminRoute>
            <AdminSettings />
          </AdminRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AdminProvider>
        <BrowserRouter>
          <ScrollToTop />
           <Routes>
            {/* Admin routes */}
            <Route path="/admin/*" element={<AdminRouter />} />

            {/* Public routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/reservation" element={<Reservation />} />
              <Route path="/contact" element={<Contact />} />
            </Route>

            {/* 404 route */}
            <Route path="*" element={<NotFound/>} />
          </Routes>
        </BrowserRouter>
      </AdminProvider>
    </ThemeProvider>
  );
}
