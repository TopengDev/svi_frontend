import {
   Sidebar,
   SidebarContent,
   SidebarGroup,
   SidebarGroupContent,
   SidebarGroupLabel,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
} from '@/components/ui/sidebar';
import { ComponentProps } from 'react';
import { LucideIcon } from 'lucide-react';

type TSidebarItem = {
   title: string;
   url: string;
   icon: React.ForwardRefExoticComponent<
      Omit<ComponentProps<LucideIcon>, 'ref'> &
         React.RefAttributes<SVGSVGElement>
   >;
};

type TSidebarProps = {
   title?: string
   items: TSidebarItem[];
};

export function AppSidebar(props: TSidebarProps) {
   return (
      <Sidebar>
         <SidebarContent>
            <SidebarGroup>
               <SidebarGroupLabel>{props?.title || ''}</SidebarGroupLabel>
               <SidebarGroupContent>
                  <SidebarMenu>
                     {props?.items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                           <SidebarMenuButton asChild>
                              <a href={item.url}>
                                 <item.icon />
                                 <span>{item.title}</span>
                              </a>
                           </SidebarMenuButton>
                        </SidebarMenuItem>
                     ))}
                  </SidebarMenu>
               </SidebarGroupContent>
            </SidebarGroup>
         </SidebarContent>
      </Sidebar>
   );
}
