"use client";

import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  createEventCategorySchema,
  CreateEventCategorySchemaType,
} from "@/validations/event-category";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { colorsList } from "@/constants/colors";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { emojisList } from "@/constants/emojis";
import { Button } from "../ui/button";
import { Loader2, Plus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createEventCategory } from "@/actions/event-category";
import { useRouter } from "next/navigation";

interface CreateEventCategoryProps {
  triggerText?: string;
}

const CreateEventCategory: FC<CreateEventCategoryProps> = ({ triggerText }) => {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<CreateEventCategorySchemaType>({
    resolver: zodResolver(createEventCategorySchema),
    defaultValues: {
      color: "",
      emoji: undefined,
      name: "",
    },
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createEventCategory,
    onSuccess: (name) => {
      toast.success("Event category created successfully!", {
        id: "create-event-category",
      });

      setIsOpen(false);
      form.reset();

      queryClient.invalidateQueries({
        queryKey: ["event-category-list"],
      });

      router.push(`/dashboard/event-category/${name}`);
    },
    onError: (error) => {
      toast.error(error.message ?? "Something went wrong", {
        id: "create-event-category",
      });
    },
  });

  const onSubmit = (values: CreateEventCategorySchemaType) => {
    toast.loading("Creating event category...", {
      id: "create-event-category",
    });
    mutate(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          {triggerText ? (
            triggerText
          ) : (
            <>
              Create event category <Plus className="size-4 ml-1.5" />
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Event Category</DialogTitle>
          <DialogDescription>
            Create a new category or organize your events.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="w-full space-y-2"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      autoFocus
                      placeholder="e.g. user-signup"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a color" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {colorsList.map((color) => (
                        <SelectItem key={color} value={color}>
                          <div className="flex items-center gap-4">
                            <div
                              style={{ backgroundColor: color }}
                              className="w-4 h-4 rounded-full"
                            />
                            <span style={{ color: color }}>{color}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="emoji"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Emoji</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an emoji" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {emojisList.map((item) => (
                        <SelectItem key={item.emoji} value={item.emoji}>
                          <div className="flex items-center gap-4">
                            <span>{item.emoji}</span>
                            <span>{item.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Only emoji is stored and not the label.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-4">
              <Button type="submit" disabled={isPending}>
                Create event category
                {isPending ? (
                  <Loader2 className="size-4 ml-1.5 animate-spin" />
                ) : (
                  <Plus className="size-4 ml-1.5" />
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEventCategory;
