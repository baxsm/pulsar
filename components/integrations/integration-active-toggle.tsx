"use client";

import { FC } from "react";
import { Switch } from "@/components/ui/switch";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { IntegrationType } from "@prisma/client";
import {
  getIntegrationIsActiveByType,
  toggleIntegrationIsActive,
} from "@/actions/integration";

interface IntegrationActiveToggleProps {
  initIsActive: boolean;
  type: IntegrationType;
}

const IntegrationActiveToggle: FC<IntegrationActiveToggleProps> = ({
  initIsActive,
  type,
}) => {
  const { data } = useQuery({
    queryKey: ["integration-toggle", type],
    queryFn: () => getIntegrationIsActiveByType(type),
    initialData: initIsActive,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: toggleIntegrationIsActive,
    onSuccess: () => {
      toast.success("Integration has been updated!", {
        id: "integration-toggle" + type,
      });
    },
    onError: (error) => {
      toast.error(error.message ?? "Something went wrong", {
        id: "integration-toggle" + type,
      });
    },
  });

  const handleCheckChange = () => {
    toast.loading("Updating integration", { id: "integration-toggle" + type });
    mutate(type);
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch
        disabled={isPending}
        id={`integration-toggle-${type}`}
        defaultChecked={data}
        onCheckedChange={handleCheckChange}
      />
    </div>
  );
};

export default IntegrationActiveToggle;
