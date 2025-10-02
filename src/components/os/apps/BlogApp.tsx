"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Loader2, AlertTriangle } from 'lucide-react';

type Post = { id: string; title: string; slug: string; created_at: string; };

const BlogApp = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/blog');
        if (!res.ok) throw new Error('Failed to fetch posts');
        const data = await res.json();
        setPosts(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin" /></div>;
  if (error) return <div className="flex justify-center items-center h-full text-red-400"><AlertTriangle /> {error}</div>;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 border-b-2 border-blue-500 pb-2">Code.log</h2>
      <div className="space-y-2">
        {posts.map(post => (
          // --- SỬA LỖI Ở ĐÂY ---
          // Sử dụng post.slug.trim() để loại bỏ khoảng trắng thừa trước khi tạo URL
          <Link key={post.id} href={`/blog/${post.slug.trim()}`} className="block p-4 rounded-lg hover:bg-gray-700/50 transition-colors">
            <h3 className="text-xl font-bold text-blue-400">{post.title}</h3>
            <p className="text-sm text-gray-400 mt-1">
              {new Date(post.created_at).toLocaleDateString()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BlogApp;