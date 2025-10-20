"use client"; // Dùng client component để có thể sử dụng hooks và component ProjectDetailView

import { useParams, useRouter, notFound } from 'next/navigation';
import { projects } from '@/data/projects';
import { ProjectDetailView } from '@/components/os/FileExplorer';
import MaximizedWindowLayout from '@/components/os/MaximizedWindowLayout';

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  // Tìm dự án tương ứng với slug
  const project = projects.find(p => p.slug === slug);

  // Nếu không tìm thấy dự án, hiển thị trang 404
  if (!project) {
    notFound();
  }

  return (
    <MaximizedWindowLayout windowId="projects" title={project.title}>
      {/* Tái sử dụng component ProjectDetailView */}
      <ProjectDetailView project={project} onBack={() => router.push('/')} />
    </MaximizedWindowLayout>
  );
}