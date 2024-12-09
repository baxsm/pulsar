"use client";

import { FC } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getRecentApiKeyEvents } from "@/actions/api-key";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";
import moment from "moment";

const ApiRecentEvents: FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["api-recent-events"],
    queryFn: getRecentApiKeyEvents,
    refetchInterval: 10000,
  });

  return (
    <Card className="p-6 flex flex-col gap-8">
      <CardTitle className="text-sm font-semibold">Recent Events</CardTitle>
      <div className="flex flex-col gap-2">
        {isLoading ? (
          <>
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="w-full h-14" />
            ))}
          </>
        ) : !data || data.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent events</p>
        ) : (
          data.map((event) => (
            <div
              className="flex items-center gap-2 justify-between pb-4 border-b"
              key={event.id}
            >
              <div className="flex flex-col gap-2">
                <h5 className="text-sm font-semibold">{event.name}</h5>
                <Badge variant="secondary">{event.ApiKey?.identifier}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {moment(event.updatedAt).format("h:mm A")}
              </p>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default ApiRecentEvents;
