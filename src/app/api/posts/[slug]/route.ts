import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const revalidate = 60;

// Lấy MỘT bài viết theo slug
export async function GET(request: NextRequest) {
  try {
    const slug = request.nextUrl.pathname.split('/').pop();
    if (!slug) return NextResponse.json({ error: 'Slug is missing' }, { status: 400 });

    const { searchParams } = request.nextUrl;
    const showAll = searchParams.get('all') === 'true';

    let query = supabase.from('posts').select('*').eq('slug', slug);
    if (!showAll) {
      query = query.eq('published', true);
    }

    const { data: post, error } = await query.single();

    if (error && error.code !== 'PGRST116') throw error;
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    return NextResponse.json(post);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Cập nhật MỘT bài viết theo slug
export async function PUT(request: NextRequest) {
  try {
    const slug = request.nextUrl.pathname.split('/').pop();
    if (!slug) return NextResponse.json({ error: 'Slug is missing' }, { status: 400 });

    const body = await request.json();
    const { title, content, cover_image_url, published, slug: newSlug } = body;

    const { data, error } = await supabase
      .from('posts')
      .update({ title, content, cover_image_url, published, slug: newSlug, updated_at: new Date().toISOString() })
      .eq('slug', slug)
      .select();

    if (error) throw error;
    return NextResponse.json(data);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Xóa MỘT bài viết theo slug
export async function DELETE(request: NextRequest) {
  try {
    const slug = request.nextUrl.pathname.split('/').pop();
    if (!slug) return NextResponse.json({ error: 'Slug is missing' }, { status: 400 });

    const { error } = await supabase.from('posts').delete().eq('slug', slug);

    if (error) throw error;
    return NextResponse.json({ message: 'Post deleted successfully' });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}