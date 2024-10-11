import { Navigate } from 'react-router-dom'
import FullLayout from '../layouts/FullLayout.js'
import BoxRater from '../pages/BoxRater.js'
import TradeHelper from '../pages/TradeHelper.js'

const ThemeRoutes = [
  {
    path: '/',
    element: <FullLayout />,
    children: [
      { path: '/', element: <Navigate to="box-rater" replace /> },
      { path: 'box-rater', element: <BoxRater /> },
      { path: 'trade-helper', element: <TradeHelper /> },
      { path: 'input-rater', element: <BoxRater /> },
      { path: '*', element: <Navigate to="box-rater" replace /> },
    ],
  },
]

export default ThemeRoutes
