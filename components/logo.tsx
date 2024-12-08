"use client";

import { FC } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { HeartPulse } from "lucide-react";

interface LogoProps {
  fontSize?: string;
  iconSize?: number;
  href?: string;
}

const Logo: FC<LogoProps> = ({
  fontSize = "text-2xl",
  iconSize = 20,
  href = "/dashboard",
}) => {
  return (
    <Link
      href={href}
      className={cn(
        "text-2xl font-extrabold flex items-center gap-2",
        fontSize
      )}
    >
      <div className="rounded-xl bg-gradient-to-r from-primary/80 to-primary p-2">
        <HeartPulse size={iconSize} className="text-white" />
      </div>
      <div className="">
        <span className="bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-transparent">
          P
        </span>
        <span className="text-slate-700 dark:text-slate-300">ulsar</span>
      </div>
    </Link>
  );
};

export default Logo;
