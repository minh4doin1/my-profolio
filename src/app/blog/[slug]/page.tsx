import MaximizedWindowLayout from '@/components/os/MaximizedWindowLayout';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';

async function getPost(slug: string) {
  const decodedSlug = decodeURIComponent(slug).trim();
  
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', decodedSlug) // Sử dụng slug đã được làm sạch
    .eq('published', true)
    .single();
  return data;
}

export default async function PostPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <MaximizedWindowLayout windowId="blog" title={post.title}>
      <article className="prose prose-invert max-w-none">
        {post.cover_image_url && (
          <div className="relative w-full h-64 md:h-96 mb-8">
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-lg"
              priority
            />
          </div>
        )}
        <h1>{post.title}</h1>
        <p className="text-gray-400">
          Published on: {new Date(post.created_at).toLocaleDateString()}
        </p>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.content}
        </ReactMarkdown>
      </article>
    </MaximizedWindowLayout>
  );
}