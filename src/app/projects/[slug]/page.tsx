"use client"; // Vẫn là client component vì chúng ta cần useRouter

// Bỏ useParams, vì chúng ta sẽ nhận params qua props
import { useRouter, notFound } from 'next/navigation'; 
import { projects } from '@/data/projects';
import { ProjectDetailView } from '@/components/os/FileExplorer';
import MaximizedWindowLayout from '@/components/os/MaximizedWindowLayout';

// SỬA LỖI 1: Định nghĩa kiểu cho props mà trang sẽ nhận
type PageProps = {
  params: {
    slug: string;
  };
};

// SỬA LỖI 2: Component giờ đây chấp nhận props theo đúng chuẩn của Next.js
export default function ProjectPage({ params }: PageProps) {
  const router = useRouter();
  // SỬA LỖI 3: Lấy slug trực tiếp từ props, không cần dùng hook
  const slug = params.slug;

  // Tìm dự án tương ứng với slug
  const project = projects.find(p => p.slug === slug);

  // Nếu không tìm thấy dự án, hiển thị trang 404
  if (!project) {
    notFound();
  }

  return (
    <MaximizedWindowLayout windowId="projects" title={project.title}>
      <ProjectDetailView 
        project={project} 
        onBack={() => router.push('/')} 
      />
    </MaximizedWindowLayout>
  );
}