"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isEmailValid = email.includes("@");
  const canSubmit = isEmailValid && password.length >= 6;

  const handleSubmit = () => {
    alert(`登录成功：${email}`);
  };

  return (
    <div className="max-w-sm mx-auto mt-10 space-y-6">
      <div>
        <Label>Email</Label>
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        {!isEmailValid && email && (
          <p className="text-xs text-red-500 mt-1">请输入合法邮箱</p>
        )}
      </div>

      <div>
        <Label>Password</Label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="至少 6 位"
        />
      </div>

      <Button onClick={handleSubmit} disabled={!canSubmit} className="w-full">
        登录
      </Button>
    </div>
  );
}

export default function Page() {
  return <LoginForm />;
}
