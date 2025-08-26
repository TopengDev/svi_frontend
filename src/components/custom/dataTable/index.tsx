'use client';

import * as React from 'react';
import {
   ColumnDef,
   flexRender,
   getCoreRowModel,
   getFilteredRowModel,
   getPaginationRowModel,
   getSortedRowModel,
   SortingState,
   VisibilityState,
   RowSelectionState,
   PaginationState,
   Updater,
   useReactTable,
} from '@tanstack/react-table';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
   DropdownMenu,
   DropdownMenuCheckboxItem,
   DropdownMenuContent,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export type DataTableProps<TData, TValue> = {
   columns: ColumnDef<TData, TValue>[];
   data: TData[];

   searchableColumnId?: string;
   searchPlaceholder?: string;

   initialSorting?: SortingState;
   initialColumnVisibility?: VisibilityState;

   rowSelection?: RowSelectionState;
   onRowSelectionChange?: (updater: Updater<RowSelectionState>) => void;

   pageSize?: number;
   manualPagination?: boolean;
   pageCount?: number;
   onPaginationChange?: (updater: Updater<PaginationState>) => void;
   pageIndex?: number;

   enableColumnVisibilityToggle?: boolean;

   /** clamp long text in cells (lines). set 0 to disable */
   lineClamp?: number;

   /** optional: fixed column widths e.g. ["96px","1fr","160px"].
    * if omitted, uses repeat(minmax(0,1fr)) for visible columns */
   columnTemplate?: string[];

   className?: string;
};

export function DataTable<TData, TValue>({
   columns,
   data,

   searchableColumnId,
   searchPlaceholder = 'Search...',

   initialSorting = [],
   initialColumnVisibility = {},

   rowSelection,
   onRowSelectionChange,

   pageSize = 10,
   manualPagination = false,
   pageCount,
   onPaginationChange,
   pageIndex,

   enableColumnVisibilityToggle = true,

   lineClamp = 0,
   columnTemplate,
   className,
}: DataTableProps<TData, TValue>) {
   const [sorting, setSorting] = React.useState<SortingState>(initialSorting);
   const [columnVisibility, setColumnVisibility] =
      React.useState<VisibilityState>(initialColumnVisibility);
   const [internalRowSelection, setInternalRowSelection] =
      React.useState<RowSelectionState>({});
   const [internalPageIndex, setInternalPageIndex] = React.useState(0);

   const table = useReactTable({
      data,
      columns,
      state: {
         sorting,
         columnVisibility,
         rowSelection: rowSelection ?? internalRowSelection,
         pagination: {
            pageIndex: manualPagination ? (pageIndex ?? 0) : internalPageIndex,
            pageSize,
         },
      },
      onSortingChange: setSorting,
      onColumnVisibilityChange: setColumnVisibility,
      onRowSelectionChange: onRowSelectionChange ?? setInternalRowSelection,

      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getPaginationRowModel: getPaginationRowModel(),

      manualPagination,
      pageCount,
      onPaginationChange:
         onPaginationChange ??
         ((updater) => {
            const next =
               typeof updater === 'function'
                  ? updater({ pageIndex: internalPageIndex, pageSize })
                  : updater;
            setInternalPageIndex(next.pageIndex);
         }),
   });

   // search binding
   const searchValue =
      (searchableColumnId &&
         (table.getColumn(searchableColumnId)?.getFilterValue() as string)) ||
      '';


   // get visible columns
const visibleCols = table.getVisibleLeafColumns()

// build grid template from meta.width (fallback to flexible column)
const template = visibleCols
  .map((col) => {
    const w = (col.columnDef as any)?.meta?.width
    return w ? w : "minmax(0, 1fr)"
  })
  .join(" ")


   const clampClass =
      lineClamp && lineClamp > 0 ? (`line-clamp-${lineClamp}` as string) : '';

   return (
      <div className={cn('w-full max-w-full', className)}>
         {/* toolbar */}
         <div className="flex items-center gap-2 py-4">
            {searchableColumnId && (
               <Input
                  placeholder={searchPlaceholder}
                  value={searchValue}
                  onChange={(e) =>
                     table
                        .getColumn(searchableColumnId)
                        ?.setFilterValue(e.target.value)
                  }
                  className="max-w-sm"
               />
            )}

            {enableColumnVisibilityToggle && (
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button variant="outline" className="ml-auto">
                        Columns <ChevronDown className="ml-2 h-4 w-4" />
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                     {table
                        .getAllLeafColumns()
                        .filter((col) => col.getCanHide())
                        .map((col) => (
                           <DropdownMenuCheckboxItem
                              key={col.id}
                              className="capitalize"
                              checked={col.getIsVisible()}
                              onCheckedChange={(v) => col.toggleVisibility(!!v)}
                           >
                              {col.id}
                           </DropdownMenuCheckboxItem>
                        ))}
                  </DropdownMenuContent>
               </DropdownMenu>
            )}
         </div>

         {/* grid wrapper — respects container width, scrolls only if needed */}
         <div className="w-full max-w-full overflow-x-auto rounded-md border">
            {/* header */}
            <div role="rowgroup" className="min-w-full">
               <div
                  role="row"
                  className="grid bg-muted/40 text-sm font-medium"
                  style={{ gridTemplateColumns: template }}
               >
                  {table.getHeaderGroups().map((hg) =>
                     hg.headers.map((header) => (
                        <div
                           role="columnheader"
                           key={header.id}
                           className="px-3 py-2 border-b whitespace-normal break-words"
                        >
                           {header.isPlaceholder
                              ? null
                              : flexRender(
                                   header.column.columnDef.header,
                                   header.getContext(),
                                )}
                        </div>
                     )),
                  )}
               </div>
            </div>

            {/* body */}
            <div role="rowgroup" className="min-w-full">
               {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                     <div
                        role="row"
                        key={row.id}
                        data-state={row.getIsSelected() && 'selected'}
                        className="grid even:bg-muted/10"
                        style={{ gridTemplateColumns: template }}
                     >
                        {row.getVisibleCells().map((cell) => (
                           <div
                              role="cell"
                              key={cell.id}
                              className={cn(
                                 'px-3 py-2 border-b whitespace-normal break-words align-top max-w-full',
                              )}
                           >
                              <div
                                 className={cn(
                                    'min-w-0 break-words',
                                    clampClass,
                                 )}
                              >
                                 {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext(),
                                 )}
                              </div>
                           </div>
                        ))}
                     </div>
                  ))
               ) : (
                  <div
                     role="row"
                     className="grid"
                     style={{ gridTemplateColumns: template }}
                  >
                     <div
                        role="cell"
                        className="col-span-full h-24 flex items-center justify-center text-sm text-muted-foreground"
                     >
                        No results.
                     </div>
                  </div>
               )}
            </div>
         </div>

         {/* footer */}
         <div className="flex items-center justify-end gap-2 py-4">
            <div className="text-muted-foreground mr-auto text-sm">
               {table.getFilteredSelectedRowModel().rows.length} of{' '}
               {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>

            <Button
               variant="outline"
               size="sm"
               onClick={() => table.previousPage()}
               disabled={!table.getCanPreviousPage()}
            >
               Previous
            </Button>
            <Button
               variant="outline"
               size="sm"
               onClick={() => table.nextPage()}
               disabled={!table.getCanNextPage()}
            >
               Next
            </Button>
         </div>
      </div>
   );
}
