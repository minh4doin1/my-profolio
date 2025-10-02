import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const revalidate = 60;

// Lấy danh sách bài viết đã published
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('id, title, slug, created_at, cover_image_url')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Tạo bài viết mới
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { data, error } = await supabase.from('posts').insert([body]).select();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}