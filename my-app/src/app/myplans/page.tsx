"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PlanCard } from "@/components/plan-card";

interface PlanWeek {
  week: number;
  topic: string;
  hours: number;
}

interface Plan {
  planId: string;
  createdAt: string;
  plan: PlanWeek[];
}

export default function MyPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPlans = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      console.log("Fetching plans with token:", token.substring(0, 10) + "...");

      const res = await fetch("http://localhost:5225/ai/my-plans", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error loading plans:", res.status, errorText);
        throw new Error(`Failed to load plans: ${res.status}`);
      }

      const data = await res.json();
      console.log("Fetched plans raw response:", data);
      setPlans(data);
    } catch (error) {
      console.error("Error in fetchPlans:", error);
      setError("Failed to load plans. Please try again later.");
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleDeletePlan = async (planId: string) => {
    try {
      setIsDeleting(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      // Log the plan ID we're trying to delete
      console.log(`Attempting to delete plan with ID: "${planId}"`);

      // Ensure planId isn't undefined or empty
      if (!planId) {
        throw new Error("Invalid plan ID");
      }

      const res = await fetch(
        `http://localhost:5225/ai/plan/${encodeURIComponent(planId)}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error deleting plan:", res.status, errorText);
        throw new Error(`Failed to delete plan: ${res.status}`);
      }

      // Update the local state
      setPlans(plans.filter((p) => p.planId !== planId));
      toast.success("Plan deleted successfully");
    } catch (error) {
      console.error("Error in handleDeletePlan:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete plan"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (error) {
    return <div className="text-center mt-20 text-red-500">{error}</div>;
  }

  if (plans.length === 0) {
    return (
      <div className="text-center mt-20">No plans found. Generate one!</div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">My Plans</h1>

      <div className="space-y-4">
        {plans.map((plan, index) => {
          console.log(`Rendering plan ${index}:`, plan);
          return (
            <PlanCard
              key={plan.planId}
              id={index + 1}
              planId={plan.planId}
              title={`Learning Plan ${index + 1}`}
              description={JSON.stringify(plan.plan)}
              createdAt={plan.createdAt}
              username={"You"}
              onDelete={() => handleDeletePlan(plan.planId)}
            />
          );
        })}
      </div>
    </div>
  );
}
