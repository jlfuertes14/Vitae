import { useEffect, useRef } from "react";
import { useResumeStore } from "@/lib/store/resume-store";
import { saveResumeContent } from "@/app/actions/resume";

export function useAutoSave(resumeId: string) {
  const { content, templateId, title, isDirty, setSaving, setLastSaved } =
    useResumeStore();
  
  // Track the previous content stringified to avoid unnecessary saves
  // when object references change but content is identical
  const prevContentRef = useRef(
    JSON.stringify({ content, templateId, title })
  );

  useEffect(() => {
    if (!isDirty) return;

    const currentContentStr = JSON.stringify({ content, templateId, title });
    if (currentContentStr === prevContentRef.current) return;

    const timeoutId = setTimeout(async () => {
      setSaving(true);
      
      const result = await saveResumeContent(
        resumeId,
        content,
        templateId,
        title
      );
      
      if (result.success) {
        setLastSaved(new Date());
        prevContentRef.current = currentContentStr;
      } else {
        // Handle error (maybe toast notification)
        console.error(result.error);
        setSaving(false); // Reset saving state so user knows it failed, though isDirty remains true
      }
    }, 2000); // 2-second debounce

    return () => clearTimeout(timeoutId);
  }, [content, isDirty, resumeId, setSaving, setLastSaved, templateId, title]);
}
