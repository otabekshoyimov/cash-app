import { Outlet } from "react-router";
import { Sidebar } from "../../../widgets/sidebar/ui/sidebar";
import { useEffect, useState } from "react";

export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1024);

  useEffect(() => {
    function handleResize() {
      setIsDesktop(window.innerWidth > 1024);
    }
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isDesktop;
}

export function Root() {
  const isDesktop = useIsDesktop();
  return (
    <>
      <div className={`${isDesktop ? "flex" : ""} h-screen py-8`}>
        <Sidebar isDesktop={isDesktop} />
        <Outlet />
      </div>
    </>
  );
}
