"use client";

import { FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllApiKeys } from "@/actions/api-key";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import moment from "moment";
import ApiKeyActiveToggle from "./api-key-active-toggle";
import { Skeleton } from "@/components/ui/skeleton";
import DeleteApiKeyDialog from "./delete-api-key-dialog";
import { Key } from "lucide-react";
import CreateApiKeyDialog from "./create-api-key-dialog";

const AllApiKeysCards: FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["api-key-list"],
    queryFn: getAllApiKeys,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="w-full rounded-lg h-[165px]" />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="w-full p-4">
        <div className="flex flex-col gap-4 items-center justify-center">
          <div className="bg-accent w-20 h-20 rounded-full flex items-center justify-center">
            <Key size={40} className="stroke-primary" />
          </div>
          <div className="flex flex-col gap-1 text-center">
            <p className="text-bold">No API keys created yet</p>
            <p className="text-sm text-muted-foreground">
              Click the button below to create your first API Key
            </p>
          </div>

          <CreateApiKeyDialog triggerText="Create your first API key" />
        </div>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {data.map((apiKey) => (
        <Card key={apiKey.identifier}>
          <CardHeader className="space-y-0 flex flex-row items-center justify-between gap-2">
            <div className="flex flex-col space-y-1.5">
              <CardTitle className="text-xl font-semibold tracking-tight">
                {apiKey.title}
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                {moment(apiKey.createdAt).format("DD MMM, YYYY h:mm A")}
              </p>
            </div>
            <Badge variant="outline">{apiKey.identifier}</Badge>
          </CardHeader>
          <CardContent className="bg-accent/40 pb-0 py-4 rounded-bl-lg rounded-br-lg">
            <div className="w-full h-full flex items-center justify-between gap-2">
              <ApiKeyActiveToggle
                initIsActive={apiKey.isActive}
                apiIdentifier={apiKey.identifier}
              />
              <DeleteApiKeyDialog
                identifier={apiKey.identifier}
                title={apiKey.title}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AllApiKeysCards;
