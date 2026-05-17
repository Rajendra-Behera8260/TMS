import { Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout";
import Home1 from "./pages/Home1";
import About1 from "./pages/About1";
import Contact1 from "./pages/Contact1";
import Login1 from "./pages/Login1";
import Signup from "./pages/Signup";
import ProtectedRoute from "./component/ProtectedRoute";
import GuestRoute from "./component/GuestRoute";
import DashboardLayout from "./component/dashboard/Dashboard";
import DashboardHome from "./pages/DashboardHome";
import Vehicles from "./pages/Veichiles";
import Drivers from "./pages/Drivers";
import Mmap from "./pages/Mmap";
import Booking from "./pages/Booking";
import Report from "./pages/Report";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home1 />} />
        <Route path="about" element={<About1 />} />
        <Route path="contact" element={<Contact1 />} />
        <Route
          path="login"
          element={
            <GuestRoute>
              <Login1 />
            </GuestRoute>
          }
        />
        <Route
          path="signup"
          element={
            <GuestRoute>
              <Signup />
            </GuestRoute>
          }
        />
      </Route>

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="vehicles" element={<Vehicles />} />
        <Route path="drivers" element={<Drivers />} />
        <Route path="routes" element={<Mmap />} />
        <Route path="booking" element={<Booking />} />
        <Route path="reports" element={<Report />} />
      </Route>
    </Routes>
  );
}

export default App;
