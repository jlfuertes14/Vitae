import { DashboardPlaceholder } from "@/components/dashboard/DashboardPlaceholder";

export default function AIAssistantPage() {
  return (
    <DashboardPlaceholder
      eyebrow="AI assistant"
      title="A dedicated AI command center can grow here."
      description="Right now the assistant already appears inside editing flows. This route gives it a dashboard destination until a standalone AI workspace is built."
      primaryHref="/job-match"
      primaryLabel="Try job match"
    />
  );
}
