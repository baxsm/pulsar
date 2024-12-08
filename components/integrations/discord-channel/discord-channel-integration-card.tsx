import { FC } from "react";
import IntegrationCard from "@/components/integrations/integration-card";
import DiscordIcon from "@/components/icons/discord-icon";
import { getIntegrationByType } from "@/actions/integration";
import DiscordChannelFooter from "./discord-channel-footer";

const DiscordChannelIntegrationChannel: FC = async () => {
  const discord = await getIntegrationByType("DISCORD_CHANNEL");

  return (
    <IntegrationCard
      icon={DiscordIcon}
      title="Discord Channel"
      description="Invite our Bot to your server. And provide the channel ID, this will send a embedded message to your desired channel."
      footer={<DiscordChannelFooter integration={discord} />}
      type="DISCORD_CHANNEL"
    />
  );
};

export default DiscordChannelIntegrationChannel;
