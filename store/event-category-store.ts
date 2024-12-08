"use client";

import { getEventsByCategoryName } from "@/actions/event-category";
import { create } from "zustand";

interface EventCategoryStore {
  page: number;
  setPage: (page: number) => void;
  limit: number;
  setLimit: (limit: number) => void;
  activeTab: "today" | "week" | "month";
  setActiveTab: (tab: "today" | "week" | "month") => void;
  eventData: Awaited<ReturnType<typeof getEventsByCategoryName>>;
  setEventData: (
    data: Awaited<ReturnType<typeof getEventsByCategoryName>>
  ) => void;
  isDataLoading: boolean;
  setIsDataLoading: (isLoading: boolean) => void;
}

export const useEventCategoryStore = create<EventCategoryStore>((set) => ({
  page: 1,
  limit: 10,
  activeTab: "today",

  eventData: {
    events: [],
    totalEventsCount: 0,
    uniqueFieldsCount: 0,
  },

  isDataLoading: true,

  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setEventData: (data) => set({ eventData: data }),
  setIsDataLoading: (isLoading) => set({ isDataLoading: isLoading }),
}));
