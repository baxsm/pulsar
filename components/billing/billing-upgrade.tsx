"use client";

import { Plan } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FC } from "react";
import { Card } from "../ui/card";
import { BarChart } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "../ui/skeleton";
import { useRouter } from "next/navigation";
import { createCheckoutSession, getUsage } from "@/actions/billing";

interface BillingUpgradeProps {
  plan: Plan;
}

const BillingUpgrade: FC<BillingUpgradeProps> = ({ plan }) => {
  const router = useRouter();

  const { mutate } = useMutation({
    mutationFn: createCheckoutSession,
    onSuccess: (data) => {
      router.push(data || "");
    },
  });

  const { data } = useQuery({
    queryFn: getUsage,
    queryKey: ["usage"],
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="border-2 border-brand-700 p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <p className="text-sm/6 font-medium">Total events</p>
            <BarChart className="size-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-2xl font-bold">
              {data?.eventsUsed || 0} of{" "}
              {data?.eventsLimit.toLocaleString() || 100}
            </p>
            <p className="text-xs/5 text-muted-foreground">
              Events this period
            </p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <p className="text-sm/6 font-medium">Event categories</p>
            <BarChart className="size-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-2xl font-bold">
              {data?.categoryUsed || 0} of{" "}
              {data?.categoryLimit.toLocaleString() || 10}
            </p>
            <p className="text-xs/5 text-muted-foreground">Active categories</p>
          </div>
        </Card>
      </div>

      <div className="text-gray-600 text-sm">
        Usage will reset{" "}
        {data?.resetDate ? (
          format(data.resetDate, "MMM d, yyyy")
        ) : (
          <Skeleton className="w-fit inline-flex">
            <p className="text-sm opacity-0 ">Jan 1, 0000</p>
          </Skeleton>
        )}{" "}
        {plan !== "PRO" ? (
          <span
            onClick={() => mutate()}
            className="inline underline text-brand-600 cursor-pointer"
          >
            or upgrade now to increase your limit &rarr;
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default BillingUpgrade;
