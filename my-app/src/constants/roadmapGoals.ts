// src/constants/roadmapGoals.ts

export interface RoadmapGoal {
  value: string;
  label: string;
  description?: string;
}

export const roadmapGoals: RoadmapGoal[] = [
  { value: "frontend", label: "Frontend Developer" },
  { value: "backend", label: "Backend Developer" },
  { value: "ai-engineer", label: "AI Engineer" },
  { value: "cyber-security", label: "Cyber Security" },
  { value: "data-analyst", label: "Data Analyst" },
  { value: "full-stack", label: "Full Stack Engineer" },
];
