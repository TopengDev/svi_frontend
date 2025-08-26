'use client';

import { TArticle } from '@/app/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ColumnDef } from '@tanstack/react-table';
import type { LucideIcon } from 'lucide-react';
import { ComponentProps } from 'react';

export type TTabsProps = {
   tabItems: {
      value: string;
      title: string;
      content: React.ReactNode;
      icon?: React.ForwardRefExoticComponent<
         Omit<ComponentProps<LucideIcon>, 'ref'> &
            React.RefAttributes<SVGSVGElement>
      >;
   }[];
   defaultValue?: string;
};

export function CustomTabs({ tabItems, defaultValue }: TTabsProps) {
   return (
      <Tabs
         defaultValue={defaultValue ?? tabItems[0]?.value}
         className="w-full"
      >
         <TabsList className="w-full">
            {tabItems.map((item) => {
               const Icon = item.icon;
               return (
                  <TabsTrigger
                     key={item.value}
                     value={item.value}
                     className="flex items-center gap-2"
                  >
                     {Icon && <Icon className="h-4 w-4" />}
                     {item.title}
                  </TabsTrigger>
               );
            })}
         </TabsList>
         {tabItems.map((item) => (
            <TabsContent key={item.value} value={item.value}>
               {item.content}
            </TabsContent>
         ))}
      </Tabs>
   );
}
