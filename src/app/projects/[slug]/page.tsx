// File này là một Server Component theo mặc định.

import { notFound } from 'next/navigation';
import { projects } from '@/data/projects';
import ProjectClientView from './ProjectClientView';

// SỬA LỖI 1: Thêm hàm generateStaticParams
// Hàm này sẽ chạy lúc build, cung cấp danh sách tất cả các slug cho Next.js
export async function generateStaticParams() {
  // Lấy tất cả các project và map qua chúng để trả về một mảng các object params
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

// Định nghĩa kiểu props cho Server Component (không thay đổi)
type PageProps = {
  params: {
    slug: string;
  };
};

// Component Page không thay đổi, nó vẫn nhận params và tìm project
export default function ProjectPage({ params }: PageProps) {
  const slug = params.slug;
  const project = projects.find(p => p.slug === slug);

  if (!project) {
    notFound();
  }

  // Trả về Client Component với dữ liệu đã được chuẩn bị sẵn
  return <ProjectClientView project={project} />;
}