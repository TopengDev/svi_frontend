'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { createForm } from '@/components/custom/form';
import {
   createArticle,
   updateArticle,
   fetchArticleById,
} from '../services/index.service';
import { TArticle } from '@/app/types';

type ArticleForm = {
   title: string;
   content: string;
   category: string;
   status: 'Publish' | 'Draft' | 'Trash';
};

const { FormProvider, useForm, Form } = createForm<ArticleForm>({
   initialFormData: {
      title: '',
      content: '',
      category: '',
      status: 'Draft',
   },
});

function Component() {
   const params = useParams<{ id: string }>();
   const router = useRouter();
   const id = params.id; // "new" or numeric string

   const { formData, actions } = useForm();
   const [loading, setLoading] = useState(false);

   // preload article if editing
   useEffect(() => {
      if (id !== 'new') {
         setLoading(true);
         fetchArticleById(id)
            .then((resp) => {
               if (resp.error) {
                  toast(resp.error, { style: { color: 'red' } });
                  return;
               }
               const a = resp.data as TArticle;
               actions.setFormFields({
                  title: a.title,
                  content: a.content,
                  category: a.category,
                  status: a.status as ArticleForm['status'],
               });
            })
            .finally(() => setLoading(false));
      }
   }, [id]);

   return (
      <div className="w-full h-full flex items-center justify-center p-6 pt-32">
         <div className="w-full h-full max-w-3xl">
            {loading ? (
               <p>Loading...</p>
            ) : (
               <Form
                  handleSubmit={async (formData) => {
                     // validations …
                     if (
                        !['Publish', 'Draft', 'Trash'].includes(formData.status)
                     ) {
                        toast('Status must be Publish, Draft, or Trash.', {
                           style: { color: 'red' },
                        });
                        return;
                     }

                     let resp;
                     if (id === 'new') {
                        resp = await createArticle(formData);
                     } else if (formData.status === 'Trash') {
                        // delete instead of update
                        const { deleteArticle } = await import(
                           '../services/index.service'
                        );
                        resp = await deleteArticle(id);
                     } else {
                        resp = await updateArticle(id, formData, 'PUT');
                     }

                     if (resp.error) {
                        toast(resp.error, { style: { color: 'red' } });
                        return;
                     }

                     toast(
                        id === 'new'
                           ? 'Article created!'
                           : formData.status === 'Trash'
                             ? 'Article deleted!'
                             : 'Article updated!',
                        { style: { color: 'green' } },
                     );

                     router.push('/articles');
                  }}
                  fields={[
                     {
                        type: 'text',
                        fieldName: 'title',
                        label: 'Title',
                        required: true,
                        minLength: 20,
                        maxLength: 200,
                        placeholder: 'Enter a descriptive title (20–200 chars)',
                     },
                     {
                        type: 'text',
                        fieldName: 'content',
                        label: 'Content',
                        required: true,
                        minLength: 200,
                        placeholder:
                           'Write your article content (≥ 200 chars)…',
                     },
                     {
                        type: 'text',
                        fieldName: 'category',
                        label: 'Category',
                        required: true,
                        minLength: 3,
                        maxLength: 100,
                        placeholder: 'e.g. Programming',
                     },
                     {
                        type: 'select',
                        fieldName: 'status',
                        label: 'Status',
                        required: true,
                        options: [
                           { label: 'Publish', value: 'Publish' },
                           { label: 'Draft', value: 'Draft' },
                           { label: 'Trash', value: 'Trash' },
                        ],
                     },
                  ]}
               />
            )}
         </div>
      </div>
   );
}

export default function Page() {
   return (
      <FormProvider>
         <Component />
      </FormProvider>
   );
}
