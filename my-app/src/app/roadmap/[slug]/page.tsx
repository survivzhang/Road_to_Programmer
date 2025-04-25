import { notFound } from "next/navigation";

interface RoadmapNode {
  label: string;
  description: string;
  url: string;
  stage: number;
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

  const grouped = nodes.reduce((acc, node) => {
    const stage = node.stage || 5;
    if (!acc[stage]) acc[stage] = [];
    acc[stage].push(node);
    return acc;
  }, {} as Record<number, RoadmapNode[]>);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 capitalize">{roadmap.title}</h1>
      {Object.entries(grouped)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([stage, items]) => (
          <div key={stage} className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Stage {stage}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {items.map((node, index) => (
                <a
                  key={index}
                  href={node.url || undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-white shadow-md rounded-xl p-4 border border-gray-200 hover:shadow-lg transition"
                >
                  <h3 className="text-lg font-semibold mb-1">{node.label}</h3>
                  <p className="text-sm text-gray-600">{node.description}</p>
                </a>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
