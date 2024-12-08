import AllApiKeysCards from "@/components/api-keys/all-api-keys-cards";
import CreateApiKeyDialog from "@/components/api-keys/create-api-key-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FC } from "react";

const ApiKeys: FC = () => {
  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4 w-full min-h-full">
      <div className="flex w-full">
        <Card className="w-full h-full shadow-none border-none">
          <CardHeader>
            <CardTitle>API Keys</CardTitle>
            <CardDescription>
              Below you can find all the API Keys that you have created.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AllApiKeysCards />
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col gap-4 w-full max-w-sm">
        <CreateApiKeyDialog />
        {/* More analytics about api keys */}
      </div>
    </div>
  );
};

export default ApiKeys;
