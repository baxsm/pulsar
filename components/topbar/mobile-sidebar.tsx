"use client";

import { FC, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import DashboardNavigationLinks from "./dashboard-navigation-links";

const MobileSidebar: FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <VisuallyHidden.Root>
          <SheetHeader>
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Sidebar Description</SheetDescription>
          </SheetHeader>
        </VisuallyHidden.Root>
        <DashboardNavigationLinks onClick={() => setIsOpen(false)} />
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
