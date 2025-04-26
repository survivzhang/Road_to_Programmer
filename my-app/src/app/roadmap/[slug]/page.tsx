"use client";

import { notFound, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RoadmapCard } from "@/components/roadmap-card";
import ProtectedPage from "@/components/protectedPage";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

interface RoadmapNode {
  label: string;
  description: string;
  url: string;
  stage: number;
}

interface RoadmapData {
  title: string;
  nodes: RoadmapNode[];
}

export default function RoadmapPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const router = useRouter();

  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetchWithAuth(
          `http://localhost:5225/roadmap/${slug}`
        );
        if (!res.ok) {
          router.push("/"); // fallback if not found
          return;
        }
        const data = await res.json();
        setRoadmapData(data);
      } catch (error) {
        console.error(error);
        router.push("/"); // fallback if error
      }
    }
    loadData();
  }, [slug, router]);

  if (!roadmapData) {
    return <div>Loading...</div>;
  }

  const grouped = roadmapData.nodes.reduce((acc, node) => {
    const stage = node.stage || 5;
    if (!acc[stage]) acc[stage] = [];
    acc[stage].push(node);
    return acc;
  }, {} as Record<number, RoadmapNode[]>);

  return (
    <ProtectedPage>
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 capitalize">
          {roadmapData.title}
        </h1>
        {Object.entries(grouped)
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([stage, items]) => (
            <div key={stage} className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">Stage {stage}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {items.map((node, index) => (
                  <RoadmapCard
                    key={index}
                    label={node.label}
                    description={node.description}
                    url={node.url}
                  />
                ))}
              </div>
            </div>
          ))}
      </div>
    </ProtectedPage>
  );
}
