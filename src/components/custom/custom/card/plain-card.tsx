import {
   Card,
   CardAction,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from '@/components/ui/card';
import { Accordion, TAccordionItem } from '../accordion';

export type TPlainTextCardProps = {
   title: string;
   desc?: string;
   footerContent?: string;
} & (
   | {
        contentType: 'accordions';
        contents: TAccordionItem[];
     }
   | {
        contentType?: 'plain-text';
        contents: string[];
     }
);

export default function PlainTextCard({
   title,
   contents,
   desc,
   footerContent,
   contentType = 'plain-text',
}: TPlainTextCardProps) {
   return (
      <Card className="w-full">
         <CardHeader>
            <CardTitle>{title || ''}</CardTitle>
            <CardDescription>{desc || ''}</CardDescription>
         </CardHeader>

         <CardContent>
            {contentType === 'plain-text' &&
               contents?.map((content, i) => (
                  <p key={`card-content-${i}-${title}`}>
                     {(content as string) || ''}
                  </p>
               ))}

            {contentType === 'accordions' && (
               <Accordion items={contents as TAccordionItem[]} />
            )}
         </CardContent>
         {footerContent && (
            <CardFooter>
               <p>{footerContent || ''}</p>
            </CardFooter>
         )}
      </Card>
   );
}
