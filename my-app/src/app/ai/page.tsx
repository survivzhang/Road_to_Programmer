"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { roadmapGoals } from "@/constants/roadmapGoals";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export default function AIPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoggedIn } = useAuth();
  const preSelectedGoal = searchParams.get("goal") || "";

  const [goal, setGoal] = useState(preSelectedGoal);
  const [level, setLevel] = useState("");
  const [targetLevel, setTargetLevel] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState("");
  const [customRequirements, setCustomRequirements] = useState("");

  const handleSubmit = async () => {
    if (!isLoggedIn || !user) {
      toast.error("Please login before generating a plan.");
      return;
    }

    if (!goal || !level || !hoursPerWeek) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const planDescription = `
      I want to become a ${targetLevel} ${
      roadmapGoals.find((g) => g.value === goal)?.label || goal
    },
      studying ${hoursPerWeek} hours per week.
      Current level: ${level}.
      ${
        customRequirements
          ? "Additional requirements: " + customRequirements
          : ""
      }
    `.trim();

    try {
      const response = await fetch("http://localhost:5225/ai/generate-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user?.email,
          planDescription,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate plan");
      }

      const data = await response.json();
      console.log("Generated Plan:", data);
      toast.success("Plan generated successfully!");

      // 后面可以跳转到Plan页面显示计划
    } catch (error) {
      console.error(error);
      toast.error("Error generating plan.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">
        AI Learning Plan Generator
      </h1>

      <div className="space-y-4">
        <label>Career Goal</label>
        <select
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">Select a goal</option>
          {roadmapGoals.map((g) => (
            <option key={g.value} value={g.value}>
              {g.label}
            </option>
          ))}
        </select>

        <label>Current Level</label>
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">Select your level</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        <label>Target Level</label>
        <select
          value={targetLevel}
          onChange={(e) => setTargetLevel(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">Select target level</option>
          <option value="Junior Engineer">Junior Engineer</option>
          <option value="Senior Engineer">Senior Engineer</option>
        </select>

        <label>Hours per Week</label>
        <Input
          type="number"
          value={hoursPerWeek}
          onChange={(e) => setHoursPerWeek(e.target.value)}
          placeholder="e.g., 10"
        />

        <label>Additional Requirements</label>
        <Textarea
          value={customRequirements}
          onChange={(e) => setCustomRequirements(e.target.value)}
          placeholder="Any specific requirements or focuses?"
        />

        <Button className="w-full" onClick={handleSubmit}>
          Generate AI Plan
        </Button>
      </div>
    </div>
  );
}
