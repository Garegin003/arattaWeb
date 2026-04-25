// routes.js or Routes/routes.js
import { createBrowserRouter } from "react-router-dom";
import HomePage from "../components/HomePage";
import FindHome from "../components/FindHome/FindHome";
import AboutUs from "../components/AboutUs/AboutUs";
import Login from "../components/Login/Login";
import AddHome from "../components/AddHome/AddHome";
import HomeDetail from "../components/HomeDetail/HomeDetail";
import AdminHomes from "../components/AdminHomes/AdminHomes";
import PrivateRoute from "./privateRoutes.jsx";
import UploadHomeImages from "../components/AddHome/UploadImage/UploadHomeImages.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/homes",
    element: <FindHome />,
  },
  {
    path: "/homes/home/:uuid",
    element: <HomeDetail />,
  },
  {
    path: "/about_us",
    element: <AboutUs />,
  },
  {
    path: "/admin/login",
    element: <Login />,
  },
  {
    path: "/admin/add_home",
    element: (
      <PrivateRoute>
        <AddHome />
      </PrivateRoute>
    ),
  },
  {
    path: "/admin/upload-images/:id",
    element: (
      <PrivateRoute>
        <UploadHomeImages />
      </PrivateRoute>
    ),
  },
  {
    path: "/admin/homes",
    element: (
      <PrivateRoute>
        <AdminHomes />
      </PrivateRoute>
    ),
  },
]);
