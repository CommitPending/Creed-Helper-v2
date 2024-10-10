// App.js
import React, { Suspense } from 'react';
import { useRoutes } from "react-router-dom";
import { RecoilRoot } from 'recoil'; // Import RecoilRoot
import Themeroutes from "./routes/Router";

const App = () => {
  const routing = useRoutes(Themeroutes);

  return (
    <RecoilRoot>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="dark">{routing}</div>
      </Suspense>
    </RecoilRoot>
  );
};

export default App;
