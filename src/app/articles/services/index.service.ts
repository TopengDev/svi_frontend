'use server';

import { TArticle } from '@/app/types';

type ListParams = { limit?: number; offset?: number };

type CreateDTO = {
   title: string;
   content: string;
   category: string;
   status: 'Publish' | 'Draft' | 'Trash';
};

type UpdateDTO = Partial<CreateDTO>;

type Result<T> = { data?: T; error?: string };

const PUBLIC_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '/api'; // browser

const INTERNAL_BASE =
   process.env.INTERNAL_API_BASE_URL || 'http://backend:8080'; // server (container)

// const BASE = typeof window === "undefined" ? INTERNAL_BASE : PUBLIC_BASE;
const BASE = INTERNAL_BASE;

function buildUrl(path: string) {
   if (!path.startsWith('/')) path = `/${path}`;
   if (!BASE) throw new Error('API base URL is not set');
   return `${BASE}${path}`;
}
const JSON_HEADERS = { 'Content-Type': 'application/json' as const };
const DEFAULT_TIMEOUT_MS = 10_000;

// tiny fetch wrapper with timeout + better errors
async function request<T = unknown>(
   url: string,
   init?: RequestInit & { timeoutMs?: number },
): Promise<Result<T>> {
   const controller = new AbortController();
   const to = setTimeout(
      () => controller.abort(),
      init?.timeoutMs ?? DEFAULT_TIMEOUT_MS,
   );

   console.log({requestUrl: url})

   try {
      const resp = await fetch(url, {
         cache: 'no-store',
         credentials: 'omit',
         ...init,
         signal: controller.signal,
      });

      // Try parse body (array, object, or empty)
      const ct = resp.headers.get('content-type') || '';
      const bodyText = await resp.text(); // read once
      const body = bodyText
         ? ct.includes('application/json')
            ? (JSON.parse(bodyText) as unknown)
            : (bodyText as unknown)
         : undefined;

      if (!resp.ok) {
         const msg =
            (typeof body === 'object' && body && (body as any).error) ||
            (typeof body === 'string' && body) ||
            `HTTP ${resp.status}`;
         return { error: String(msg) };
      }

      return { data: body as T };
   } catch (err: any) {
      const msg = err?.cause?.message || err?.message || 'fetch failed';
      return { error: String(msg) };
   } finally {
      clearTimeout(to);
   }
}

/** LIST */
export async function fetchAllArticles(
   _payload: ListParams,
): Promise<Result<TArticle[]>> {
   const limit = _payload.limit ?? 10;
   const offset = _payload.offset ?? 0;
   const url = `${BASE}/articles/${limit}/${offset}`;
   return request<TArticle[]>(url, { method: 'GET' });
}

/** LIST DELETED (soft-deleted) */
export async function fetchAllDeletedArticles(
   _payload: ListParams,
): Promise<Result<TArticle[]>> {
   const limit = _payload.limit ?? 10;
   const offset = _payload.offset ?? 0;
   const url = `${BASE}/articles/deleted/${limit}/${offset}`;
   return request<TArticle[]>(url, { method: 'GET' });
}

/** GET ONE */
export async function fetchArticleById(
   id: number | string,
): Promise<Result<TArticle>> {
   const url = `${BASE}/article/${id}`;
   return request<TArticle>(url, { method: 'GET' });
}

/** CREATE */
export async function createArticle(dto: CreateDTO): Promise<Result<TArticle>> {
   const url = `${BASE}/article`;
   return request<TArticle>(url, {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify({
         Title: dto.title,
         Content: dto.content,
         Category: dto.category,
         Status: dto.status,
      }),
   });
}

/** UPDATE (PUT by default) */
export async function updateArticle(
   id: number | string,
   dto: UpdateDTO,
   method: 'PUT' | 'PATCH' | 'POST' = 'PUT', // choose the verb you exposed
): Promise<Result<TArticle | {}>> {
   const url = `${BASE}/article/${id}`;
   // Only send provided fields (your validator treats empty as "ignore")
   const payload: Record<string, unknown> = {};
   if (dto.title !== undefined) payload.Title = dto.title;
   if (dto.content !== undefined) payload.Content = dto.content;
   if (dto.category !== undefined) payload.Category = dto.category;
   if (dto.status !== undefined) payload.Status = dto.status;

   // Your Gin update may return {} on success. We accept either {} or the updated entity.
   return request<TArticle | {}>(url, {
      method,
      headers: JSON_HEADERS,
      body: JSON.stringify(payload),
   });
}

/** DELETE */
export async function deleteArticle(id: number | string): Promise<Result<{}>> {
   const url = `${BASE}/article/${id}`;
   // Your Gin delete returns {} on success.
   return request<{}>(url, { method: 'DELETE' });
}

// Published articles
export async function fetchPublishedArticles({
   limit = 10,
   offset = 0,
}: {
   limit?: number;
   offset?: number;
}) {
   const r = await fetchAllArticles({ limit, offset });
   if (r.error) return r;
   return { data: (r.data ?? []).filter((a) => a.status === 'Publish') };
}

// Published article
export async function fetchPublishedArticleById(id: number | string) {
   const resp = await fetchArticleById(id);
   if (resp.error) return resp;
   const article = resp.data;
   if (article?.status !== 'Publish') {
      return { error: 'Not a published article' };
   }
   return { data: article };
}
