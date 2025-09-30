import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const expectedUser = process.env.ADMIN_USERNAME;
    const expectedPwd = process.env.ADMIN_PASSWORD;

    if (username === expectedUser && password === expectedPwd) {
      // Nếu đúng, trả về một token giả lập
      return NextResponse.json({ success: true, token: 'secret-admin-token' });
    } else {
      // Nếu sai, trả về lỗi
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: 'An error occurred' }, { status: 500 });
  }
}