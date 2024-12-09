import { LucideIcon } from "lucide-react";
import { FC } from "react";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  extraValue?: string;
  href?: string;
}

const DashboardCard: FC<DashboardCardProps> = (props) => {
  return (
    <div className="rounded-lg border shadow-md flex flex-col bg-background">
      <div className="flex items-center justify-between p-4">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">{props.title}</p>
          <h5 className="text-2xl font-semibold">{props.value}</h5>
        </div>
        <div className="p-2 rounded-sm bg-primary/10 flex items-center justify-center">
          {<props.icon className="w-5 h-5 stroke-primary" />}
        </div>
      </div>
      <Separator />
      <div className="bg-accent/40 p-4 flex items-center justify-between h-full">
        {props.extraValue ? <p className="text-sm">{props.extraValue}</p> : <div></div>}
        {props.href ? (
          <Link
            href={props.href}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            View more
          </Link>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default DashboardCard;
