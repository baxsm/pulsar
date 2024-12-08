"use client";

import { dashboardLinks } from "@/constants/dashboard";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC } from "react";

const DashboardNavigationLinks: FC = () => {
  const pathname = usePathname();

  const activeRoute = dashboardLinks.reduce((bestMatch, route) => {
    if (
      pathname.startsWith(route.href) &&
      (!bestMatch || route.href.length > bestMatch.href.length)
    ) {
      return route;
    }
    return bestMatch;
  }, dashboardLinks[0] || null);

  return (
    <div className="flex flex-col lg:flex-row gap-0">
      {dashboardLinks.map((item) => {
        const isActive = activeRoute.href === item.href;

        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-2 text-sm font-semibold text-muted-foreground px-4 rounded-lg py-2",
              isActive && "text-foreground"
            )}
          >
            <div
              className={cn(
                "w-2 h-2 rounded-full bg-primary opacity-0",
                isActive && "opacity-100 animate-pulse"
              )}
            />
            {item.name}
          </Link>
        );
      })}
    </div>
  );
};

export default DashboardNavigationLinks;
