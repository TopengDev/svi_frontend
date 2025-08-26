// src/app/preview/[id]/page.tsx
import { fetchPublishedArticleById } from '@/app/articles/services/index.service';
import { splitLongWords } from '@/lib/utils';

export default async function PreviewDetailPage({
   params,
}: any) {
   const { data, error } = await fetchPublishedArticleById(params.id);

   if (error) {
      return (
         <main className="mx-auto max-w-3xl p-6">
            <p className="text-red-600">Article not found or unpublished.</p>
         </main>
      );
   }

   return (
      <main className="mx-auto max-w-3xl p-6">
         <div className="mb-2 text-xs uppercase text-muted-foreground">
            {data?.category}
         </div>
         <h1 className="mb-4 text-3xl font-bold">{data?.title}</h1>
         <article className="prose max-w-none">
            {splitLongWords(data?.content || '', 50)}
         </article>
      </main>
   );
}
