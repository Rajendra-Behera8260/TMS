import Navbar from "../component/navbar/Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="app-shell">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default Layout;
