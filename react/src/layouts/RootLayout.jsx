import { Outlet } from "react-router-dom";
import RouteTitleManager from "../components/RouteTitleManager";

export default function RootLayout() {
  return (
    <>
      <RouteTitleManager />
      <Outlet />
    </>
  );
}
