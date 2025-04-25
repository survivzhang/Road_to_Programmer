import { notFound } from "next/navigation";

interface RoadmapNode {
  id: string;
  type: string;
  data: {
    label: string;
    description?: string;
    url?: string;
  };
}

export default async function RoadmapPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const res = await fetch(`http://localhost:5225/roadmap/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) return notFound();

  const roadmap = await res.json();
  const nodes = roadmap.nodes as RoadmapNode[];
  const skillNodes = nodes.filter((n) => ["subtopic", "todo"].includes(n.type));

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 capitalize">
        {slug.replace("-", " ")} Roadmap
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {skillNodes.map((node) => (
          <div
            key={node.id}
            className="bg-white shadow-md rounded-xl p-4 border border-gray-200"
          >
            <h2 className="text-lg font-semibold mb-1">{node.data.label}</h2>
            {node.data.description && (
              <p className="text-sm text-gray-600 mb-2">
                {node.data.description}
              </p>
            )}
            {node.data.url && (
              <a
                href={node.data.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-sm underline"
              >
                Learn more
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
