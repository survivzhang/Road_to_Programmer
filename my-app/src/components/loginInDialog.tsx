import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export function LoginInDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Login</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="items-center text-center">
          <DialogTitle>Login</DialogTitle>
          <DialogDescription>
            Please enter your E-mail and password to login.
          </DialogDescription>
        </DialogHeader>
        {/* Add your login form here */}

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="Email" className="text-right">
              Email
            </Label>
            <Input
              id="Email"
              placeholder="xxx@xxx.com"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="xxxxxxxx"
              className="col-span-3"
            />
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <Button type="submit">Submit</Button>
          <p className="text-sm text-muted-foreground">
            Not a member?{" "}
            <Link
              href="#"
              className="underline hover:font-bold hover:text-blue-500"
            >
              Sign up now.
            </Link>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
