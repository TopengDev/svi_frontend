import {
   Card,
   CardAction,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export type TPricingPlanCardProps = {
   id: string;
   emoji?: string;
   title: string;
   contents: string[];
   desc?: string;
   footerContent?: string;
};

export default function PricingPlanCard({
   id,
   emoji,
   title,
   contents,
   desc,
   footerContent,
}: TPricingPlanCardProps) {
   return (
      <Card className="hover:scale-110 h-full shadow-lg flex flex-col jutify-between">
         <CardHeader>
            <CardTitle className="text-2xl">
               {emoji || ''} {title || ''}
            </CardTitle>
            <CardDescription className="">{desc || ''}</CardDescription>
         </CardHeader>

         <Separator />

         {contents?.map((content, i) => (
            <CardContent key={`card-content-${i}-${id}`}>
               <p>{content || ''}</p>
            </CardContent>
         ))}
         <CardAction className="w-full flex items-center justify-center px-8">
            <Button className="w-full" size="lg">
               Purchase
            </Button>
         </CardAction>

         <Separator />

         {footerContent && (
            <CardFooter className="w-full font-medium flex items-end justify-center py-4">
               <h5 className="text-primary font-medium">
                  {footerContent || ''}
               </h5>
            </CardFooter>
         )}
      </Card>
   );
}
