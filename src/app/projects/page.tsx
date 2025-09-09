import MaximizedWindowLayout from '@/components/os/MaximizedWindowLayout';
import FileExplorer from '@/components/os/FileExplorer';
import Taskbar from '@/components/os/Taskbar';

export default function ProjectsPage() {
  return (
    <div className="w-full h-full flex flex-col">
      <main className="flex-grow">
        <MaximizedWindowLayout windowId="projects" title="Projects.exe">
          <FileExplorer />
        </MaximizedWindowLayout>
      </main>
      <footer className="flex-shrink-0">
        <Taskbar apps={{}} openWindows={[]} minimizedWindows={[]} onTaskbarClick={() => {}} onStartMenuClick={() => {}} activeWindowId={null} />
      </footer>
    </div>
  );
}