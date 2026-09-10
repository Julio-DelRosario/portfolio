"use client";

import { useRouter } from "next/navigation";
import { ProjectNavigator } from "./ProjectNavigator";
import { Project } from "@/data/projects";

import { ChevronLeft, ChevronRight } from "lucide-react";

export function ProjectDetailNavigator({
  projects,
  activeProjectId,
}: {
  projects: Project[];
  activeProjectId: string;
}) {
  const router = useRouter();
  const activeIndex = projects.findIndex((p) => p.id === activeProjectId);
  const safeIndex = activeIndex >= 0 ? activeIndex : 0;

  const handleProjectSelect = (index: number) => {
    const project = projects[index];
    if (project && project.id !== activeProjectId) {
      router.push(`/projects/${project.id}`);
    }
  };

  const handlePrev = () => {
    const prevIndex = (safeIndex - 1 + projects.length) % projects.length;
    handleProjectSelect(prevIndex);
  };

  const handleNext = () => {
    const nextIndex = (safeIndex + 1) % projects.length;
    handleProjectSelect(nextIndex);
  };

  return (
    <div className="mt-12 pt-12 border-t border-(--color-border-subtle) flex flex-col items-center">
      <div className="text-center mb-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-(--color-text-muted)">
          More Projects
        </h3>
      </div>
      
      <div className="flex items-center justify-center max-w-full gap-2 sm:gap-4 px-2">
        <button 
          onClick={handlePrev}
          className="p-2 sm:p-3 rounded-full bg-(--color-surface) border border-(--color-border-subtle) hover:bg-(--color-surface-hover) hover:border-(--color-accent) transition-colors text-(--color-text-secondary) hover:text-(--color-accent) shrink-0 z-10"
          aria-label="Previous project"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        
        <div className="overflow-hidden flex justify-center max-w-[calc(100vw-6rem)] sm:max-w-150">
          <ProjectNavigator 
            projects={projects} 
            activeIndex={safeIndex} 
            onProjectSelect={handleProjectSelect} 
          />
        </div>

        <button 
          onClick={handleNext}
          className="p-2 sm:p-3 rounded-full bg-(--color-surface) border border-(--color-border-subtle) hover:bg-(--color-surface-hover) hover:border-(--color-accent) transition-colors text-(--color-text-secondary) hover:text-(--color-accent) shrink-0"
          aria-label="Next project"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>
    </div>
  );
}

