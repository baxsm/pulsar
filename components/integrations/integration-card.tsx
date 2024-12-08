import { FC, JSX, SVGProps } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "../ui/badge";
import { IntegrationType } from "@prisma/client";

interface IntegrationCardProps {
  icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  type: IntegrationType;
  title: string;
  description: string;
  helper?: JSX.Element;
  footer: JSX.Element;
}

const IntegrationCard: FC<IntegrationCardProps> = (props) => {
  return (
    <Card className="relative">
      <Badge variant="outline" className="absolute top-4 right-4 lowercase">{props.type}</Badge>
      <CardHeader>
        <div className="p-4 flex items-center justify-center rounded-full bg-accent w-fit h-fit">
          {<props.icon className="size-5" />}
        </div>
        <CardTitle>{props.title}</CardTitle>
        <CardDescription>{props.description}</CardDescription>
        {props.helper}
      </CardHeader>
      <CardContent className="py-4 bg-accent/40 rounded-bl-lg rounded-br-lg flex items-center justify-between">
        {props.footer}
      </CardContent>
    </Card>
  );
};

export default IntegrationCard;
