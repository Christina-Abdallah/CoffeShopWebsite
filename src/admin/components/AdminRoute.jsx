import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../useAdmin";

export default function AdminRoute({ children }) {
  const { user, loading } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/admin/login", { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-cream-50 text-ink-light">Loading...</div>;
  }

  return user ? children : null;
}
