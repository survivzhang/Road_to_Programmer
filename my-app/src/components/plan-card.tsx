import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

interface PlanWeek {
  week: number;
  topic: string;
  hours: number;
  isCompleted: boolean;
}

interface PlanCardProps {
  id: number;
  planId: string;
  title: string;
  description: string;
  createdAt: string;
  username: string;
  onDelete: (planId: string) => void;
  onToggleComplete?: (
    planId: string,
    weekIndex: number,
    isCompleted: boolean
  ) => void;
}

export function PlanCard({
  id,
  planId,
  title,
  description,
  createdAt,
  username,
  onDelete,
  onToggleComplete,
}: PlanCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [weeks, setWeeks] = useState<PlanWeek[]>([]);

  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    // Parse the plan content when component mounts or description changes
    try {
      const planWeeks = JSON.parse(description);
      setWeeks(planWeeks);
    } catch (e) {
      console.error("Failed to parse plan data:", e);
    }
  }, [description]);

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete plan #${id}?`)) {
      onDelete(planId);
    }
  };

  const handleToggleComplete = async (index: number) => {
    try {
      const updatedWeeks = [...weeks];
      updatedWeeks[index].isCompleted = !updatedWeeks[index].isCompleted;
      setWeeks(updatedWeeks);

      if (onToggleComplete) {
        onToggleComplete(planId, index, updatedWeeks[index].isCompleted);
      } else {
        // If no onToggleComplete callback is provided, we can implement a default behavior
        // This would call your backend API to update the progress
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("You need to be logged in to track progress");
          return;
        }

        // Example API call (implement according to your backend)
        const response = await fetch(`/ai/plan/${planId}/progress`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            weekIndex: index,
            isCompleted: updatedWeeks[index].isCompleted,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update progress");
        }

        toast.success("Progress updated successfully");
      }
    } catch (error) {
      console.error("Error updating progress:", error);
      toast.error("Failed to update progress");
    }
  };

  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            className="p-0 h-auto flex items-center gap-2"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <span className="font-bold">Plan #{id}</span>
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 p-2"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <>
          <CardHeader className="py-2">
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription className="flex justify-between">
              <span>Created on {formattedDate}</span>
              <span>by {username}</span>
            </CardDescription>
            <CardDescription className="text-xs text-gray-500 mt-2">
              Plan ID: {planId}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {weeks.length > 0 ? (
              <div className="space-y-4">
                <h3 className="font-semibold">Learning Plan</h3>
                <div className="grid grid-cols-4 gap-2 font-semibold text-sm border-b pb-2">
                  <div>Week</div>
                  <div>Topic</div>
                  <div>Hours</div>
                  <div>Progress</div>
                </div>
                {weeks.map((week, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-4 gap-2 text-sm border-b pb-2 items-center"
                  >
                    <div>Week {week.week}</div>
                    <div
                      className={
                        week.isCompleted ? "line-through text-gray-500" : ""
                      }
                    >
                      {week.topic}
                    </div>
                    <div>{week.hours} hours</div>
                    <div>
                      <Checkbox
                        checked={week.isCompleted}
                        onCheckedChange={() => handleToggleComplete(index)}
                        className="data-[state=checked]:bg-green-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="whitespace-pre-wrap">{description}</p>
            )}
          </CardContent>
        </>
      )}
    </Card>
  );
}
