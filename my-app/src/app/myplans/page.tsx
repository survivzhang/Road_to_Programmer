"use client";

import { useEffect, useState } from "react";

interface Plan {
  id: number;
  planId: string;
  email: string;
  createdAt: string;
  planData: string; // PlanData是后端存的JSON字符串
}

export default function MyPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

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
        setPlans(data);
      } catch (error) {
        console.error(error);
        setError("Failed to load plans. Please try again later.");
      }
    };

    fetchPlans();
  }, []);

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

      <div className="space-y-6">
        {plans.map((plan) => (
          <div key={plan.planId} className="border p-6 rounded-md shadow">
            <h2 className="text-2xl font-semibold">Plan ID: {plan.planId}</h2>
            <p className="text-gray-600 mb-2">
              Created At: {new Date(plan.createdAt).toLocaleString()}
            </p>

            {/* 可以进一步解析PlanData */}
            <div className="text-sm text-gray-700 whitespace-pre-wrap">
              {plan.planData}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
