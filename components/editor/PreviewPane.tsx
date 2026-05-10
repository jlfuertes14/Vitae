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
    <div className="flex-1 w-full h-full overflow-y-auto bg-muted/30 flex justify-center custom-scrollbar relative">
      
      {/* Zoom Controls */}
      <div className="sticky top-6 z-20 flex flex-col gap-1.5 p-1.5 rounded-lg bg-background/80 backdrop-blur-md border shadow-sm ml-4 mt-6 h-fit">
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

      <div className="flex-1 py-8 px-4 sm:px-8 overflow-x-auto custom-scrollbar flex justify-center items-start">
        <TemplateRenderer zoom={zoom} />
      </div>
    </div>
  );
}
