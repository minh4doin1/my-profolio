"use client";
import PostForm from "../PostForm";

export default function NewPostPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSave = async (postData: any) => {
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData),
    });
    return response;
  };

  return (
    <div className="p-8 text-white bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Create New Post</h1>
      <PostForm onSave={handleSave} />
    </div>
  );
}