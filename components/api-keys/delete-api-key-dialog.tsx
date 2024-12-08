"use client";

import { FC, useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Loader2, Trash } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteApiKey } from "@/actions/api-key";

interface DeleteApiKeyDialogProps {
  identifier: string;
  title: string;
}

const DeleteApiKeyDialog: FC<DeleteApiKeyDialogProps> = ({
  identifier,
  title,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteApiKey,
    onSuccess: () => {
      toast.success("Successfully deleted API key!", {
        id: "delete-api-key",
      });

      setIsOpen(false);

      queryClient.invalidateQueries({
        queryKey: ["api-key-list"],
      });
    },
    onError: (error) => {
      toast.error(error.message ?? "Something went wrong", {
        id: "delete-api-key",
      });
    },
  });

  const handleDelete = () => {
    toast.loading("Deleting API key...", { id: "delete-api-key" });
    mutate(identifier);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          className="text-muted-foreground hover:text-destructive"
          size="icon"
        >
          <Trash className="size-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            You are about to delete <b>{title}</b>. This will permanently delete
            your key. You will not be able to access this key later.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            disabled={isPending}
            onClick={handleDelete}
            type="button"
            variant="destructive"
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin mr-1.5" />
            ) : (
              <Trash className="size-4 mr-1.5" />
            )}
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteApiKeyDialog;
