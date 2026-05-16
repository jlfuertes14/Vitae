"use client";

import { useState } from "react";
import { TemplateRenderer } from "./TemplateRenderer";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Maximize } from "lucide-react";

export function PreviewPane() {
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 1.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.5));
  const handleZoomReset = () => setZoom(1);

  return (
    <div className="relative flex h-full w-full flex-1 justify-center overflow-y-auto bg-muted/30 custom-scrollbar">
      
      {/* Zoom Controls */}
      <div className="sticky top-3 z-20 ml-0 mt-3 flex h-fit flex-row gap-1.5 self-start rounded-xl border bg-background/80 p-1.5 shadow-sm backdrop-blur-md sm:top-6 sm:ml-4 sm:mt-6 sm:flex-col">
        <Button variant="ghost" size="icon" onClick={handleZoomIn} className="size-8 rounded-md" title="Zoom In">
          <ZoomIn className="size-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleZoomReset} className="size-8 rounded-md" title="Reset Zoom">
          <span className="text-xs font-medium">{Math.round(zoom * 100)}%</span>
        </Button>
        <Button variant="ghost" size="icon" onClick={handleZoomOut} className="size-8 rounded-md" title="Zoom Out">
          <ZoomOut className="size-4" />
        </Button>
      </div>

      <div className="flex flex-1 items-start justify-center overflow-x-auto px-3 py-6 sm:px-8 sm:py-8 custom-scrollbar">
        <TemplateRenderer zoom={zoom} />
      </div>
    </div>
  );
}
