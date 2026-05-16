"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { ArrowRight, Clock3, Edit3, Ellipsis, FileText } from "lucide-react";

import { updateResumeTitle } from "@/app/actions/resume";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

interface ResumeLibraryCardProps {
  resume: {
    id: string;
    title: string;
    templateName: string;
    fullName: string;
    updatedAt: string;
  };
}

export function ResumeLibraryCard({ resume }: ResumeLibraryCardProps) {
  const router = useRouter();
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [draftTitle, setDraftTitle] = useState(resume.title);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setDraftTitle(resume.title);
  }, [resume.title]);

  const handleRename = () => {
    startTransition(async () => {
      const result = await updateResumeTitle(resume.id, draftTitle);
      if (result.success) {
        setIsRenameOpen(false);
      } else {
        console.error(result.error);
      }
    });
  };

  return (
    <>
      <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition hover:bg-white/[0.06]">
        <div className="flex items-start justify-between gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3">
            <FileText className="size-5 text-white" />
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 rounded-full text-white/45 hover:bg-white/[0.08] hover:text-white"
              onClick={() => router.push(`/resumes/${resume.id}`)}
            >
              <ArrowRight className="size-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger
                type="button"
                aria-label="Resume actions"
                className="inline-flex size-8 items-center justify-center rounded-full text-white/45 transition hover:bg-white/[0.08] hover:text-white"
              >
                <Ellipsis className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-44 border-white/10 bg-[#0f0f0f] text-white"
              >
                <DropdownMenuItem
                  className="cursor-pointer text-white/80 hover:bg-white/5"
                  onClick={() => router.push(`/resumes/${resume.id}`)}
                >
                  <ArrowRight className="size-4" />
                  Open editor
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer text-white/80 hover:bg-white/5"
                  onClick={() => setIsRenameOpen(true)}
                >
                  <Edit3 className="size-4" />
                  Edit name
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <button
          type="button"
          className="mt-6 block w-full text-left"
          onClick={() => router.push(`/resumes/${resume.id}`)}
        >
          <h3 className="text-xl font-medium text-white">{resume.title}</h3>
          <p className="mt-2 text-sm leading-6 text-white/50">
            {resume.fullName || "No name added yet"} · {resume.templateName}
          </p>
          <div className="mt-5 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/30">
            <Clock3 className="size-3.5" />
            Updated {resume.updatedAt}
          </div>
        </button>
      </div>

      <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
        <DialogContent className="border-white/10 bg-[#0f0f0f] text-white">
          <DialogHeader>
            <DialogTitle>Rename resume</DialogTitle>
            <DialogDescription className="text-white/50">
              Give this draft a name that is easier to recognize in your library.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.2em] text-white/40">
              Resume title
            </label>
            <Input
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              placeholder="Untitled Resume"
              className="h-11 rounded-2xl border-white/10 bg-white/[0.04] text-white"
            />
          </div>

          <DialogFooter className="border-white/10 bg-white/[0.02]">
            <Button
              variant="outline"
              onClick={() => setIsRenameOpen(false)}
              className="border-white/10 bg-transparent text-white hover:bg-white/[0.06]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRename}
              disabled={isPending || !draftTitle.trim()}
              className="bg-white text-black hover:bg-white/90"
            >
              {isPending ? "Saving..." : "Save name"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
