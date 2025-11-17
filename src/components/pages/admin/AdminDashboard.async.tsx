import { lazy } from "react";

const AdminDashboardAsync = lazy(() => import("./AdminDashboard"));

export { AdminDashboardAsync as AdminDashboard };
