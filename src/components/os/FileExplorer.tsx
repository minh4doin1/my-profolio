"use client";
import { useState } from 'react';
import { projects, Project } from '@/data/projects';
import { Folder, ArrowLeft } from 'lucide-react';

const ProjectDetailView = ({ project, onBack }: { project: Project, onBack: () => void }) => (
  <div>
    <button onClick={onBack} className="flex items-center space-x-2 mb-4 hover:text-blue-400">
      <ArrowLeft size={18} />
      <span>Back to Projects</span>
    </button>
    <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
    <p className="mb-4">{project.longDescription}</p>
    <div className="flex flex-wrap gap-2">
      {project.tags.map(tag => (
        <span key={tag} className="bg-gray-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">{tag}</span>
      ))}
    </div>
  </div>
);

const FileExplorer = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  if (selectedProject) {
    return <ProjectDetailView project={selectedProject} onBack={() => setSelectedProject(null)} />;
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
      {projects.map(project => (
        <div
          key={project.slug}
          onClick={() => setSelectedProject(project)}
          className="flex flex-col items-center p-2 hover:bg-blue-500/20 rounded-md cursor-pointer"
        >
          <Folder size={48} className="text-yellow-400 mb-1" />
          <span className="text-white text-xs text-center break-words">{project.title}</span>
        </div>
      ))}
    </div>
  );
};

export default FileExplorer;