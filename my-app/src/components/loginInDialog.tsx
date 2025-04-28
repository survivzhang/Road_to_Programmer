"use client";
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
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export function LoginInDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const handleOpenInNewTab = () => {
    setIsOpen(false);
  };
  const handleSubmit = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setError("");

    try {
      const response = await fetch("http://localhost:5225/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // Handle successful login
        const data = await response.json();
        // Get user information from response
        const userData = {
          email: email,
          // If API returns other user information, it can be added here
        };
        // Pass token and user data to login function
        login(data.token, userData);
        toast.success("Login successful!");
        setIsOpen(false);
      } else if (response.status === 401) {
        // Handle error response
        console.error("Login failed");
        setError("Invalid email or password");
        toast.error("Invalid email or password");
      } else {
        // Handle other error responses
        console.error("Login failed");
        setError("Login failed. Please try again.");
        toast.error("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred. Please try again later.");
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(state) => {
        setIsOpen(state);
        if (!state) {
          setEmail("");
          setPassword("");
          setError(""); // clear error
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          onClick={() => {
            setIsOpen(true);
            setError(""); // 清除之前的错误消息
          }}
        >
          Login
        </Button>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        <div className="flex flex-col items-center gap-4">
          <Button type="submit" onClick={handleSubmit}>
            Submit
          </Button>
          <p className="text-sm text-muted-foreground">
            Not a member?{" "}
            <Link
              href={"/registration"}
              target="_blank" // Open in new tab
              className="underline hover:font-bold hover:text-blue-500"
              onClick={handleOpenInNewTab} // Open in new tab
            >
              Sign up now.
            </Link>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
