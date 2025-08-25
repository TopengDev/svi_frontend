'use client';

import * as React from 'react';
import Link from 'next/link';
import { CircleCheckIcon, CircleHelpIcon, CircleIcon } from 'lucide-react';

import {
   NavigationMenu,
   NavigationMenuContent,
   NavigationMenuItem,
   NavigationMenuLink,
   NavigationMenuList,
   NavigationMenuTrigger,
   navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';

export type TNavbarProps = {
   navItems: (
      | {
           type?: 'nav-item';
           title: string;
           desc?: string;
           href: string;
        }
      | { type: 'component'; component: React.FC }
   )[];
};

export function Navbar(props: TNavbarProps) {
   return (
      <div className="responsive-horizontal-padding fixed top-0 left-0 w-full py-4 flex items-center justify-between z-30 bg-background shadow-sm">
         <div>
            <h4 className="text-primary font-semibold">LOGO</h4>
         </div>

         <div className="flex items-center gap-2">
            <NavigationMenu>
               <NavigationMenuList>
                  {props.navItems.map((navItem, i) => {
                     if (navItem.type === 'nav-item')
                        return (
                           <ListItem
                              key={`nav-item-${navItem.title}-${i}`}
                              title={navItem.title}
                              href={navItem.href}
                           >
                              {navItem.desc || ''}
                           </ListItem>
                        );

                     if (navItem.type === 'component')
                        return (
                           <navItem.component key={`component-nav-item-${i}`} />
                        );
                  })}
               </NavigationMenuList>
            </NavigationMenu>
            <Button>Sign in</Button>
         </div>
      </div>
   );
}

function ListItem({
   title,
   children,
   href,
   ...props
}: React.ComponentPropsWithoutRef<'li'> & { href: string }) {
   return (
      <li {...props}>
         <NavigationMenuLink asChild>
            <Link href={href}>
               <div className="text-sm leading-none font-medium">{title}</div>
               <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                  {children}
               </p>
            </Link>
         </NavigationMenuLink>
      </li>
   );
}
