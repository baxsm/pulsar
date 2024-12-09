import { FC } from "react";
import { Period } from "@/types/analytics";
import DashboardEventsChart from "./dashboard-events-chart";
import { getEventsStats } from "@/actions/dashboard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Layers2 } from "lucide-react";
import PeriodSelectorWrapper from "./period-selector-wrapper";

interface DashboardEventsProps {
  selectedPeriod: Period;
}

const DashboardEvents: FC<DashboardEventsProps> = async ({
  selectedPeriod,
}) => {
  const data = await getEventsStats(selectedPeriod);

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <div className="flex flex-col space-y-1.5">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Layers2 className="w-6 h-6 text-primary" />
            Events timeline
          </CardTitle>
          <CardDescription>
            Detailed events timeline based on the selected time period.
          </CardDescription>
        </div>
        <PeriodSelectorWrapper selectedPeriod={selectedPeriod} />
      </CardHeader>
      <CardContent>
        <DashboardEventsChart data={data} />
      </CardContent>
    </Card>
  );
};

export default DashboardEvents;
