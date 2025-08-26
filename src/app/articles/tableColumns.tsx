'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Pencil, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { truncate } from '@/lib/utils';
import { TArticle } from '../types';
import { toast } from 'sonner';
import { deleteArticle } from './services/index.service';
import { useRouter } from 'next/navigation';
import * as React from 'react';

export type OnDeleteSuccess = (id: number | string) => void;

export function ActionCell({
   row,
   onDeleted,
}: {
   row: any;
   onDeleted?: OnDeleteSuccess;
}) {
   const router = useRouter();
   const [busy, setBusy] = React.useState(false);

   const rawId = row.getValue('id'); // unknown
   const id = typeof rawId === 'number' ? rawId : String(rawId); // normalize to number|string

   return (
      <div className="flex items-center justify-center w-full h-full gap-2">
         {/* Edit */}
         <Button
            className="w-8 h-8"
            variant="ghost"
            onClick={() => router.push(`/articles/${id}`)}
            disabled={busy}
            aria-label="Edit"
         >
            <Pencil className="h-4 w-4" />
         </Button>

         {/* Delete */}
         <Button
            variant="destructive"
            className="w-8 h-8"
            disabled={busy}
            onClick={() => {
               toast('This action cannot be undone!', {
                  actionButtonStyle: { backgroundColor: 'red' },
                  style: { color: 'red' },
                  action: {
                     label: 'Delete Permanently',
                     onClick: async () => {
                        try {
                           setBusy(true);
                           const resp = await deleteArticle(id);
                           if (resp?.error) {
                              toast(resp.error, { style: { color: 'red' } });
                              return;
                           }
                           onDeleted?.(id); // ✅ inform parent to remove row
                           toast('Deleted successfully', {
                              style: { color: 'green' },
                           });
                        } catch (err) {
                           toast(String(err), { style: { color: 'red' } });
                        } finally {
                           setBusy(false);
                        }
                     },
                  },
               });
            }}
            aria-label="Delete"
         >
            <Trash className="h-4 w-4" />
         </Button>
      </div>
   );
}

export const getArticleColumns = (
   onDeleteSuccess?: OnDeleteSuccess,
): ColumnDef<TArticle>[] => {
   const generatedColumns: ColumnDef<TArticle>[] = [
      {
         accessorKey: 'id',
         header: () => (
            <div className="w-full h-full flex items-center justify-center">
               ID
            </div>
         ),
         cell: ({ row }) => (
            <span className="w-full h-full flex items-center justify-center">
               {String(row.getValue('id'))}
            </span>
         ),
         meta: { width: '80px' },
      },
      {
         accessorKey: 'title',
         header: ({ column }) => (
            <Button
               variant="ghost"
               onClick={() =>
                  column.toggleSorting(column.getIsSorted() === 'asc')
               }
            >
               Title
               <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
         ),
         cell: ({ row }) => (
            <div className="lowercase">{String(row.getValue('title'))}</div>
         ),
      },
      {
         accessorKey: 'category',
         header: () => (
            <div className="w-full h-full flex items-center justify-center">
               Category
            </div>
         ),
         cell: ({ row }) => (
            <div className="lowercase overflow-hidden text-ellipsis break-words">
               {truncate(String(row.getValue('category')), 100)}
            </div>
         ),
      },
      {
         accessorKey: 'content',
         header: () => (
            <div className="w-full h-full flex items-center justify-center">
               Content
            </div>
         ),
         cell: ({ row }) => (
            <div className="lowercase overflow-hidden text-ellipsis break-words">
               {truncate(String(row.getValue('content')), 100)}
            </div>
         ),
      },
      {
         accessorKey: 'status',
         header: () => (
            <div className="w-full h-full flex items-center justify-center">
               Status
            </div>
         ),
         cell: ({ row }) => (
            <div className="lowercase overflow-hidden text-ellipsis break-words text-center">
               {truncate(String(row.getValue('status')), 100)}
            </div>
         ),
      },
      {
         id: 'actions',
         header: () => (
            <div className="w-full h-full flex items-center justify-center">
               Actions
            </div>
         ),
         cell: ({ row }) => (
            <ActionCell row={row} onDeleted={onDeleteSuccess} />
         ),
         meta: { width: '140px' },
      },
   ];

   return generatedColumns;
};

export const getDeletedArticleColumns = (
   onDeleteSuccess?: OnDeleteSuccess,
): ColumnDef<TArticle>[] => {
   const generatedColumns: ColumnDef<TArticle>[] = [
      {
         accessorKey: 'id',
         header: () => (
            <div className="w-full h-full flex items-center justify-center">
               ID
            </div>
         ),
         cell: ({ row }) => (
            <span className="w-full h-full flex items-center justify-center">
               {String(row.getValue('id'))}
            </span>
         ),
         meta: { width: '80px' },
      },
      {
         accessorKey: 'title',
         header: ({ column }) => (
            <Button
               variant="ghost"
               onClick={() =>
                  column.toggleSorting(column.getIsSorted() === 'asc')
               }
            >
               Title
               <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
         ),
         cell: ({ row }) => (
            <div className="lowercase">{String(row.getValue('title'))}</div>
         ),
      },
      {
         accessorKey: 'category',
         header: () => (
            <div className="w-full h-full flex items-center justify-center">
               Category
            </div>
         ),
         cell: ({ row }) => (
            <div className="lowercase overflow-hidden text-ellipsis break-words">
               {truncate(String(row.getValue('category')), 100)}
            </div>
         ),
      },
      {
         accessorKey: 'content',
         header: () => (
            <div className="w-full h-full flex items-center justify-center">
               Content
            </div>
         ),
         cell: ({ row }) => (
            <div className="lowercase overflow-hidden text-ellipsis break-words">
               {truncate(String(row.getValue('content')), 100)}
            </div>
         ),
      },
      {
         accessorKey: 'status',
         header: () => (
            <div className="w-full h-full flex items-center justify-center">
               Status
            </div>
         ),
         cell: ({ row }) => (
            <div className="lowercase overflow-hidden text-ellipsis break-words text-center">
               {truncate(String(row.getValue('status')), 100)}
            </div>
         ),
      },
   ];

   return generatedColumns;
};
