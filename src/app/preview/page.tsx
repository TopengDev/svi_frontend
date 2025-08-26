// src/app/preview/page.tsx
import Link from 'next/link';
import { fetchPublishedArticles } from '@/app/articles/services/index.service';
import { TArticle } from '@/app/types';
import { truncate } from '@/lib/utils';
const PAGE_SIZE = 10;

export default async function PreviewPage({
   searchParams,
}: any) {
   const page = Math.max(1, Number(searchParams?.page ?? 1));
   const offset = (page - 1) * PAGE_SIZE;

   const { data = [], error } = await fetchPublishedArticles({
      limit: PAGE_SIZE,
      offset,
   });

   if (error) {
      return (
         <main className="mx-auto max-w-3xl p-6">
            <p className="text-red-600">Failed to load: {error}</p>
         </main>
      );
   }

   const hasPrev = page > 1;
   const hasNext = (data?.length ?? 0) === PAGE_SIZE; // naive but effective

   return (
      <main className="mx-auto max-w-3xl p-6">
         <h1 className="mb-6 text-2xl font-semibold">Latest Posts</h1>

         {data.length === 0 ? (
            <p className="text-muted-foreground">No published posts yet.</p>
         ) : (
            <ul className="space-y-4">
               {data.map((a: TArticle) => (
                  <li key={a.id} className="rounded-lg border p-4">
                     <div className="mb-1 text-xs uppercase text-muted-foreground">
                        {a.category}
                     </div>
                     <h2 className="text-lg font-medium">
                        <Link
                           href={`/preview/${a.id}`}
                           className="hover:underline"
                           prefetch
                        >
                           {a.title}
                        </Link>
                     </h2>
                     <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                        {truncate(a.content, 50)}
                     </p>
                     <div className="mt-3">
                        <Link
                           href={`/preview/${a.id}`}
                           className="text-sm text-primary hover:underline"
                        >
                           Read more →
                        </Link>
                     </div>
                  </li>
               ))}
            </ul>
         )}

         {/* Pagination */}
         <div className="mt-8 flex items-center justify-between">
            <Link
               aria-disabled={!hasPrev}
               className={`rounded-md border px-3 py-1.5 text-sm ${
                  hasPrev ? 'hover:bg-muted' : 'pointer-events-none opacity-50'
               }`}
               href={hasPrev ? `/preview?page=${page - 1}` : '#'}
               prefetch
            >
               ← Previous
            </Link>

            <span className="text-sm text-muted-foreground">Page {page}</span>

            <Link
               aria-disabled={!hasNext}
               className={`rounded-md border px-3 py-1.5 text-sm ${
                  hasNext ? 'hover:bg-muted' : 'pointer-events-none opacity-50'
               }`}
               href={hasNext ? `/preview?page=${page + 1}` : '#'}
               prefetch
            >
               Next →
            </Link>
         </div>
      </main>
   );
}
