import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PROJECTS } from "@/data/projects";
import { PageContainer } from "@/components/layout/page-container";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { ProjectGallery } from "@/components/projects/ProjectGallery";
import { GithubIcon } from "@/components/icons/CustomIcons";
import { ExternalLink, ArrowLeft, CheckCircle2 } from "lucide-react";
import { ProjectDetailNavigator } from "@/components/projects/ProjectDetailNavigator";

export function generateStaticParams() {
  return PROJECTS.map((project) => ({
    id: project.id,
  }));
}

function ProjectLinkIcon({ type }: { type: string }) {
  if (type === "github") return <GithubIcon className="w-4 h-4" />;
  return <ExternalLink className="w-4 h-4" />;
}

export default async function ProjectPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const project = PROJECTS.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen pt-16 pb-16">
      <ScrollToTop />
      <PageContainer>
        {/* Navigation */}
        <div className="mb-8">
          <Link
            href="/#projects"
            className="inline-flex items-center text-sm font-medium text-(--color-text-secondary) hover:text-(--color-accent) transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Back to Portfolio
          </Link>
        </div>

        {/* Header */}
        <header className="mb-10 max-w-4xl">
          <div className="flex items-center gap-4 mb-4">
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-(--color-surface-hover) text-(--color-text-secondary) border border-(--color-border)">
              {project.status}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4 text-(--color-text)">
            {project.title}
          </h1>
          {project.subtitle && (
            <h2 className="text-xl sm:text-2xl text-(--color-text-secondary) mb-6 font-medium">
              {project.subtitle}
            </h2>
          )}
          <p className="text-lg sm:text-xl text-(--color-text-secondary) leading-relaxed max-w-3xl">
            {project.description}
          </p>
        </header>

        {/* Project Gallery */}
        {(() => {
          const allImages = [project.imageUrl, ...(project.galleryImages || [])].filter((url): url is string => Boolean(url));
          if (allImages.length === 0) return null;
          return <ProjectGallery images={allImages} title={project.title} />;
        })()}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {project.overview && (
              <section>
                <h3 className="text-xl font-bold mb-4 text-(--color-text)">Project Details</h3>
                <p className="text-(--color-text-secondary) leading-relaxed">
                  {project.overview}
                </p>
              </section>
            )}

            {project.contributions && project.contributions.length > 0 && (
              <section>
                <h3 className="text-xl font-bold mb-4 text-(--color-text)">My Contributions</h3>
                <ul className="space-y-3">
                  {project.contributions.map((contribution, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="mr-4 mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-(--color-accent) opacity-70" />
                      <span className="text-(--color-text-secondary) leading-relaxed">{contribution}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {project.achievements && project.achievements.length > 0 && (
              <section>
                <h3 className="text-xl font-bold mb-4 text-(--color-text)">Key Achievements</h3>
                <ul className="space-y-3">
                  {project.achievements.map((achievement, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 mr-4 mt-0.5 shrink-0 text-(--color-accent) opacity-80" />
                      <span className="text-(--color-text-secondary) leading-relaxed font-medium">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            <section>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-(--color-text-muted) mb-3">Role</h3>
              <p className="text-(--color-text) font-medium">{project.role}</p>
            </section>

            <section>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-(--color-text-muted) mb-3">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span 
                    key={tech}
                    className="px-3 py-1.5 bg-(--color-surface-hover) border border-(--color-border-subtle) text-(--color-text-secondary) text-sm rounded-md"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </section>

            {project.links.length > 0 && (
              <section>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-(--color-text-muted) mb-3">Links</h3>
                <div className="flex flex-col gap-3">
                  {project.links.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between px-4 py-3 bg-(--color-surface) border border-(--color-border) rounded-lg hover:bg-(--color-surface-hover) hover:border-(--color-border-hover) transition-all"
                    >
                      <span className="font-medium text-(--color-text)">{link.label}</span>
                      <ProjectLinkIcon type={link.type} />
                    </a>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        <ProjectDetailNavigator projects={PROJECTS} activeProjectId={project.id} />
      </PageContainer>

    </main>
  );
}

