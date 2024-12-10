import { UserButton } from "@clerk/nextjs";
import { FC } from "react";
import Logo from "@/components/logo";
import DashboardNavigationLinks from "./dashboard-navigation-links";
import ThemeToggle from "../theme-toggle";
import MobileSidebar from "./mobile-sidebar";

const DashboardTopbar: FC = ({}) => {
  return (
    <header className="flex items-center justify-between px-6 py-4 h-14 bg-background">
      <div className="flex items-center gap-4">
        <div className="lg:hidden">
          <MobileSidebar />
        </div>
        <Logo />
      </div>
      <div className="hidden lg:block">
        <DashboardNavigationLinks />
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <UserButton />
      </div>
    </header>
  );
};

export default DashboardTopbar;
