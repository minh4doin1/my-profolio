"use client";
import { useState, useMemo } from "react";
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import "easymde/dist/easymde.min.css";
import { Options } from "easymde";
import Image from 'next/image';

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), { ssr: false });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PostForm({ onSave, initialData }: { onSave: (data: any) => Promise<Response>, initialData?: any }) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [coverImageUrl, setCoverImageUrl] = useState(initialData?.cover_image_url || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [published, setPublished] = useState(initialData?.published || false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    const response = await onSave({ title, slug, content, cover_image_url: coverImageUrl, published });

    if (response.ok) {
      setMessage('Success!');
      router.push('/admin');
      router.refresh();
    } else {
      const error = await response.json();
      setMessage(`Error: ${error.message}`);
    }
    setIsSubmitting(false);
  };

  // Cấu hình các nút trên thanh công cụ của trình soạn thảo
   const editorOptions = useMemo((): Options => {
    return {
      spellChecker: false,
      toolbar: [
        "bold", "italic", "heading", "|", 
        "quote", "unordered-list", "ordered-list", "|",
        "link", "image", "|",
        "preview", "side-by-side", "fullscreen", "|",
        "guide"
      ],
    } as const;
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-4xl">
      <div>
        <label htmlFor="title">Title</label>
        <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full p-2 bg-gray-800 rounded"/>
      </div>
      <div>
        <label htmlFor="slug">Slug</label>
        <input id="slug" type="text" value={slug} onChange={(e) => setSlug(e.target.value)} required className="w-full p-2 bg-gray-800 rounded"/>
      </div>
      <div>
        <label htmlFor="coverImageUrl">Cover Image URL</label>
        <input id="coverImageUrl" type="text" value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)} className="w-full p-2 bg-gray-800 rounded"/>
        
        {coverImageUrl && (
          <div className="mt-4 p-2 border border-dashed border-gray-600 rounded-lg">
            <p className="text-sm text-gray-400 mb-2">Image Preview:</p>
            <div className="relative w-full h-64">
              <Image
                src={coverImageUrl}
                alt="Cover image preview"
                layout="fill"
                objectFit="contain"
                className="rounded"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
          </div>
        )}
      </div>
      <div>
        <label htmlFor="content">Content (Markdown)</label>
        <SimpleMDE 
          id="content" 
          value={content} 
          onChange={setContent}
          options={editorOptions}
        />
      </div>
      <div className="flex items-center space-x-2">
        <input id="published" type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="h-4 w-4"/>
        <label htmlFor="published">Publish</label>
      </div>
      <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 disabled:bg-gray-500">
        {isSubmitting ? 'Saving...' : 'Save Post'}
      </button>
      {message && <p className="mt-4">{message}</p>}
    </form>
  );
}