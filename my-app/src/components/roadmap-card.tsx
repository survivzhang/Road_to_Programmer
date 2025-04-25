import { Card, CardContent } from "@/components/ui/card";
interface RoadmapCardProps {
  label: string;
  description: string;
  url: string;
}
export function RoadmapCard({ label, description, url }: RoadmapCardProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block transition-transform hover:scale-[1.02]"
    >
      <Card className="h-full hover:shadow-lg hover:border-blue-500 transition">
        <CardContent className="p-4 space-y-2">
          <h3 className="text-lg font-semibold">{label}</h3>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {description}
          </p>
        </CardContent>
      </Card>
    </a>
  );
}
