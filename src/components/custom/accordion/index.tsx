import {
   Accordion as ShadCNAccordion,
   AccordionContent,
   AccordionItem,
   AccordionTrigger,
} from '@/components/ui/accordion';

export type TAccordionItem = {
   title: string;
   description: string[];
   value: string;
};

export type TAccordionProps = {
   items: TAccordionItem[];
};

export function Accordion({ items }: TAccordionProps) {
   return (
      <ShadCNAccordion
         type="single"
         collapsible
         className={`w-full`}
         defaultValue="item-1"
      >
         {items?.map((item, i) => {
            return (
               <AccordionItem
                  value={item.value}
                  key={`accordion-${i}-${item.title}-${item.value}`}
               >
                  <AccordionTrigger>
                     <p className="font-medium">{item.title || ''}</p>
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-4 text-balance">
                     {item.description?.map((desc, j) => (
                        <p
                           key={`accordion-desc-${i}-${j}-${item.title}-${item.value}`}
                        >
                           {desc || ''}
                        </p>
                     ))}
                  </AccordionContent>
               </AccordionItem>
            );
         })}
      </ShadCNAccordion>
   );
}
