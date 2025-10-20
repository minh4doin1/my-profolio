import Image from 'next/image';
import Link from 'next/link';
import { Project } from '@/data/projects'; // Import đúng type Project
import { ArrowRight } from 'lucide-react';

type ProjectCardProps = {
  project: Project;
};

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <Link 
      href={`/projects/${project.slug}`}
      className="group block bg-gray-800/50 rounded-lg overflow-hidden shadow-lg hover:shadow-blue-500/30 transition-all duration-300 border border-transparent hover:border-blue-500/50"
    >
      <div className="relative w-full h-48">
        {/* SỬA LỖI: Dùng project.coverImage */}
        <Image
          src={project.coverImage}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
        {/* SỬA LỖI: Dùng project.summary */}
        <p className="text-gray-400 text-sm mb-4 h-20 overflow-hidden">
          {project.summary}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.slice(0, 3).map(tag => ( // Chỉ hiển thị 3 tag đầu
            <span key={tag} className="bg-gray-700 text-xs font-semibold px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center text-blue-400 font-semibold group-hover:underline">
          Xem chi tiết
          <ArrowRight size={16} className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;