import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "@/api/authStore/authStore";

/**
 * Компонент защищенного маршрута
 * Проверяет авторизацию и редиректит на логин, если пользователь не авторизован
 */
export default function ProtectedRoute() {
  const { isAuthenticated, checkAuth } = useAuthStore();

  // Проверяем авторизацию
  const isAuth = checkAuth();

  if (!isAuth || !isAuthenticated) {
    // Если не авторизован, редиректим на страницу логина
    return <Navigate to="/admin/login" replace />;
  }

  // Если авторизован, рендерим дочерние компоненты
  return <Outlet />;
}
