// routes/Router.js
import { lazy } from "react";
import { Navigate } from "react-router-dom";

const FullLayout = lazy(() => import("../layouts/FullLayout.js"));
const BoxRater = lazy(() => import("../pages/BoxRater.js"));
const QuickTrade = lazy(() => import("../pages/QuickTrade.js"));
//const InputRater = lazy(() => import("../pages/InputRater.js")); // Assuming this exists

const ThemeRoutes = [
  {
    path: "/",
    element: <FullLayout />,
    children: [
      { index: true, element: <Navigate to="box-rater" replace /> }, // Index route
      { path: "box-rater", element: <BoxRater /> },
      { path: "quick-trade", element: <QuickTrade /> },
      { path: "input-rater", element: <BoxRater /> },
      { path: "*", element: <Navigate to="box-rater" replace /> }, // Fallback route
    ],
  },
];

export default ThemeRoutes;