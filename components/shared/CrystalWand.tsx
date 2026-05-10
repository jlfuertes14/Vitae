"use client";

import React, { useRef, useEffect } from "react";

export const CrystalWand = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<any[]>([]);
  const lastPos = useRef({ x: 0, y: 0 });
  const isEnabled = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resize);
    resize();

    class Particle {
      x: number;
      y: number;
      size: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      color: string;
      rotation: number;
      vRotation: number;
      isStar: boolean;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 8 + 6;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = Math.random() * 2 + 1;
        this.life = 1;
        this.maxLife = 0.01 + Math.random() * 0.02; // Decay rate
        this.color = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.5})`;
        this.rotation = Math.random() * Math.PI * 2;
        this.vRotation = (Math.random() - 0.5) * 0.1;
        this.isStar = Math.random() > 0.6;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.maxLife;
        this.rotation += this.vRotation;
        this.size *= 0.98; // Shrink
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.life;
        ctx.fillStyle = "white";
        ctx.shadowBlur = 15;
        ctx.shadowColor = "white";

        if (this.isStar) {
          this.drawStar(ctx, 0, 0, 5, this.size, this.size / 2);
        } else {
          ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        }

        ctx.restore();
      }

      drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) {
        let rot = (Math.PI / 2) * 3;
        let x = cx;
        let y = cy;
        let step = Math.PI / spikes;

        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
          x = cx + Math.cos(rot) * outerRadius;
          y = cy + Math.sin(rot) * outerRadius;
          ctx.lineTo(x, y);
          rot += step;

          x = cx + Math.cos(rot) * innerRadius;
          y = cy + Math.sin(rot) * innerRadius;
          ctx.lineTo(x, y);
          rot += step;
        }
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        ctx.fill();
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.current.length; i++) {
        const p = particles.current[i];
        p.update();
        p.draw(ctx);

        if (p.life <= 0) {
          particles.current.splice(i, 1);
          i--;
        }
      }

      requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const section = target.closest("section, footer");
      const isHero = section?.querySelector(".hero-title") || section?.classList.contains("hero-section");
      
      if (section && !isHero) {
        isEnabled.current = true;
      } else {
        isEnabled.current = false;
      }

      if (!isEnabled.current) return;

      const dist = Math.hypot(e.clientX - lastPos.current.x, e.clientY - lastPos.current.y);
      if (dist > 5) { // High density threshold
        for (let i = 0; i < 2; i++) { // Spawn 2 particles per step
          particles.current.push(new Particle(e.clientX, e.clientY));
        }
        lastPos.current = { x: e.clientX, y: e.clientY };
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    const animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
    />
  );
};
