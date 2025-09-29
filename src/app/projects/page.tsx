import MaximizedWindowLayout from '@/components/os/MaximizedWindowLayout';
import FileExplorer from '@/components/os/FileExplorer';

export default function ProjectsPage() {
  return (
    <MaximizedWindowLayout windowId="projects" title="Projects.exe">
      <FileExplorer />
    </MaximizedWindowLayout>
  );
}