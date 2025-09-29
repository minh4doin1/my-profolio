"use client";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import MaximizedWindowLayout from '@/components/os/MaximizedWindowLayout';
import { Loader2, AlertTriangle } from 'lucide-react';

type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  created_at: string;
};

const PostPage = () => {
  const params = useParams();
  const slug = params.slug as string;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${slug}`);
        if (!res.ok) {
          throw new Error(`Post not found or failed to load (status: ${res.status})`);
        }
        const data = await res.json();
        setPost(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const renderContent = () => {
    if (loading) {
      return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin" size={32} /></div>;
    }
    if (error) {
      return <div className="flex items-center justify-center h-full text-red-400"><AlertTriangle className="mr-2" /> {error}</div>;
    }
    if (post) {
      return (
        <article className="prose prose-invert max-w-none">
          <h1>{post.title}</h1>
          <p className="text-gray-400">Published on: {new Date(post.created_at).toLocaleDateString()}</p>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </article>
      );
    }
    return null;
  };

  return (
    <MaximizedWindowLayout windowId="blog" title={post?.title || 'Code.log'}>
      {renderContent()}
    </MaximizedWindowLayout>
  );
};

export default PostPage;