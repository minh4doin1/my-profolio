import { NextResponse } from 'next/server';
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