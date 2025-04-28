import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";

export function AvatarDropDown() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout(); // Use the logout method from AuthContext, which will remove the token and update login status
    router.push("/"); // Redirect to homepage
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        <DropdownMenuItem onClick={() => router.push("/ai")}>
          AI Advice
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/myplans")}>
          My Plans
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
