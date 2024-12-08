import DashboardTopbar from "@/components/topbar/dashboard-topbar";
import { FC, ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen">
      <DashboardTopbar />
      <div className="bg-accent overflow-y-auto w-full h-full">
        <div className="flex-1 container p-4 text-accent-foreground w-full h-full mx-auto">
          {children}
          <div className="h-4"/>
        </div>
      </div>
    </div>
  );
};

export default Layout;
