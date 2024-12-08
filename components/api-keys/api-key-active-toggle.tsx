"use client";

import { FC } from "react";
import { Switch } from "@/components/ui/switch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getApiKeyIsActiveByIdentifier,
  toggleApiKeyIsActive,
} from "@/actions/api-key";
import { toast } from "sonner";

interface ApiKeyActiveToggleProps {
  initIsActive: boolean;
  apiIdentifier: string;
}

const ApiKeyActiveToggle: FC<ApiKeyActiveToggleProps> = ({
  initIsActive,
  apiIdentifier,
}) => {
  const { data } = useQuery({
    queryKey: ["api-key-toggle", apiIdentifier],
    queryFn: () => getApiKeyIsActiveByIdentifier(apiIdentifier),
    initialData: initIsActive,
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: toggleApiKeyIsActive,
    onSuccess: () => {
      toast.success("API key has been updated!", {
        id: "api-key-toggle" + apiIdentifier,
      });

      queryClient.invalidateQueries({
        queryKey: ["api-key-toggle", apiIdentifier],
      });
    },
    onError: (error) => {
      toast.error(error.message ?? "Something went wrong", {
        id: "api-key-toggle" + apiIdentifier,
      });
    },
  });

  const handleCheckChange = () => {
    toast.loading("Updating API key", { id: "api-key-toggle" + apiIdentifier });
    mutate(apiIdentifier);
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch
        disabled={isPending}
        id={`active-toggle-${apiIdentifier}`}
        defaultChecked={data}
        onCheckedChange={handleCheckChange}
      />
    </div>
  );
};

export default ApiKeyActiveToggle;
