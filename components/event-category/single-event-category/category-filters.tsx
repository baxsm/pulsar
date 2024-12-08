"use client";

import { FC } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEventCategoryStore } from "@/store/event-category-store";

const CategoryFilters: FC = () => {
  const { activeTab, setActiveTab } = useEventCategoryStore();

  return (
    <Select defaultValue={activeTab} onValueChange={setActiveTab}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select timeframe" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="today">Today</SelectItem>
        <SelectItem value="week">This week</SelectItem>
        <SelectItem value="month">This month</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default CategoryFilters;
