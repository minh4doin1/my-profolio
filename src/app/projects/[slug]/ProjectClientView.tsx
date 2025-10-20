"use client"; // Đánh dấu đây là Client Component

import { useRouter } from 'next/navigation';
import { Project } from '@/data/projects'; // Import type Project
import { ProjectDetailView } from '@/components/os/FileExplorer';
import MaximizedWindowLayout from '@/components/os/MaximizedWindowLayout';

// Định nghĩa props mà component này sẽ nhận từ Server Component cha
type ProjectClientViewProps = {
  project: Project;
};

export default function ProjectClientView({ project }: ProjectClientViewProps) {
  const router = useRouter();

  return (
    <MaximizedWindowLayout windowId="projects" title={project.title}>
      <ProjectDetailView 
        project={project} 
        onBack={() => router.push('/')} 
      />
    </MaximizedWindowLayout>
  );
}