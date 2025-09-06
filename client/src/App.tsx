import { type SVGProps } from "react";
import { NavLink, Outlet } from "react-router";

export function App() {
  return (
    <>
      <div className="flex px-16 h-screen ">
        <Sidebar />
        <Outlet />
      </div>
    </>
  );
}

const Sidebar = () => {
  return (
    <>
      <nav className="w-[250px] pt-[36px] h-screen flex flex-col">
        <header className="pb-20 text-xl font-medium pl-6">Cash app</header>
        <div className="pr-16 flex flex-col  flex-1 ">
          <div className="">
            <NavlinkItem linkLabel="Activity" linkTo={"/"} />
            <NavlinkItem linkLabel="Cash" linkTo={"/cash"} />
            <NavlinkItem linkLabel="Savings" linkTo={"/savings"} />
            <NavlinkItem linkLabel="Card" linkTo={"/card"} />
            <NavlinkItem linkLabel="Pay & Request" linkTo={"/pay"} />
            <NavlinkItem linkLabel="Tax filling" linkTo={"/tax"} />
            <NavlinkItem linkLabel="Documents" linkTo={"/docs"} />
          </div>
          <div className="mt-auto pb-16">
            <NavlinkItem linkLabel="Account" linkTo={"/account"} />
            <NavlinkItem linkLabel="Support" linkTo={"/support"} />
            <NavlinkItem linkLabel="Log out" linkTo={"/logout"} />
          </div>
        </div>
      </nav>
    </>
  );
};

const NavlinkItem = (props: { linkLabel: string; linkTo: string }) => {
  return (
    <NavLink
      to={props.linkTo}
      className={({ isActive }) => {
        return ` flex font-medium px-8 py-4 rounded-md hover:bg-[#d9f9e3] hover:text-[#01b741] ${isActive ? "text-[#01b741] bg-[#d9f9e3]" : ""}`;
      }}
    >
      {props.linkLabel}
    </NavLink>
  );
};

export function FluentShiftsActivity24Filled(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      {/* Icon from Fluent UI System Icons by Microsoft Corporation - https://github.com/microsoft/fluentui-system-icons/blob/main/LICENSE */}
      <path
        fill="currentColor"
        d="M11.11 4.049a1 1 0 1 0-.22-1.988C5.888 2.614 2 6.852 2 12c0 5.523 4.477 10 10 10c5.146 0 9.383-3.887 9.939-8.885a1 1 0 0 0-1.988-.221A8.001 8.001 0 0 1 4 12a8 8 0 0 1 7.11-7.951m3.657-1.658a1 1 0 0 0-.54 1.925q.432.122.842.29a1 1 0 0 0 .757-1.852a10 10 0 0 0-1.059-.363m2.582 2.3a1 1 0 0 1 1.413-.06q.318.291.609.608a1 1 0 0 1-1.474 1.352a8 8 0 0 0-.486-.486a1 1 0 0 1-.062-1.413M11 6a1 1 0 0 1 1 1v5h3a1 1 0 1 1 0 2h-4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1m8.94 1.623a1 1 0 0 1 1.304.547a10 10 0 0 1 .365 1.063a1 1 0 1 1-1.925.54a8 8 0 0 0-.291-.846a1 1 0 0 1 .546-1.304"
      />
    </svg>
  );
}
