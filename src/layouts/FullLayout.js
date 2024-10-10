import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Container } from "reactstrap";

const FullLayout = () => {
  const location = useLocation();

  useEffect(() => {
    // This will run whenever the route changes
    console.log("Route changed: ", location.pathname);
  }, [location]);

  return (
    <main>
      <Header />
      <div className="pageWrapper d-lg-flex">
        <aside className="sidebarArea shadow" id="sidebarArea">
          <Sidebar />
        </aside>
        <div className="contentArea">
          <Container className="p-4" fluid>
            <Outlet />
          </Container>
        </div>
      </div>
    </main>
  );
};

export default FullLayout;
