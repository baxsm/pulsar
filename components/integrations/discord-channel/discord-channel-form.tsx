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
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Cog, Loader2, Save } from "lucide-react";
import { updateDiscordChannelId } from "@/actions/integration";
import Link from "next/link";
import {
  discordChannelFormSchema,
  DiscordChannelFormSchemaType,
} from "@/validations/integration";

interface DiscordChannelFormProps {
  token: string | null | undefined;
}

const DiscordChannelForm: FC<DiscordChannelFormProps> = ({ token }) => {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<DiscordChannelFormSchemaType>({
    resolver: zodResolver(discordChannelFormSchema),
    defaultValues: {
      channelId: token ?? "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updateDiscordChannelId,
    onSuccess: () => {
      toast.success("Updated discord Channel ID", {
        id: "discord-channel-form",
      });

      setIsOpen(false);
    },
    onError: (error) => {
      toast.error(error.message ?? "Something went wrong", {
        id: "discord-channel-form",
      });
    },
  });

  const onSubmit = async (values: DiscordChannelFormSchemaType) => {
    toast.loading("Updating discord Channel ID...", {
      id: "discord-channel-form",
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
          <DialogTitle>Manage Discord</DialogTitle>
          <DialogDescription>Manage your discord Channel ID.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormItem className="flex flex-col gap-2">
              <FormLabel>1. Invite to Discord</FormLabel>
              <Link
                className={buttonVariants({ className: "w-fit" })}
                href={process.env.NEXT_PUBLIC_DISCORD_BOT_INSTALL_LINK!}
                target="_blank"
                referrerPolicy="no-referrer"
              >
                Invite Bot
              </Link>
            </FormItem>

            <FormField
              control={form.control}
              name="channelId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>2. Channel ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your Channel ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem className="flex flex-col gap-2 pt-2">
              <FormLabel>3. Invite to Channel (Optional)</FormLabel>
              <p className="text-sm text-muted-foreground">
                Invite Pulsar to your private channel. Access will be required
                before we are able to send a message.
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
        <DialogFooter>
          <p className="text-sm text-muted-foreground">
            Don&apos;t know how to get Channel ID? Follow this{" "}
            <Link
              href="https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID#h_01HRSTXPS5FMK2A5SMVSX4JW4E"
              target="_blank"
              referrerPolicy="no-referrer"
              className="text-blue-500 underline underline-offset-2"
            >
              Guide
            </Link>
            .
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DiscordChannelForm;
