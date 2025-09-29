import MaximizedWindowLayout from '@/components/os/MaximizedWindowLayout';
import BlogApp from '@/components/os/apps/BlogApp';

export default function BlogIndexPage() {
  return (
    <MaximizedWindowLayout windowId="blog" title="Code.log">
      <BlogApp />
    </MaximizedWindowLayout>
  );
}