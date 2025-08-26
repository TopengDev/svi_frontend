export type TArticle = {
   id?: number;
   title: string;
   content: string;
   category: string;
   status: 'Draft' | 'Publish' | 'Trash';
};
