"use client";

import { pollCategory } from "@/actions/event-category";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const EmptyCategoryState = ({ categoryName }: { categoryName: string }) => {
  const router = useRouter();

  const { data } = useQuery({
    queryKey: ["category", categoryName, "hasEvents"],
    queryFn: () => pollCategory(categoryName),
    refetchInterval(query) {
      return query.state.data?.hasEvents ? false : 1000;
    },
  });

  const hasEvents = data?.hasEvents;

  useEffect(() => {
    if (hasEvents) router.refresh();
  }, [hasEvents, router]);

  const codeSnippet = `await fetch('http://localhost:3000/api/v1/events', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    integration: 'discord_dm',
    category: '${categoryName}',
    fields: {
      field1: 'value1', // for example: user id
      field2: 'value2' // for example: user email
    }
  })
})`;

  return (
    <Card className="flex-1 flex flex-col items-center justify-center p-6 shadow-none border-none">
      <h2 className="text-xl font-medium text-center tracking-tight">
        Create your first <b>&quot;{categoryName}&quot;</b> event
      </h2>
      <p className="text-sm text-muted-foreground mb-8 max-w-md text-center text-pretty">
        Get started by sending a request to our tracking API:
      </p>

      <div className="w-full max-w-3xl rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-800 px-4 py-2 flex justify-between items-center">
          <div className="flex space-x-2">
            <div className="size-3 rounded-full bg-red-500" />
            <div className="size-3 rounded-full bg-yellow-500" />
            <div className="size-3 rounded-full bg-green-500" />
          </div>

          <span className="text-gray-400 text-sm">{categoryName}.js</span>
        </div>

        <SyntaxHighlighter
          language="javascript"
          style={atomDark}
          customStyle={{
            borderRadius: "0px",
            margin: 0,
            padding: "1rem",
            fontSize: "0.875rem",
            lineHeight: "1.5",
          }}
        >
          {codeSnippet}
        </SyntaxHighlighter>
      </div>

      <div className="mt-8 flex flex-col items-center space-x-2">
        <div className="flex gap-2 items-center">
          <div className="size-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-gray-600">
            Listening to incoming events...
          </span>
        </div>
      </div>
    </Card>
  );
};

export default EmptyCategoryState;
