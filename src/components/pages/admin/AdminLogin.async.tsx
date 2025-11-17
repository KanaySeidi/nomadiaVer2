import { lazy } from "react";

const AdminLoginAsync = lazy(() => import("./AdminLogin"));

export { AdminLoginAsync as AdminLogin };
