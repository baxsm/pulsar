"use client";

import { getEventsByCategoryName } from "@/actions/event-category";
import { useEventCategoryStore } from "@/store/event-category-store";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { FC, useEffect, useMemo, useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Event } from "@prisma/client";
import { cn } from "@/lib/utils";

interface EventCategoryTableProps {
  categoryName: string;
  hasEvents: boolean;
}

const EventCategoryTable: FC<EventCategoryTableProps> = ({
  categoryName,
  hasEvents,
}) => {
  const searchParams = useSearchParams();
  const {
    page,
    setPage,
    limit,
    setLimit,
    activeTab,
    setEventData,
    setIsDataLoading,
  } = useEventCategoryStore();

  useEffect(() => {
    setPage(parseInt(searchParams.get("page") || "1", 10));
    setLimit(parseInt(searchParams.get("limit") || "10", 10));
  }, [searchParams, setPage, setLimit]);

  const [pagination, setPagination] = useState({
    pageIndex: page - 1,
    pageSize: limit,
  });

  const { data: pollingData } = useQuery({
    queryKey: ["category", categoryName, "hasEvents"],
    initialData: { hasEvents: hasEvents },
  });

  const { data, isLoading } = useQuery({
    queryKey: [
      "events",
      categoryName,
      pagination.pageIndex,
      pagination.pageSize,
      activeTab,
    ],
    queryFn: () =>
      getEventsByCategoryName({
        name: categoryName,
        limit: pagination.pageSize,
        page: pagination.pageIndex + 1,
        timeRange: activeTab,
      }),
    enabled: pollingData.hasEvents,
  });

  useEffect(() => {
    setEventData(
      data || {
        events: [],
        totalEventsCount: 0,
        uniqueFieldsCount: 0,
      }
    );
    setIsDataLoading(isLoading);
  }, [data, isLoading, setEventData, setIsDataLoading]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columns: ColumnDef<Event>[] = useMemo(
    () =>
      [
        {
          accessorKey: "category",
          header: "Category",
          cell: () => <span>{categoryName || "Un-categorized"}</span>,
        },
        {
          accessorKey: "createdAt",
          header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
              >
                Date
                <ArrowUpDown className="size-4 ml-2" />
              </Button>
            );
          },
          cell: ({ row }) => {
            return new Date(row.getValue("createdAt")).toLocaleString();
          },
        },
        ...(data?.events[0]
          ? Object.keys(data.events[0].fields as object).map((field) => ({
              accessorFn: (row: Event) =>
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (row.fields as Record<string, any>)[field],
              header: field,
              cell: ({ row }: { row: Row<Event> }) =>
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (row.original.fields as Record<string, any>)[field] || "-",
            }))
          : []),
        {
          accessorKey: "status",
          header: "Delivery Status",
          cell: ({ row }) => (
            <span
              className={cn("px-2 py-1 rounded-full text-xs font-semibold", {
                "bg-green-100 text-green-800":
                  row.getValue("status") === "DELIVERED",
                "bg-red-100 text-red-800": row.getValue("status") === "FAILED",
                "bg-yellow-100 text-yellow-800":
                  row.getValue("status") === "PENDING",
              })}
            >
              {row.getValue("status")}
            </span>
          ),
        },
      ] satisfies ColumnDef<Event>[],
    [categoryName, data?.events]
  );

  const table = useReactTable({
    data: data?.events || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: Math.ceil((data?.totalEventsCount || 0) / pagination.pageSize),
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
  });

  const router = useRouter();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("page", (pagination.pageIndex + 1).toString());
    searchParams.set("limit", pagination.pageSize.toString());
    router.push(`?${searchParams.toString()}`, { scroll: false });
  }, [pagination, router]);

  return (
    <div className="flex flex-col gap-8">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {isLoading ? (
            [...Array(5)].map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((_, cellIndex) => (
                  <TableCell key={cellIndex}>
                    <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage() || isLoading}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage() || isLoading}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default EventCategoryTable;
