// App.js
import { useRoutes } from "react-router-dom";
import { RecoilRoot } from 'recoil'; // Import RecoilRoot
import Themeroutes from "./routes/Router";

const App = () => {
  const routing = useRoutes(Themeroutes);

  return (
    <RecoilRoot>
      <div className="dark">{routing}</div>
    </RecoilRoot>
  );
};

export default App;
