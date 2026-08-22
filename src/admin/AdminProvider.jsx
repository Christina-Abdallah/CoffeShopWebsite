import { useEffect, useState } from "react";
import { AdminContext } from "./AdminContext";
import { adminMe, adminLogin, adminLogout } from "./api";

export function AdminProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminMe()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const data = await adminLogin(email, password);
    setUser(data);
    return data;
  };

  const logout = async () => {
    await adminLogout();
    setUser(null);
  };

  return (
    <AdminContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}
