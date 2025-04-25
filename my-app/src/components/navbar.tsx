import React from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { LoginInDialog } from "./loginInDialog";

import { cn } from "@/lib/utils";
const navItemStyle = "px-3 py-1.5 rounded-md hover:bg-[var(--accent)]";

export function Navbar() {
  return (
    <div className="flex justify-between items-center p-2 shadow-md bg-[var(--secondary)] text-[var(--secondary-foreground)]">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={navItemStyle}>
              <Link href="/">Homepage</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={navItemStyle}>
              <Link href="#">AI Advice</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={navItemStyle}>
              <Link href="#">Plan</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div className="flex flex-row items-center">
        <div className="relative h-12 w-auto aspect-[2.5]">
          <Image
            src="/images/logo.png"
            alt="Logo"
            fill
            className="object-contain"
          />
        </div>
        <LoginInDialog />
      </div>
    </div>
  );
}
