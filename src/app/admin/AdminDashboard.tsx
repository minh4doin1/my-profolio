"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Loader2, PlusCircle, Edit, Trash2 } from 'lucide-react';

type Post = {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  created_at: string;
};

const AdminDashboard = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    // Gọi đến một API route mới để lấy TẤT CẢ bài viết (kể cả bản nháp)
    const res = await fetch('/api/posts/all'); 
    const data = await res.json();
    setPosts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (slug: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      await fetch(`/api/posts/${slug}`, { method: 'DELETE' });
      // Tải lại danh sách sau khi xóa
      fetchPosts();
    }
  };

  if (loading) {
    return <div className="p-8 text-white"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="p-8 text-white bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Link href="/admin/new" className="flex items-center space-x-2 px-4 py-2 bg-green-600 rounded hover:bg-green-700">
          <PlusCircle size={20} />
          <span>New Post</span>
        </Link>
      </div>
      
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Status</th>
              <th className="p-4">Created At</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post.id} className="border-t border-gray-700">
                <td className="p-4">{post.title}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${post.published ? 'bg-green-500' : 'bg-yellow-500'}`}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="p-4">{new Date(post.created_at).toLocaleDateString()}</td>
                <td className="p-4 flex space-x-2">
                  <Link href={`/admin/edit/${post.slug}`} className="p-2 hover:bg-gray-600 rounded"><Edit size={18} /></Link>
                  <button onClick={() => handleDelete(post.slug)} className="p-2 hover:bg-red-600 rounded"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;