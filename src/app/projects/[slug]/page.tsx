// src/app/projects/[slug]/page.tsx
import { projects } from '@/data/projects';
import Image from 'next/image';
import Link from 'next/link';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

// Hàm này tạo sẵn các trang tĩnh lúc build, giúp tăng tốc độ tải trang
export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

// Hàm này nhận slug từ URL và tìm dự án tương ứng
const getProject = (slug: string) => {
  const project = projects.find((p) => p.slug === slug);
  return project;
};

type ProjectPageProps = {
  params: {
    slug: string;
  };
};

const ProjectPage = ({ params }: ProjectPageProps) => {
  const project = getProject(params.slug);

  if (!project) {
    // Nếu không tìm thấy project, có thể hiển thị trang 404
    // Next.js sẽ tự xử lý việc này nếu không tìm thấy trong generateStaticParams
    return <div>Project not found</div>;
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
      
      <div className="relative w-full h-96 mb-8">
        <Image
          src={project.imageUrl}
          alt={project.title}
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
        />
      </div>

      <div className="prose max-w-none">
        <p>{project.longDescription}</p>
      </div>
      
      <div className="mt-8">
        <h3 className="text-2xl font-semibold mb-4">Công nghệ sử dụng</h3>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span key={tag} className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-8 flex space-x-4">
        {project.sourceUrl && (
          <Link href={project.sourceUrl} target="_blank" className="flex items-center space-x-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors">
            <FaGithub />
            <span>Mã nguồn</span>
          </Link>
        )}
        {project.liveUrl && project.liveUrl !== '#' && (
          <Link href={project.liveUrl} target="_blank" className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <FaExternalLinkAlt />
            <span>Xem trực tiếp</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default ProjectPage;