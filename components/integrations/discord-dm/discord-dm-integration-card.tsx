import { FC } from "react";
import IntegrationCard from "@/components/integrations/integration-card";
import DiscordIcon from "@/components/icons/discord-icon";
import DiscordDmFooter from "./discord-dm-footer";
import { getIntegrationByType } from "@/actions/integration";

const DiscordDmIntegrationCard: FC = async () => {
  const discord = await getIntegrationByType("DISCORD_DM");

  return (
    <IntegrationCard
      icon={DiscordIcon}
      title="Discord DM"
      description="Send your event to your Discord DM. This will directly send a embedded message to your User ID."
      footer={<DiscordDmFooter integration={discord} />}
      type="DISCORD_DM"
    />
  );
};

export default DiscordDmIntegrationCard;
