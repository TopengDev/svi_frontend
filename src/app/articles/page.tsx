'use client';

import { CustomTabs } from '@/components/custom/layout/tabs';
import { Check, Pencil, Trash } from 'lucide-react';
import { DataTable } from '../../components/custom/dataTable/';
import { TArticle } from '../types';
import { useEffect, useMemo, useState } from 'react';
import {
   fetchAllArticles,
   fetchAllDeletedArticles,
} from './services/index.service';
import { toast } from 'sonner';
import { getArticleColumns, getDeletedArticleColumns } from './tableColumns';

export default function Page() {
   const [pagination, setPagination] = useState<{
      limit: number;
      offset: number;
   }>({
      limit: 10,
      offset: 0,
   });

   const pageIndex = Math.floor(pagination.offset / pagination.limit);

   const [articles, setArticles] = useState<TArticle[]>([]);
   const [deletedArticles, setDeletedArticles] = useState<TArticle[]>([]);

   async function fetchArticles() {
      const response = await fetchAllArticles(pagination);
      if (response?.error) {
         toast(String(response?.error));
         return;
      }
      setArticles(response?.data || []);
   }

   async function fetchDeletedArticles() {
      const response = await fetchAllDeletedArticles(pagination);
      if (response?.error) {
         toast(String(response?.error));
         return;
      }
      setDeletedArticles(response?.data || []);
   }

   useEffect(() => {
      fetchArticles();
      fetchDeletedArticles();
   }, [pagination]);

   // naive "hasNext": server returned a full page
   const hasNextArticles = articles.length === pagination.limit;
   const hasNextDeleted = deletedArticles.length === pagination.limit;

   const tabItems = useMemo(() => {
      return [
         {
            title: 'Published',
            value: 'Publish',
            icon: Check,
            content: (
               <DataTable<TArticle, unknown>
                  columns={getArticleColumns((_id) => {
                     // after delete, refresh both lists (it moves to deleted)
                     fetchArticles();
                     fetchDeletedArticles();
                  })}
                  data={articles.filter((a) => a.status === 'Publish')}
                  searchableColumnId="title"
                  searchPlaceholder="Filter title..."
                  initialSorting={[]}
                  pageSize={pagination.limit}
                  enableColumnVisibilityToggle
                  manualPagination
                  pageIndex={pageIndex}
                  pageCount={hasNextArticles ? pageIndex + 2 : pageIndex + 1}
                  onPaginationChange={(updater) => {
                     // resolve Updater<PaginationState> → PaginationState
                     const next =
                        typeof updater === 'function'
                           ? updater({ pageIndex, pageSize: pagination.limit })
                           : updater;

                     setPagination({
                        limit: next.pageSize,
                        offset: next.pageIndex * next.pageSize,
                     });
                  }}
               />
            ),
         },
         {
            title: 'Drafts',
            value: 'Draft',
            icon: Pencil,
            content: (
               <DataTable<TArticle, unknown>
                  columns={getArticleColumns((_id) => {
                     fetchArticles();
                     fetchDeletedArticles();
                  })}
                  data={articles.filter((a) => a.status === 'Draft')}
                  searchableColumnId="title"
                  searchPlaceholder="Filter title..."
                  initialSorting={[]}
                  pageSize={pagination.limit}
                  enableColumnVisibilityToggle
                  manualPagination
                  pageIndex={pageIndex}
                  pageCount={hasNextArticles ? pageIndex + 2 : pageIndex + 1}
                  onPaginationChange={(updater) => {
                     // resolve Updater<PaginationState> → PaginationState
                     const next =
                        typeof updater === 'function'
                           ? updater({ pageIndex, pageSize: pagination.limit })
                           : updater;

                     setPagination({
                        limit: next.pageSize,
                        offset: next.pageIndex * next.pageSize,
                     });
                  }}
               />
            ),
         },
         {
            title: 'Trashed',
            value: 'Trash',
            icon: Trash,
            content: (
               <DataTable<TArticle, unknown>
                  columns={getDeletedArticleColumns((_id) => {
                     fetchArticles();
                     fetchDeletedArticles();
                  })}
                  data={deletedArticles}
                  searchableColumnId="title"
                  searchPlaceholder="Filter title..."
                  initialSorting={[]}
                  pageSize={pagination.limit}
                  enableColumnVisibilityToggle
                  manualPagination
                  pageIndex={pageIndex}
                  pageCount={hasNextDeleted ? pageIndex + 2 : pageIndex + 1}
                  onPaginationChange={(updater) => {
                     // resolve Updater<PaginationState> → PaginationState
                     const next =
                        typeof updater === 'function'
                           ? updater({ pageIndex, pageSize: pagination.limit })
                           : updater;

                     setPagination({
                        limit: next.pageSize,
                        offset: next.pageIndex * next.pageSize,
                     });
                  }}
               />
            ),
         },
      ];
      // include pagination in deps so page switches re-render
   }, [articles, deletedArticles, pagination]);

   return (
      <main className="w-full flex justify-center p-8">
         <CustomTabs tabItems={tabItems} defaultValue="Publish" />
      </main>
   );
}
