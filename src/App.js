// App.js
import React from 'react';
import { HashRouter as Router, useRoutes } from "react-router-dom";
import { RecoilRoot } from 'recoil'; // Import RecoilRoot
import Themeroutes from "./routes/Router";

const AppRoutes = () => {
  const routing = useRoutes(Themeroutes);
  return <div className="dark">{routing}</div>;
};

const App = () => {
  return (
    <RecoilRoot>
        <AppRoutes />
    </RecoilRoot>
  );
};

export default App;
