import { EditorLayout } from "@/components/editor/EditorLayout";
import { TemplateRenderer } from "@/components/editor/TemplateRenderer";

export default async function ResumePrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // In a real implementation, fetch the resume data by ID from Prisma
  // and pass it as a prop to initialize the store or TemplateRenderer.
  
  return (
    <div className="bg-white min-h-screen">
      <TemplateRenderer zoom={1} />
    </div>
  );
}
