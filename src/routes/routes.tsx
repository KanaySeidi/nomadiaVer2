import {
  About,
  CA,
  DetailTour,
  KG,
  KZ,
  Main,
  TJK,
  TRK,
  UZB,
} from "@/components/pages";

const routes = [
  {
    path: "/",
    element: <Main />,
  },
  { path: "/kyrgyzstan", element: <KG /> },
  { path: "/central", element: <CA /> },
  { path: "/about", element: <About /> },
  { path: "/central/kazakhstan", element: <KZ /> },
  { path: "/central/uzbekistan", element: <UZB /> },
  { path: "/central/tadjikistan", element: <TJK /> },
  { path: "/central/turkmenistan", element: <TRK /> },
  { path: "/tour/:id", element: <DetailTour /> },
  // { path: "/admin/sign", element: <AdminPanel /> },
  // { path: "/admin/tours/kyrgyzstan", element: <KyrgyzstanTours /> },
  // { path: "/admin/tours/addKGTours", element: <AddTour /> },
  // { path: "/admin/tours/addCentralAsiaTours", element: <AddTour /> },
  // { path: "/admin/tours/centralAsia", element: <CentralAsiaTours /> },
  // { path: "/admin/staff", element: <AdminAbout /> },
  // { path: "/admin/pictures", element: <Pictures /> },
  // { path: "/admin/video", element: <Video /> },
  // { path: "/admin/tour_detail/:id", element: <TourDetail /> },
  // { path: "/admin/staff_details/:id", element: <StaffDetails /> },
];

export default routes;
