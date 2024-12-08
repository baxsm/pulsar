"use client";

import { syncUser } from "@/actions/auth";
import BackgroundPattern from "@/components/background-pattern";
import Logo from "@/components/logo";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useEffect } from "react";

const Welcome: FC = () => {
  const router = useRouter();

  const { data } = useQuery({
    queryKey: ["welcome"],
    queryFn: syncUser,
    refetchInterval: (query) => {
      return query.state.data?.isSynced ? false : 1000;
    },
  });

  useEffect(() => {
    if (data?.isSynced) {
      router.push("/dashboard");
    }
  }, [data, router]);

  return (
    <div className="flex w-full flex-1 items-center justify-center px-4">
      <BackgroundPattern className="absolute inset-0 left-1/2 z-0 -translate-x-1/2 opacity-75" />

      <div className="relative z-10 flex -translate-y-1/2 flex-col items-center gap-6 text-center">
        <Logo />
        <Separator className="max-w-xs" />
        <div className="flex items-center gap-2 justify-center">
          <Loader2 className="animate-spin size-4 shrink-0 stroke-primary" />
          <p className="text-muted-foreground">Setting up your account</p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
