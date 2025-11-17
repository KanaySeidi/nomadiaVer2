import Error from "@/components/organisms/error/Error";
import Layout from "@/components/pages/layout/Layout";
import ScrollToTopOnPageChange from "@/hooks/ScrollToTop";
import routes from "@/routes/routes";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { AdminDashboard, AdminLogin, AddTour, EditTour } from "@/components/pages";

function App() {
  const router = createBrowserRouter([
    // Пользовательские роуты с Layout (хедер + футер)
    {
      element: (
        <ScrollToTopOnPageChange>
          <Layout />
        </ScrollToTopOnPageChange>
      ),
      errorElement: <Error />,
      children: routes.filter(route => !route.path.startsWith("/admin")),
    },
    // Админские роуты БЕЗ Layout (без хедера и футера)
    {
      element: (
        <ScrollToTopOnPageChange>
          <Outlet />
        </ScrollToTopOnPageChange>
      ),
      errorElement: <Error />,
      children: [
        { path: "/admin/login", element: <AdminLogin /> },
        { path: "/admin/dashboard", element: <AdminDashboard /> },
        { path: "/admin/tours/add", element: <AddTour /> },
        { path: "/admin/tours/edit/:id", element: <EditTour /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
