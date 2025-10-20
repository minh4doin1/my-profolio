import { projects, Project, ContentBlock } from '@/data/projects';
import { notFound } from 'next/navigation';
import MaximizedWindowLayout from '@/components/os/MaximizedWindowLayout';
import Image from 'next/image';
import { ExternalLink, Github } from 'lucide-react';

// Helper component để render các khối nội dung (tương tự như trong FileExplorer)
const ContentRenderer = ({ block }: { block: ContentBlock }) => {
  switch (block.type) {
    case 'heading':
      if (block.level === 2) {
        return <h2 className="text-2xl font-bold mt-6 mb-3 text-blue-300">{block.content}</h2>;
      }
      return <h3 className="text-xl font-bold mt-5 mb-2 text-blue-300">{block.content}</h3>;
    case 'paragraph':
      return <p className="text-gray-300 leading-relaxed mb-4">{block.content}</p>;
    case 'image':
      return (
        <div className="my-6">
          <Image
            src={block.src}
            alt={block.alt}
            width={800}
            height={450}
            className="rounded-lg object-cover w-full"
          />
          {block.caption && <p className="text-center text-sm text-gray-500 mt-2 italic">{block.caption}</p>}
        </div>
      );
    case 'list':
      return (
        <ul className="list-disc list-inside space-y-2 mb-4 pl-4">
          {block.items.map((item: string, index: number) => (
            <li key={index} className="text-gray-300">{item}</li>
          ))}
        </ul>
      );
    default:
      return null;
  }
};

// Lấy dữ liệu dự án từ mảng data (vì đây là static site)
async function getProject(slug: string): Promise<Project | undefined> {
  return projects.find(p => p.slug === slug);
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = await getProject(params.slug);

  if (!project) {
    notFound();
  }

  return (
    <MaximizedWindowLayout windowId="projects" title={project.title}>
      <div className="prose prose-invert max-w-none">
        {/* Tiêu đề và ảnh bìa */}
        <h1 className="text-4xl font-extrabold text-white mb-4">{project.title}</h1>
        <div className="relative w-full h-64 md:h-80 mb-6">
          <Image src={project.coverImage} alt={project.title} fill className="object-cover rounded-lg" priority />
        </div>

        {/* Các liên kết */}
        <div className="flex flex-wrap gap-4 mb-8">
          {project.links.live && (
            <a href={project.links.live} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors no-underline text-white">
              <ExternalLink size={18} />
              <span>Xem trực tiếp</span>
            </a>
          )}
          {project.links.repo && (
            <a href={project.links.repo} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors no-underline text-white">
              <Github size={18} />
              <span>Mã nguồn</span>
            </a>
          )}
        </div>

        {/* Thông tin meta và tags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-4 bg-gray-800/50 rounded-lg">
          <div>
            <h3 className="font-bold text-lg mb-3 text-gray-400 uppercase tracking-wider">Thông tin</h3>
            <div className="space-y-2">
              {Object.entries(project.metadata).map(([key, value]: [string, string]) => (
                <div key={key}>
                  <span className="font-semibold text-gray-300">{key}:</span>
                  <span className="ml-2 text-gray-400">{value}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-3 text-gray-400 uppercase tracking-wider">Công nghệ</h3>
            <div className="flex flex-wrap gap-2">
              {project.tags.map(tag => (
                <span key={tag} className="bg-gray-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Render nội dung chi tiết */}
        <article>
          {project.content.map((block: ContentBlock, index: number) => (
            <ContentRenderer key={index} block={block} />
          ))}
        </article>
      </div>
    </MaximizedWindowLayout>
  );
}