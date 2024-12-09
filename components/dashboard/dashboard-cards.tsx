import { FC } from "react";
import DashboardCard from "./dashboard-card";
import { Key, PackagePlus, Waypoints } from "lucide-react";
import { getDashboardCardsData } from "@/actions/dashboard";

const DashboardCards: FC = async () => {
  const data = await getDashboardCardsData();

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <DashboardCard
        title="Total API Keys"
        value={data.apiKey.total}
        icon={Key}
        href="/dashboard/api-keys"
        extraValue={`${data.apiKey.active} Active`}
      />
      <DashboardCard
        title="Total Event Category"
        value={data.totalEventCategory}
        icon={PackagePlus}
        href="/dashboard/event-category"
      />
      <DashboardCard
        title="Total Events"
        value={data.totalEvents}
        icon={Waypoints}
      />
    </div>
  );
};

export default DashboardCards;
