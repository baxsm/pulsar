import DiscordChannelIntegrationChannel from "@/components/integrations/discord-channel/discord-channel-integration-card";
import DiscordDmIntegrationCard from "@/components/integrations/discord-dm/discord-dm-integration-card";
import SlackIntegrationCard from "@/components/integrations/slack/slack-integration-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FC } from "react";

const Integrations: FC = () => {
  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4 w-full min-h-full">
      <div className="flex w-full">
        <Card className="w-full h-full shadow-none border-none">
          <CardHeader>
            <CardTitle>Integrations</CardTitle>
            <CardDescription>
              Manage your integrations. These are needed to send your events to
              the right place!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid lg:grid-cols-2 gap-4">
              <DiscordDmIntegrationCard />
              <DiscordChannelIntegrationChannel />
              <SlackIntegrationCard />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Integrations;
