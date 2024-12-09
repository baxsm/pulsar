import { addSlackCode } from "@/actions/integration";
import { Loader2 } from "lucide-react";
import { notFound } from "next/navigation";
import { FC } from "react";

interface SlackIntegrationProps {
  searchParams: Promise<{
    [key: string]: string | string[] | null;
  }>;
}

const SlackIntegration: FC<SlackIntegrationProps> = async ({
  searchParams,
}) => {
  const { code } = await searchParams;

  if (!code || typeof code !== "string") {
    notFound();
  }

  await addSlackCode(code);
  
  return (
    <div className="w-full h-full py-8 flex items-center justify-center">
      <Loader2 className="size-4 animate-spin text-primary" />
    </div>
  );
};

export default SlackIntegration;
