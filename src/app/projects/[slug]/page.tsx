// File này không có "use client", nó là một Server Component theo mặc định
import { notFound } from 'next/navigation';
import { projects } from '@/data/projects';
import ProjectClientView from './ProjectClientView'; // Import Client Component vừa tạo

// Định nghĩa kiểu props cho Server Component
type PageProps = {
  params: {
    slug: string;
  };
};

// Đây là một Server Component, có thể là async (mặc dù ở đây không cần)
export default function ProjectPage({ params }: PageProps) {
  const slug = params.slug;
  const project = projects.find(p => p.slug === slug);

  // Xử lý logic dữ liệu ở phía server
  if (!project) {
    notFound();
  }

  // Trả về Client Component với dữ liệu đã được chuẩn bị sẵn
  return <ProjectClientView project={project} />;
}