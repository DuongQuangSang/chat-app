import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router";

const ProtectedRoute = () => {
  const { accessToken, loading, init } = useAuthStore();

  useEffect(() => {
    init();
  }, [init]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Đang tải trang..</div>;
  }
  if (!accessToken) {
    return <Navigate to="/signin" replace />;
  }
  return <Outlet></Outlet>;
};

export default ProtectedRoute;
