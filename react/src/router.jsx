import { createBrowserRouter, Navigate } from "react-router-dom";
import Dashboard from "./views/Dashboard";
import Surveys from "./views/Surveys";
import Login from "./views/Login";
import Signup from "./views/Signup";
import RootLayout from "./layouts/RootLayout";
import GuestLayout from "./layouts/GuestLayout";
import DefaultLayout from "./layouts/DefaultLayout";
import SurveyView from "./views/SurveyView";
import SurveyPublicView from "./views/SurveyPublicView";
import NotFound from "./views/NotFound";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <DefaultLayout />,
        children: [
          {
            path: "/dashboard",
            element: <Navigate to="/" />,
          },
          {
            path: "/",
            element: <Dashboard />,
            handle: {
              title: "Dashboard",
            },
          },
          {
            path: "/surveys",
            element: <Surveys />,
            handle: {
              title: "Surveys",
            },
          },
          {
            path: "/surveys/create",
            element: <SurveyView />,
            handle: {
              title: "Create Survey",
            },
          },
          {
            path: "/surveys/:id",
            element: <SurveyView />,
            handle: {
              title: "Edit Survey",
            },
          },
        ],
      },
      {
        element: <GuestLayout />,
        children: [
          {
            path: "/login",
            element: <Login />,
            handle: {
              title: "Login",
            },
          },
          {
            path: "/signup",
            element: <Signup />,
            handle: {
              title: "Signup",
            },
          },
        ],
      },
      {
        path: "/survey/public/:slug",
        element: <SurveyPublicView />,
        handle: { title: "Survey" },
      },
      {
        path: "*",
        element: <NotFound />,
        handle: { title: "Not Found" },
      },
    ],
  },
]);

export default router;