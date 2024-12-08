import DashboardProviders from "@/components/providers/dashboard-providers";
import { FC, ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return <DashboardProviders>{children}</DashboardProviders>;
};

export default Layout;
