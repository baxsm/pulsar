import { getUserPlan } from "@/actions/billing";
import BillingUpgrade from "@/components/billing/billing-upgrade";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FC } from "react";

const Billing: FC = async () => {
  const plan = await getUserPlan();

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4 w-full min-h-full">
      <div className="flex w-full">
        <Card className="w-full h-full shadow-none border-none">
          <CardHeader>
            <CardTitle>{plan === "PRO" ? "Plan: Pro" : "Plan: Free"}</CardTitle>
            <CardDescription>
              {plan === "PRO"
                ? "Thank you for supporting Pulsar. Find your increased usage limits below."
                : "Get access to more events, categories and premium support."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BillingUpgrade plan={plan}/>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Billing;
