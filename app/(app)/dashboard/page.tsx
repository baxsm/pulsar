import DashboardCards from "@/components/dashboard/dashboard-cards";
import DashboardEvents from "@/components/dashboard/dashboard-events";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Period } from "@/types/analytics";
import { FC } from "react";

interface DashboardProps {
  searchParams: Promise<{
    month?: string;
    year?: string;
  }>;
}

const Dashboard: FC<DashboardProps> = async ({ searchParams }) => {
  const { month, year } = await searchParams;

  const currentDate = new Date();
  const period: Period = {
    month: month ? parseInt(month) : currentDate.getMonth(),
    year: year ? parseInt(year) : currentDate.getFullYear(),
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4 w-full min-h-full">
      <div className="flex w-full">
        <Card className="w-full h-full shadow-none border-none">
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
            <CardDescription>
              View all of your analytics in one place.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <DashboardCards />
              <DashboardEvents selectedPeriod={period} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
