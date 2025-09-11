import {
  Activity,
  ArrowDownUp,
  CircleUserRound,
  Coins,
  CreditCard,
  File,
  HeartPlus,
  Landmark,
  LogOut,
  PiggyBank,
} from "lucide-react";
import type { ReactNode, SVGProps } from "react";
import { NavLink } from "react-router";

export function Sidebar() {
  return (
    <>
      <nav className="w-[250px] rounded-lg flex flex-col outline outline-1 outline-black/10 bg-white text-zinc-500">
        <header className="py-16 text-lg font-medium px-18 text-[#01b741]">
          $ Cash app
        </header>
        <div className="px-16 flex flex-col  flex-1 text-sm">
          <div className="flex flex-col gap-1 text-base">
            <SideabrNavlinkItem linkLabel="Activity" linkTo={"/"}>
              <Activity color="#666666" size={16} stroke="currentColor" />
            </SideabrNavlinkItem>
            <SideabrNavlinkItem linkLabel="Cash" linkTo={"/cash"}>
              <Coins color="#666666" size={16} stroke="currentColor" />
            </SideabrNavlinkItem>
            <SideabrNavlinkItem linkLabel="Savings" linkTo={"/savings"}>
              <PiggyBank color="#666666" size={16} stroke="currentColor" />
            </SideabrNavlinkItem>
            <SideabrNavlinkItem linkLabel="Card" linkTo={"/card"}>
              <CreditCard color="#666666" size={16} stroke="currentColor" />
            </SideabrNavlinkItem>
            <SideabrNavlinkItem linkLabel="Pay & Request" linkTo={"/pay"}>
              <ArrowDownUp color="#666666" size={16} stroke="currentColor" />
            </SideabrNavlinkItem>
            <SideabrNavlinkItem linkLabel="Tax filling" linkTo={"/tax"}>
              <Landmark color="#666666" size={16} stroke="currentColor" />
            </SideabrNavlinkItem>
            <SideabrNavlinkItem linkLabel="Documents" linkTo={"/docs"}>
              <File color="#666666" size={16} stroke="currentColor" />
            </SideabrNavlinkItem>
          </div>
          <div className="mt-auto pb-16 flex gap-1 flex-col text-base">
            <SideabrNavlinkItem linkLabel="Account" linkTo={"/account"}>
              <CircleUserRound
                color="#666666"
                size={16}
                stroke="currentColor"
              />
            </SideabrNavlinkItem>
            <SideabrNavlinkItem linkLabel="Support" linkTo={"/support"}>
              <HeartPlus color="#666666" size={16} stroke="currentColor" />
            </SideabrNavlinkItem>
            <SideabrNavlinkItem linkLabel="Log out" linkTo={"/logout"}>
              <LogOut color="#666666" size={16} stroke="currentColor" />
            </SideabrNavlinkItem>
          </div>
        </div>
      </nav>
    </>
  );
}

const SideabrNavlinkItem = (props: {
  linkLabel: string;
  linkTo: string;
  children: ReactNode;
}) => {
  return (
    <NavLink
      to={props.linkTo}
      className={({ isActive }) => {
        return `items-center gap-8 flex font-medium px-8 py-4 rounded-md hover:bg-[#d9f9e3]  hover:text-[#01b741] ${isActive ? "text-[#01b741] bg-[#d9f9e3]" : "text-[#666666]"}`;
      }}
    >
      {props.children}
      <span> {props.linkLabel}</span>
    </NavLink>
  );
};

export function FluentShiftsActivity24Filled(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M11.11 4.049a1 1 0 1 0-.22-1.988C5.888 2.614 2 6.852 2 12c0 5.523 4.477 10 10 10c5.146 0 9.383-3.887 9.939-8.885a1 1 0 0 0-1.988-.221A8.001 8.001 0 0 1 4 12a8 8 0 0 1 7.11-7.951m3.657-1.658a1 1 0 0 0-.54 1.925q.432.122.842.29a1 1 0 0 0 .757-1.852a10 10 0 0 0-1.059-.363m2.582 2.3a1 1 0 0 1 1.413-.06q.318.291.609.608a1 1 0 0 1-1.474 1.352a8 8 0 0 0-.486-.486a1 1 0 0 1-.062-1.413M11 6a1 1 0 0 1 1 1v5h3a1 1 0 1 1 0 2h-4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1m8.94 1.623a1 1 0 0 1 1.304.547a10 10 0 0 1 .365 1.063a1 1 0 1 1-1.925.54a8 8 0 0 0-.291-.846a1 1 0 0 1 .546-1.304"
      ></path>
    </svg>
  );
}

export function MdiCashUsdOutline(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        d="M20 18H4V6h16m0-2H4c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2m-9 13h2v-1h1a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-3v-1h4V8h-2V7h-2v1h-1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h3v1H9v2h2v1z"
        fill="currentColor"
      ></path>
    </svg>
  );
}

export function BiCreditCard(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 16 16"
      {...props}
    >
      <g fill="currentColor">
        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v1h14V4a1 1 0 0 0-1-1zm13 4H1v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z"></path>
        <path d="M2 10a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z"></path>
      </g>
    </svg>
  );
}
