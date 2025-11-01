import Error from "@/components/organisms/error/Error";
import Layout from "@/components/pages/layout/Layout";
import routes from "@/routes/routes";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

function App() {
  const router = createBrowserRouter([
    {
      element: <Layout />,
      errorElement: <Error />,
      children: routes,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
