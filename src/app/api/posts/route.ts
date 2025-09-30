import { NextRequest, NextResponse } from 'next/server'; // <-- THAY ĐỔI 1: Import NextRequest
import { supabase } from '@/lib/supabase';

export const revalidate = 60;

export async function GET() {
  try {
    const { data: posts, error } = await supabase
      .from('posts')
      .select('id, title, slug, created_at')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(posts);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest, // <-- THAY ĐỔI 2: Áp dụng cho cả PUT
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  try {
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

export async function DELETE(
  request: NextRequest, // <-- THAY ĐỔI 2: Áp dụng cho cả DELETE
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  try {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('slug', slug);

    if (error) throw error;
    return NextResponse.json({ message: 'Post deleted successfully' });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}