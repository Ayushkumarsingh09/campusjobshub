'use client';

import * as React from 'react';
import Link from 'next/link';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mainNav } from '@/config/site';

const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenu.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenu.List>
>(({ className, ...props }, ref) => (
  <NavigationMenu.List
    ref={ref}
    className={cn('group flex flex-1 list-none items-center justify-center gap-1', className)}
    {...props}
  />
));
NavigationMenuList.displayName = NavigationMenu.List.displayName;

const NavigationMenuItem = NavigationMenu.Item;

const navigationMenuTriggerStyle = cn(
  'group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50'
);

const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenu.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenu.Trigger>
>(({ className, children, ...props }, ref) => (
  <NavigationMenu.Trigger
    ref={ref}
    className={cn(navigationMenuTriggerStyle, 'group', className)}
    {...props}
  >
    {children}{' '}
    <ChevronDown
      className="relative top-px ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180"
      aria-hidden
    />
  </NavigationMenu.Trigger>
));
NavigationMenuTrigger.displayName = NavigationMenu.Trigger.displayName;

const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenu.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenu.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenu.Content
    ref={ref}
    className={cn(
      'left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto',
      className
    )}
    {...props}
  />
));
NavigationMenuContent.displayName = NavigationMenu.Content.displayName;

const NavigationMenuLink = NavigationMenu.Link;

const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenu.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenu.Viewport>
>(({ className, ...props }, ref) => (
  <div className={cn('absolute left-0 top-full flex justify-center')}>
    <NavigationMenu.Viewport
      className={cn(
        'origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-card text-card-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]',
        className
      )}
      ref={ref}
      {...props}
    />
  </div>
));
NavigationMenuViewport.displayName = NavigationMenu.Viewport.displayName;

interface MegaMenuProps {
  className?: string;
}

export function MegaMenu({ className }: MegaMenuProps) {
  return (
    <NavigationMenu.Root className={cn('relative z-10 hidden lg:flex', className)}>
      <NavigationMenuList>
        {mainNav.map((item) =>
          item.children ? (
            <NavigationMenuItem key={item.href}>
              <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-1 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {item.children.map((child) => (
                    <li key={child.href}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={child.href}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">{child.title}</div>
                          {'description' in child && child.description && (
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {child.description}
                            </p>
                          )}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ) : (
            <NavigationMenuItem key={item.href}>
              <NavigationMenuLink asChild>
                <Link href={item.href} className={navigationMenuTriggerStyle}>
                  {item.title}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          )
        )}
      </NavigationMenuList>
      <NavigationMenuViewport />
    </NavigationMenu.Root>
  );
}
