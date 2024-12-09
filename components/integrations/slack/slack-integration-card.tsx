import { FC } from "react";
import IntegrationCard from "@/components/integrations/integration-card";
import { getIntegrationByType, isValidSlackToken } from "@/actions/integration";
import SlackFooter from "./slack-footer";
import SlackIcon from "@/components/icons/slack-icon";

const SlackIntegrationCard: FC = async () => {
  const slack = await getIntegrationByType("SLACK");

  const isValid = await isValidSlackToken(slack?.token)

  return (
    <IntegrationCard
      icon={SlackIcon}
      title="Slack"
      description="Send your events directory to your Slack workplace."
      footer={<SlackFooter isValid={isValid} integration={slack} />}
      type="SLACK"
    />
  );
};

export default SlackIntegrationCard;
