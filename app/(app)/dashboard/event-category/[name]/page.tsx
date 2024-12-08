import { getEventCategoryByName } from "@/actions/event-category";
import CategoryFilters from "@/components/event-category/single-event-category/category-filters";
import EmptyCategoryState from "@/components/event-category/single-event-category/empty-category-state";
import EventCategoryTable from "@/components/event-category/single-event-category/event-category-table";
import NumericFieldSumCards from "@/components/event-category/single-event-category/numeric-field-sum-cards";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { notFound } from "next/navigation";
import { FC } from "react";

interface PageProps {
  params: Promise<{
    name: string | string[] | undefined;
  }>;
}

const Page: FC<PageProps> = async ({ params }) => {
  const { name } = await params;

  if (!name || typeof name !== "string") {
    notFound();
  }

  const category = await getEventCategoryByName(name);

  const hasNoEvents = category?._count.eventList === 0;

  return hasNoEvents ? (
    <EmptyCategoryState categoryName={category.name} />
  ) : (
    <div className="flex flex-col-reverse lg:flex-row gap-4 w-full min-h-full">
      <div className="flex w-full">
        <Card className="w-full h-full shadow-none border-none">
          <CardHeader className="space-y-0 flex flex-row items-center justify-between">
            <div className="flex flex-col space-y-1.5">
              <CardTitle>
                {category?.emoji} {category?.name} events
              </CardTitle>
              <CardDescription>
                List of all the events assosiated to this category.
              </CardDescription>
            </div>
            {!hasNoEvents && <CategoryFilters />}
          </CardHeader>
          <CardContent>
            <EventCategoryTable
              categoryName={category?.name || ""}
              hasEvents={!hasNoEvents}
            />
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col gap-4 w-full max-w-sm">
        {hasNoEvents ? (
          <Card className="p-4">
            <h5 className="text-sm text-muted-foreground font-medium">
              No events recorded yet!
            </h5>
          </Card>
        ) : (
          <NumericFieldSumCards />
        )}
      </div>
    </div>
  );
};

export default Page;
