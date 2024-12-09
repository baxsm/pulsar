"use client";

import { Button } from "@/components/ui/button";
import { Workflow } from "lucide-react";
import { FC } from "react";

const SlackInstallButton: FC = ({}) => {
  const handleClick = () => {
    const SLACK_OAUTH_URL = "https://slack.com/oauth/v2/authorize";

    // const redirectUri = encodeURIComponent(
    //   `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/integrations/slack`
    // );
    const redirectUri = encodeURIComponent("https://a759-154-192-18-25.ngrok-free.app/dashboard/integrations/slack")

    const clientId = String(process.env.NEXT_PUBLIC_SLACK_CLIENT_ID);

    const scopes = [
      "channels:read",
      "chat:write",
      "groups:read",
      "users:read",
      "users:read.email",
    ].join(",");

    const userScopes = "identity.basic,identity.email";
    const state = encodeURIComponent(Math.random().toString(36).substring(2));
    const responseType = "code";
    const slackOAuthUrl = `${SLACK_OAUTH_URL}?client_id=${clientId}&scope=${encodeURIComponent(
      scopes
    )}&user_scope=${userScopes}&redirect_uri=${redirectUri}&state=${state}&response_type=${responseType}`;

    if (typeof window !== "undefined") {
      try {
        window.location.href = slackOAuthUrl;
      } catch (error) {
        console.error("Failed to redirect:", error);
      }
    } else {
      console.error("Window object is not available.");
    }
  };

  return (
    <Button onClick={handleClick} variant="ghost" size="sm">
      <Workflow className="w-4 mr-1.5" />
      Connect
    </Button>
  );
};

export default SlackInstallButton;
