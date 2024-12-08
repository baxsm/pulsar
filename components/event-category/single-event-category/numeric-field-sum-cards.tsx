"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEventCategoryStore } from "@/store/event-category-store";
import { isAfter, isToday, startOfMonth, startOfWeek } from "date-fns";
import { BarChart } from "lucide-react";
import { FC, useMemo } from "react";

const NumericFieldSumCards: FC = () => {
  const { eventData, isDataLoading, activeTab } = useEventCategoryStore();

  const numericFieldSums = useMemo(() => {
    if (!eventData?.events || eventData.events.length === 0) {
      return {};
    }

    const sums: Record<
      string,
      {
        total: number;
        thisWeek: number;
        thisMonth: number;
        today: number;
      }
    > = {};

    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 0 });
    const monthStart = startOfMonth(now);

    eventData.events.forEach((event) => {
      const eventDate = event.createdAt;

      Object.entries(event.fields as object).forEach(([field, value]) => {
        if (typeof value === "number") {
          if (!sums[field]) {
            sums[field] = {
              total: 0,
              thisWeek: 0,
              thisMonth: 0,
              today: 0,
            };
          }

          sums[field].total += value;

          if (
            isAfter(eventDate, weekStart) ||
            eventDate.getTime() === weekStart.getTime()
          ) {
            sums[field].thisWeek += value;
          }

          if (
            isAfter(eventDate, monthStart) ||
            eventDate.getTime() === monthStart.getTime()
          ) {
            sums[field].thisMonth += value;
          }

          if (isToday(eventDate)) {
            sums[field].today += value;
          }
        }
      });
    });

    return sums;
  }, [eventData.events]);

  const NumericFieldSumCards = () => {
    if (Object.keys(numericFieldSums).length === 0) {
      return null;
    }

    return Object.entries(numericFieldSums).map(([field, sums]) => {
      const relevantSum =
        activeTab === "today"
          ? sums.today
          : activeTab === "week"
          ? sums.thisWeek
          : sums.thisMonth;

      return (
        <Card key={field} className="p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <p className="text-sm font-medium">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </p>
            <BarChart className="size-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-2xl font-bold">{relevantSum.toFixed(2) || 0}</p>
            <p className="text-xs text-muted-foreground">
              {activeTab === "today"
                ? "today"
                : activeTab === "week"
                ? "this week"
                : "this month"}
            </p>
          </div>
        </Card>
      );
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <Card className="border-2 border-primary p-6">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium">Total events</p>
          <BarChart className="size-4 text-muted-foreground" />
        </div>
        <div>
          {isDataLoading ? (
            <Skeleton className="w-fit">
              <p className="text-2xl font-bold opacity-0">00000</p>
            </Skeleton>
          ) : (
            <p className="text-2xl font-bold">
              {eventData?.totalEventsCount || 0}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Events{" "}
            {activeTab === "today"
              ? "today"
              : activeTab === "week"
              ? "this week"
              : "this month"}
          </p>
        </div>
      </Card>

      <NumericFieldSumCards />
    </div>
  );
};

export default NumericFieldSumCards;
