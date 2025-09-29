"use client";
import { useState, useEffect } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

type Post = {
  id: string;
  title: string;
  slug: string;
  created_at: string;
};

const PostItem = ({ post }: { post: Post }) => (
  <Link href={`/blog/${post.slug}`} className="block border-b border-gray-700 py-4 hover:bg-gray-700/50 px-2 rounded-md transition-colors">
    <h3 className="text-xl font-bold text-blue-400">{post.title}</h3>
    <p className="text-sm text-gray-400 mt-1">
      Published on: {new Date(post.created_at).toLocaleDateString()}
    </p>
  </Link>
);

const BlogApp = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/posts');
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin" size={32} />
        <span className="ml-2">Loading posts...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-400">
        <AlertTriangle className="mr-2" size={32} />
        <span>Error: {error}</span>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 border-b-2 border-blue-500 pb-2">Code.log</h2>
      <div className="space-y-4">
        {posts.length > 0 ? (
          posts.map(post => <PostItem key={post.id} post={post} />)
        ) : (
          <p>No posts found. Check back later!</p>
        )}
      </div>
    </div>
  );
};

export default BlogApp;