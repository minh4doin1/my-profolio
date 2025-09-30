"use client";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import PostForm from '../../PostForm';
import { Loader2 } from 'lucide-react';

export default function EditPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const fetchPost = async () => {
      const res = await fetch(`/api/posts/${slug}?all=true`); // Lấy cả bản nháp
      const data = await res.json();
      setPost(data);
      setLoading(false);
    };
    fetchPost();
  }, [slug]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSave = async (postData: any) => {
    const response = await fetch(`/api/posts/${slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData),
    });
    return response;
  };

  if (loading) {
    return <div className="p-8 text-white"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="p-8 text-white bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Edit Post</h1>
      {post && <PostForm onSave={handleSave} initialData={post} />}
    </div>
  );
}