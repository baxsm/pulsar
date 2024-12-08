"use client";

import {
  createApiKeySchema,
  CreateApiKeySchemaType,
} from "@/validations/api-key";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createApiKey } from "@/actions/api-key";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCheck, Copy, Loader2, Plus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

interface CreateApiKeyDialogProps {
  triggerText?: string;
}

const CreateApiKeyDialog: FC<CreateApiKeyDialogProps> = ({ triggerText }) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCopyOpen, setIsCopyOpen] = useState(false);
  const [apiKeyValue, setApiKeyValue] = useState("");

  const form = useForm<CreateApiKeySchemaType>({
    resolver: zodResolver(createApiKeySchema),
    defaultValues: {
      title: "",
    },
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createApiKey,
    onSuccess: (apiKey) => {
      toast.success("Successfully created API key. Remember to copy it!", {
        id: "create-api-key",
      });

      if (apiKey) {
        setIsCreateOpen(false);
        setApiKeyValue(apiKey);
        setIsCopyOpen(true);
        form.reset();
      }
    },
    onError: (error) => {
      toast.error(error.message ?? "Something went wrong", {
        id: "create-api-key",
      });
    },
  });

  const onSubmit = async (values: CreateApiKeySchemaType) => {
    toast.loading("Creating API key...", { id: "create-api-key" });
    mutate(values);
  };

  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 1200 });

  const onCopy = () => {
    if (isCopied) return;
    copyToClipboard(apiKeyValue);
    toast.success("Link copied to clipboard!");
  };

  return (
    <>
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogTrigger asChild>
          <Button>
            {triggerText ? (
              triggerText
            ) : (
              <>
                Create API Key <Plus className="size-4 ml-1.5" />
              </>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new API key</DialogTitle>
            <DialogDescription>
              Create new API key by providing the title for your ease.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the title for your API key"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-4">
                <Button disabled={isPending} type="submit">
                  Create API Key
                  {isPending ? (
                    <Loader2 className="size-4 animate-spin ml-1.5" />
                  ) : (
                    <Plus className="size-4 ml-1.5" />
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isCopyOpen}
        onOpenChange={(open) => {
          setIsCopyOpen(open);
          if (open === false) {
            setApiKeyValue("");

            queryClient.invalidateQueries({
              queryKey: ["api-key-list"],
            });
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>API Key Created</AlertDialogTitle>
            <AlertDialogDescription>
              Copy the key below. You will not be able to copy it later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex items-center gap-2">
            <Input
              onClick={onCopy}
              value={apiKeyValue}
              readOnly
              className="cursor-pointer"
            />
            <Button onClick={onCopy} variant="outline">
              {isCopied ? (
                <CheckCheck className="size-4 text-green-500" />
              ) : (
                <Copy className="size-4 text-muted-foreground" />
              )}
            </Button>
          </div>
          <AlertDialogFooter>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CreateApiKeyDialog;
