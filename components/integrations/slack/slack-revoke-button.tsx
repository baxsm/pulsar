"use client";

import { removeSlackIntegration } from "@/actions/integration";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { Ban, Loader2 } from "lucide-react";
import { FC } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const SlackRevokeButton: FC = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: removeSlackIntegration,
    onSuccess: () => {
      toast.success("Slack access has been revoked!", { id: "revoke-slack" });
    },
    onError: (error) => {
      toast.error(error.message ?? "Something went wrong", {
        id: "revoke-slack",
      });
    },
  });

  const handleClick = () => {
    toast.loading("Revoking slack access", { id: "revoke-slack" });
    mutate();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" className="hover:text-destructive">
          {isPending ? (
            <Loader2 className="size-4 animate-spin mr-1.5" />
          ) : (
            <Ban className="size-4 mr-1.5" />
          )}
          Revoke
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            You are about to revoke the Slack access. This will remove your
            token.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            onClick={handleClick}
            disabled={isPending}
            variant="destructive"
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin ml-1.5" />
            ) : (
              <Ban className="size-4 ml-1.5" />
            )}
            Revoke
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SlackRevokeButton;
