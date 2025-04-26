"use client";

import { useEffect, useState } from "react";

interface PlanStage {
  stage: number;
  skill: string;
  hours: number;
}

interface PlanResponse {
  planId: string;
  createdAt: string;
  plan: PlanStage[];
}

export default function MyPlansPage() {
  const [plan, setPlan] = useState<PlanResponse | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("latestPlan");
    if (stored) {
      setPlan(JSON.parse(stored));
    }
  }, []);

  if (!plan) {
    return (
      <div className="text-center mt-20">
        No plan found. Please generate one!
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold text-center">My Latest Plan</h1>
      <div className="text-center text-gray-600">
        Plan ID: {plan.planId} <br />
        Created At: {new Date(plan.createdAt).toLocaleString()}
      </div>

      <div className="grid gap-6">
        {plan.plan.map((stage) => (
          <div key={stage.stage} className="border p-4 rounded-md">
            <h2 className="text-xl font-semibold">Stage {stage.stage}</h2>
            <p>Skill: {stage.skill}</p>
            <p>Hours: {stage.hours}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
