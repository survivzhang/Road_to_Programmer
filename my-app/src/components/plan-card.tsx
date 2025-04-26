import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface PlanWeek {
  week: number;
  topic: string;
  hours: number;
}

interface PlanCardProps {
  id: number;
  planId: string;
  title: string;
  description: string;
  createdAt: string;
  username: string;
  onDelete: (planId: string) => void;
}

export function PlanCard({
  id,
  planId,
  title,
  description,
  createdAt,
  username,
  onDelete,
}: PlanCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete plan #${id}?`)) {
      onDelete(planId);
    }
  };

  // Parse the plan content to display Week and Topic
  let planWeeks: PlanWeek[] = [];
  try {
    planWeeks = JSON.parse(description);
  } catch (e) {
    // If parsing fails, keep the description as is
    console.error("Failed to parse plan data:", e);
  }

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
            {planWeeks.length > 0 ? (
              <div className="space-y-4">
                <h3 className="font-semibold">Learning Plan</h3>
                <div className="grid grid-cols-3 gap-2 font-semibold text-sm border-b pb-2">
                  <div>Week</div>
                  <div>Topic</div>
                  <div>Hours</div>
                </div>
                {planWeeks.map((week, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-3 gap-2 text-sm border-b pb-2"
                  >
                    <div>Week {week.week}</div>
                    <div>{week.topic}</div>
                    <div>{week.hours} hours</div>
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
