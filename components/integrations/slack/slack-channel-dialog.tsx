"use client";

import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Cog, Loader2, Lock, Save } from "lucide-react";
import { updateSlackChannelId } from "@/actions/integration";
import {
  slackChannelFormSchema,
  SlackChannelFormSchemaType,
} from "@/validations/integration";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SlackChannelDialogProps {
  channelId: string | null | undefined;
  slackChannelList: {
    id: string;
    name: string;
    is_private: boolean;
  }[];
}

const SlackChannelDialog: FC<SlackChannelDialogProps> = ({
  channelId,
  slackChannelList,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<SlackChannelFormSchemaType>({
    resolver: zodResolver(slackChannelFormSchema),
    defaultValues: {
      channelId: channelId ?? "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updateSlackChannelId,
    onSuccess: () => {
      toast.success("Updated slack Channel ID", {
        id: "slack-channel-form",
      });

      setIsOpen(false);
    },
    onError: (error) => {
      toast.error(error.message ?? "Something went wrong", {
        id: "slack-channel-form",
      });
    },
  });

  const onSubmit = async (values: SlackChannelFormSchemaType) => {
    toast.loading("Updating slack Channel ID...", {
      id: "slack-channel-form",
    });
    mutate(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Cog className="size-4 mr-1.5" />
          Manage
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Slack</DialogTitle>
          <DialogDescription>Manage your slack Channel ID.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="channelId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>1. Channel ID</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the channel" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {slackChannelList.map((e) => (
                        <SelectItem key={e.id} value={e.id}>
                          <div className="flex items-center">
                            {e.name}
                            {e.is_private && <Lock className="size-4 ml-1.5 text-muted-foreground" />}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem className="flex flex-col gap-2 pt-2">
              <FormLabel>2. Invite to Channel (Optional)</FormLabel>
              <p className="text-sm text-muted-foreground">
                Invite Pulsar to your private channels. Access will be required
                before we are able to fetch that channel id here. Refresh after
                inviting.
              </p>
            </FormItem>

            <div className="pt-4">
              <Button disabled={isPending} type="submit">
                Update
                {isPending ? (
                  <Loader2 className="size-4 animate-spin ml-1.5" />
                ) : (
                  <Save className="size-4 ml-1.5" />
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SlackChannelDialog;
