"use client";

import { FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowRight,
  BarChart2,
  Clock,
  Database,
  PackagePlus,
} from "lucide-react";
import CreateEventCategory from "./create-event-category";
import { getAllEventCategories } from "@/actions/event-category";
import { format, formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import DeleteEventCategory from "./delete-event-category";

const EventCategoryCards: FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["event-category-list"],
    queryFn: getAllEventCategories,
  });

  if (isLoading) {
    return (
      <div className="grid lg:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="w-full rounded-lg h-[250px]" />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="w-full p-4">
        <div className="flex flex-col gap-4 items-center justify-center">
          <div className="bg-accent w-20 h-20 rounded-full flex items-center justify-center">
            <PackagePlus size={40} className="stroke-primary" />
          </div>
          <div className="flex flex-col gap-1 text-center">
            <p className="text-bold">No event category found</p>
            <p className="text-sm text-muted-foreground">
              Click the button below to create your first event category
            </p>
          </div>

          <CreateEventCategory triggerText="Create your first event category" />
        </div>
      </Card>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      {data.map((category) => (
        <Card key={category.id} className="p-6 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div
              className="size-12 rounded-full"
              style={{
                backgroundColor: category.color
                  ? `#${category.color.toString(16).padStart(6, "0")}`
                  : "#f3f4f6",
              }}
            />

            <div>
              <h3 className="text-lg font-medium tracking-tight">
                {category.emoji || "📁"} {category.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {format(category.createdAt, "MMM d, yyyy")}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="size-4 mr-2 text-brand-500" />
              <span className="font-medium">Last ping:</span>
              <span className="ml-1">
                {category.lastPing
                  ? formatDistanceToNow(category.lastPing, {
                      addSuffix: true,
                    })
                  : "Never"}
              </span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Database className="size-4 mr-2 text-brand-500" />
              <span className="font-medium">Unique fields:</span>
              <span className="ml-1">{category.uniqueFieldsCount || 0}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <BarChart2 className="size-4 mr-2 text-brand-500" />
              <span className="font-medium">Events this month:</span>
              <span className="ml-1">{category.eventsCount || 0}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Link
              href={`/dashboard/event-category/${category.name}`}
              className={buttonVariants({
                variant: "outline",
                size: "sm",
                className: "flex items-center gap-2 text-sm",
              })}
            >
              View all <ArrowRight className="size-4" />
            </Link>
            <DeleteEventCategory
              name={category.name}
              eventCategoryId={category.id}
            />
          </div>
        </Card>
      ))}
    </div>
  );
};

export default EventCategoryCards;
