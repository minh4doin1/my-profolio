/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { supabase } from '@/lib/supabase';

export const revalidate = 0;

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('guestbook_entries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { message, relation_tag, answers } = body;

    if (!message || !relation_tag) {
      return NextResponse.json({ error: 'Message and tag are required' }, { status: 400 });
    }

    const newEntry = {
      user_name: session.user.name,
      user_image: session.user.image,
      user_email: session.user.email,
      message: message.slice(0, 500),
      relation_tag,
      answers,
    };

    const { data, error } = await supabase
      .from('guestbook_entries')
      .insert([newEntry])
      .select();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}