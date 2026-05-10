import { EditorLayout } from "@/components/editor/EditorLayout";

export default async function ResumeEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // In a real implementation, fetch the resume data from Prisma here
  // and pass it down or initialize the Zustand store.
  // For now, we'll just render the EditorLayout.

  return <EditorLayout resumeId={id} />;
}
