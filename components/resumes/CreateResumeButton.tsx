"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { createResumeDraft } from "@/app/actions/resume";
import { Button } from "@/components/ui/button";

interface CreateResumeButtonProps {
  templateId?: string;
  className?: string;
  children: ReactNode;
}

export function CreateResumeButton({
  templateId,
  className,
  children,
}: CreateResumeButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      className={className}
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          const result = await createResumeDraft({ templateId });
          if (result.success) {
            router.push(`/resumes/${result.resumeId}`);
          } else {
            console.error(result.error);
          }
        });
      }}
    >
      {isPending ? "Creating..." : children}
    </Button>
  );
}
