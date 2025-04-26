import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PlanCardProps {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  username: string;
}

export function PlanCard({
  id,
  title,
  description,
  createdAt,
  username,
}: PlanCardProps) {
  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="flex justify-between">
          <span>Created on {formattedDate}</span>
          <span>by {username}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap">{description}</p>
      </CardContent>
    </Card>
  );
}
