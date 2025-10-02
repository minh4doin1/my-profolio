"use client";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import PostForm from '../../PostForm';
import { Loader2 } from 'lucide-react';

type PostData = {
  title: string;
  slug: string;
  content: string;
  cover_image_url: string;
  published: boolean;
};

export default function EditPostPage() {
  const params = useParams();
  const slug = params?.slug as string; 
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const fetchPost = async () => {
      const res = await fetch(`/api/blog/${slug}?all=true`); 
      if (res.ok) {
        const data = await res.json();
        setPost(data);
      }
      setLoading(false);
    };
    fetchPost();
  }, [slug]);

  const handleSave = async (postData: PostData) => {
    const response = await fetch(`/api/blog/${slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData),
    });
    return response;
  };

  if (loading) return <div className="p-8 text-white"><Loader2 className="animate-spin" /></div>;
  if (!post) return <div className="p-8 text-white">Post not found or you dont have permission to edit it.</div>;

  return (
    <div className="p-8 text-white bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Edit Post</h1>
      <PostForm onSave={handleSave} initialData={post} />
    </div>
  );
}