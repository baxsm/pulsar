import { FC, ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      {children}
    </div>
  );
};

export default Layout;
