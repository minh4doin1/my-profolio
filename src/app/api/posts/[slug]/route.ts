import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const revalidate = 60;

export async function GET(request: NextRequest) {
  try {
    const slug = request.nextUrl.pathname.split('/').pop();

    if (!slug) {
      return NextResponse.json({ error: 'Slug is missing' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get('all') === 'true';

    let query = supabase
      .from('posts')
      .select('*')
      .eq('slug', slug);
    
    if (!showAll) {
      query = query.eq('published', true);
    }

    const { data: post, error } = await query.single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error fetching post:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}