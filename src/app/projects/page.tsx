// src/app/projects/page.tsx
import { projects } from '@/data/projects';
import ProjectCard from '@/components/ProjectCard';

const ProjectsPage = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold text-center mb-12">Các Dự Án Của Tôi</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;