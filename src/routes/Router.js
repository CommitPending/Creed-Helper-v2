import { Navigate } from "react-router-dom";
import FullLayout from "../layouts/FullLayout.js";
import BoxRater from "../pages/BoxRater.js";
import QuickTrade from "../pages/QuickTrade.js";


const ThemeRoutes = [
  {
    path: "/",
    element: <FullLayout />,
    children: [
      { path: "/", element: <Navigate to="box-rater" replace /> }, 
      { path: "box-rater", element: <BoxRater /> },
      { path: "quick-trade", element: <QuickTrade /> },
      { path: "input-rater", element: <BoxRater /> }, 
      { path: "*", element: <Navigate to="box-rater" replace /> }, 
    ],
  },
];

export default ThemeRoutes;
