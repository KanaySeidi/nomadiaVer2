import {
  About,
  AdminDashboard,
  AdminLogin,
  CA,
  DetailTour,
  KG,
  KZ,
  Main,
  ProtectedRoute,
  TJK,
  TRK,
  UZB,
} from "@/components/pages";

const routes = [
  { path: "/", element: <Main /> },
  { path: "/kyrgyzstan", element: <KG /> },
  { path: "/central", element: <CA /> },
  { path: "/about", element: <About /> },
  { path: "/central/kazakhstan", element: <KZ /> },
  { path: "/central/uzbekistan", element: <UZB /> },
  { path: "/central/tadjikistan", element: <TJK /> },
  { path: "/central/turkmenistan", element: <TRK /> },
  { path: "/tour/:id", element: <DetailTour /> },
  
  // Админ роуты (временно без защиты, пока бекенд не работает)
  { path: "/admin/login", element: <AdminLogin /> },
  { path: "/admin/dashboard", element: <AdminDashboard /> },
  
  // Защищенные админские роуты (закомментировано, пока бекенд не работает)
  // {
  //   path: "/admin",
  //   element: <ProtectedRoute />,
  //   children: [
  //     { path: "dashboard", element: <AdminDashboard /> },
  //   ],
  // },
];

export default routes;
