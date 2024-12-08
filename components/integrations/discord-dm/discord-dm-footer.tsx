import { Integration } from "@prisma/client";
import { FC } from "react";
import DiscordManageForm from "./discord-dm-manage-form";
import IntegrationActiveToggle from "../integration-active-toggle";

interface DiscordDmFooterProps {
  integration: Integration | null;
}

const DiscordDmFooter: FC<DiscordDmFooterProps> = ({ integration }) => {
  return (
    <>
      <DiscordManageForm token={integration?.token }/>
      {integration?.token ? (
        <IntegrationActiveToggle
          initIsActive={integration.isActive}
          type={integration.type}
        />
      ) : (
        <p className="text-xs tracking-tight text-destructive">
          Missing User ID
        </p>
      )}
    </>
  );
};

export default DiscordDmFooter;
