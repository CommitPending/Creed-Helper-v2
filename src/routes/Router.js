import { lazy } from "react";
import { Navigate } from "react-router-dom";

const FullLayout = lazy(() => import("../layouts/FullLayout.js"));

const BoxRater = lazy(() => import("../pages/BoxRater.js"));
const QuickTrade = lazy(() => import("../pages/QuickTrade.js"));

const ThemeRoutes = [
  {
    path: "/",
    element: <FullLayout />,
    children: [
      { path: "/", element: <Navigate to="/box-rater" /> },
      { path: "/box-rater", exact: true, element: <BoxRater /> },
      { path: "/quick-trade", exact: true, element: <QuickTrade /> },
    ],
  },
];

export default ThemeRoutes;
