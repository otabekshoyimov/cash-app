import { Outlet } from "react-router";
import { Sidebar } from "../../../widgets/sidebar/ui/sidebar";

export function Root() {
  return (
    <>
      <div className="flex px-8 h-screen py-8">
        <Sidebar />
        <Outlet />
      </div>
    </>
  );
}
