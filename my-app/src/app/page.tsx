"use client";

import Image from "next/image";
import { SelectRoad } from "@/components/selectroad";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  return (
    <div className="w-full flex flex-col items-center justify-start px-4 py-8">
      <div className="w-full max-w-2xl flex flex-col items-center gap-3">
        <Image
          className="dark:invert"
          src="/images/icon.png"
          alt="RTP logo"
          width={320}
          height={320}
          priority
        />
        <SelectRoad />

        {/* Plan creation promotion */}
        <Card className="w-full mt-8">
          <CardHeader>
            <CardTitle>Create Your Personal Learning Plan</CardTitle>
            <CardDescription>
              Let us help you create a customized plan to achieve your
              programming goals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Describe your learning goals and interests, and we'll provide you
              with a structured learning plan to guide your journey to becoming
              a programmer.
            </p>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => router.push(isLoggedIn ? "/ai" : "#")}
              disabled={!isLoggedIn}
            >
              {isLoggedIn ? "Get AI Advice" : "Login to Get AI Advice"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
