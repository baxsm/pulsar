import { Integration } from "@prisma/client";
import { FC } from "react";
import IntegrationActiveToggle from "../integration-active-toggle";
import SlackInstallButton from "./slack-install-button";
import SlackRevokeButton from "./slack-revoke-button";
import SlackChannelDialog from "./slack-channel-dialog";
import { getSlackChannelList } from "@/actions/integration";

interface SlackFooterProps {
  integration: Integration | null;
  isValid: boolean;
}

const SlackFooter: FC<SlackFooterProps> = async ({ integration, isValid }) => {
  let slackChannelList = [];

  if (isValid && integration?.token) {
    slackChannelList = await getSlackChannelList(integration?.token);
  }

  return (
    <>
      {integration?.token && isValid ? (
        <>
          <div className="flex items-center gap-2">
            <SlackRevokeButton />
            <SlackChannelDialog
              slackChannelList={slackChannelList}
              channelId={integration.slackChannelId}
            />
          </div>
          <IntegrationActiveToggle
            initIsActive={integration.isActive}
            type={integration.type}
          />
        </>
      ) : (
        <SlackInstallButton />
      )}
    </>
  );
};

export default SlackFooter;
