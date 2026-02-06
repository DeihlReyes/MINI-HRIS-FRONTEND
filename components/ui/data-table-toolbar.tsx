"use client";

import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { DataTableViewOptions } from "./data-table-view-options";

interface DataTableToolbarProps<TData> {
  table?: Table<TData>;
  searchKey?: string;
  searchPlaceholder?: string;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
}

export function DataTableToolbar<TData>({
  table,
  searchKey,
  searchPlaceholder = "Search...",
  filters,
  actions,
}: DataTableToolbarProps<TData>) {
  const isFiltered = (table?.getState().columnFilters.length ?? 0) > 0;

  return (
    <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
        {searchKey && table && (
          <Input
            placeholder={searchPlaceholder}
            value={
              (table.getColumn(searchKey)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn(searchKey)?.setFilterValue(event.target.value)
            }
            className="h-8 w-full text-sm sm:w-37.5 lg:w-62.5"
          />
        )}
        {filters && <div className="flex gap-2">{filters}</div>}
        {isFiltered && table && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        {table && <DataTableViewOptions table={table} />}
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
    </div>
  );
}
