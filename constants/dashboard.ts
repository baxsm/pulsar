export const dashboardLinks: {
  name: string;
  href: string;
}[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
  },
  {
    name: "API Keys",
    href: "/dashboard/api-keys",
  },
  {
    name: "Event Category",
    href: "/dashboard/event-category",
  },
  {
    name: "Integrations",
    href: "/dashboard/integrations",
  },
  {
    name: "Billing",
    href: "/dashboard/billing",
  },
];

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;
