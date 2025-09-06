import { Outlet } from "react-router";
import { Sidebar } from "../../widgets/sidebar/ui/sidebar";

export function Root() {
  return (
    <>
      <div className="flex px-16 h-screen ">
        <Sidebar />
        <Outlet />
      </div>
    </>
  );
}
