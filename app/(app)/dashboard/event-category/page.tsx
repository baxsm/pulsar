import CreateEventCategory from "@/components/event-category/create-event-category";
import EventCategoryCards from "@/components/event-category/event-category-cards";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FC } from "react";

const EventCategory: FC = () => {
  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4 w-full min-h-full">
      <div className="flex w-full">
        <Card className="w-full h-full shadow-none border-none">
          <CardHeader>
            <CardTitle>Event Category</CardTitle>
            <CardDescription>
              List of all of your event categories.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EventCategoryCards />
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col gap-4 w-full max-w-sm">
        <CreateEventCategory />
        {/* More analytics about api keys */}
      </div>
    </div>
  );
};

export default EventCategory;
