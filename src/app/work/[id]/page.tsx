import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getPortfolioData, getSocialLinks } from "@/lib/db";
import { INITIAL_PORTFOLIO_DATA } from "@/data/portfolio";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CaseStudyHero } from "@/components/case-study/CaseStudyHero";
import { CaseStudyOverview } from "@/components/case-study/CaseStudyOverview";
import { VisualSystem } from "@/components/case-study/VisualSystem";
import { MockupGallery } from "@/components/case-study/MockupGallery";
import { ProjectNav } from "@/components/case-study/ProjectNav";
import { PageTransition } from "@/components/layout/PageTransition";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const data = getPortfolioData();
  return data.projects.map((project) => ({
    id: project.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const data = getPortfolioData();
  const project = data.projects.find((p) => p.slug === id);

  if (!project) {
    return {
      title: `Project Not Found — ${data.personal.name}`,
    };
  }

  return {
    title: `${project.title} — ${data.personal.name}`,
    description: project.shortDescription,
    openGraph: {
      title: `${project.title} — ${data.personal.name}`,
      description: project.shortDescription,
      images: [{ url: project.coverImage }],
    },
  };
}

export default async function ProjectCaseStudyPage({ params }: Props) {
  const { id } = await params;
  const data = getPortfolioData();
  const socialLinks = getSocialLinks();
  const projects = data.projects;
  const currentIndex = projects.findIndex((p) => p.slug === id);

  if (currentIndex === -1) {
    notFound();
  }

  const project = projects[currentIndex];
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0B0B0C] text-[#F5F5F2] selection:bg-white/20 selection:text-white">
        <Navbar data={data.personal} />

        <main className="relative z-10">
          <CaseStudyHero project={project as any} />
          <CaseStudyOverview project={project as any} />
          <VisualSystem project={project as any} />
          <MockupGallery project={project as any} />
          <ProjectNav prevProject={prevProject as any} nextProject={nextProject as any} />
        </main>

        <Footer data={data.personal} socialLinks={socialLinks} />
      </div>
    </PageTransition>
  );
}
