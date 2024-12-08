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
import { Button } from "@/components/ui/button";
import { Cog, Loader2, Save } from "lucide-react";
import {
  discordDmFormSchema,
  DiscordDmFormSchemaType,
} from "@/validations/integration";
import { updateDiscordUserId } from "@/actions/integration";
import Link from "next/link";

interface DiscordDmManageFormProps {
  token: string | null | undefined;
}

const DiscordDmManageForm: FC<DiscordDmManageFormProps> = ({ token }) => {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<DiscordDmFormSchemaType>({
    resolver: zodResolver(discordDmFormSchema),
    defaultValues: {
      userId: token ?? "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updateDiscordUserId,
    onSuccess: () => {
      toast.success("Updated discord User ID", {
        id: "discord-dm-form",
      });

      setIsOpen(false);
    },
    onError: (error) => {
      toast.error(error.message ?? "Something went wrong", {
        id: "discord-dm-form",
      });
    },
  });

  const onSubmit = async (values: DiscordDmFormSchemaType) => {
    toast.loading("Updating discord User ID...", { id: "discord-dm-form" });
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
          <DialogDescription>Manage your discord User ID.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your User ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
            Don&apos;t know how to get User ID? Follow this{" "}
            <Link
              href="https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID#h_01HRSTXPS5H5D7JBY2QKKPVKNA"
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

export default DiscordDmManageForm;
