import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const revalidate = 60;

// Lấy TẤT CẢ bài viết đã published
export async function GET() {
  try {
    const { data: posts, error } = await supabase
      .from('posts')
      .select('id, title, slug, created_at')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(posts);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Tạo một bài viết MỚI
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, slug, content, cover_image_url, published } = body;

    if (!title || !slug || !content) {
      return NextResponse.json({ message: 'Title, slug, and content are required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('posts')
      .insert([{ title, slug, content, cover_image_url, published }])
      .select();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ message: 'Slug already exists.' }, { status: 409 });
      }
      throw error;
    }

    return NextResponse.json(data, { status: 201 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error creating post:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}