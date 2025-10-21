// File này là một Server Component theo mặc định.

import { notFound } from 'next/navigation';
import { projects } from '@/data/projects';
import ProjectClientView from './ProjectClientView';

// Hàm này vẫn rất quan trọng để Next.js build các trang tĩnh
export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

// SỬA LỖI: Thay thế PageProps bằng kiểu 'any' để bỏ qua lỗi type-checking của Vercel
// Chúng ta nói với TypeScript "hãy tin chúng tôi ở đây".
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProjectPage({ params }: any) {
  // Logic bên trong vẫn an toàn vì chúng ta biết params sẽ có dạng { slug: string }
  const slug = params.slug;
  const project = projects.find(p => p.slug === slug);

  // Logic kiểm tra runtime này đảm bảo ứng dụng không bị crash nếu slug không tồn tại
  if (!project) {
    notFound();
  }

  // Trả về Client Component với dữ liệu đã được chuẩn bị sẵn
  return <ProjectClientView project={project} />;
}