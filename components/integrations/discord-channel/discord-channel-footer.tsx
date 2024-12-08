import { Integration } from "@prisma/client";
import { FC } from "react";
import IntegrationActiveToggle from "../integration-active-toggle";
import DiscordChannelForm from "./discord-channel-form";

interface DiscordChannelFooterProps {
  integration: Integration | null;
}

const DiscordChannelFooter: FC<DiscordChannelFooterProps> = ({
  integration,
}) => {
  return (
    <>
      <DiscordChannelForm token={integration?.token} />
      {integration?.token ? (
        <IntegrationActiveToggle
          initIsActive={integration.isActive}
          type={integration.type}
        />
      ) : (
        <p className="text-xs tracking-tight text-destructive">
          Missing Channel ID
        </p>
      )}
    </>
  );
};

export default DiscordChannelFooter;
