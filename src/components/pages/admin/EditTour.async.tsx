import { lazy } from "react";

export const EditTourAsync = lazy(() =>
  import("./EditTour").then((module) => ({ default: module.default }))
);
