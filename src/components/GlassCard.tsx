"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function GlassCard({ children, className, delay = 0 }: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { y: 40, opacity: 0, scale: 0.95 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.2,
        delay,
        ease: "power4.out",
      }
    );
  }, [delay]);

  return (
    <div
      ref={cardRef}
      className={cn(
        "glass-card p-4 md:p-6 relative overflow-hidden group",
        className?.includes("flex") ? "flex" : "",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className={cn("relative z-10", className?.includes("flex") ? "flex-1 flex flex-col" : "")}>
        {children}
      </div>
    </div>
  );
}

