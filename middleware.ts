import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: '/admin/:path*', // Chỉ chạy middleware cho các đường dẫn /admin
};

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get('authorization');

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    const [user, pwd] = Buffer.from(authValue, 'base64').toString().split(':');

    const expectedUser = process.env.ADMIN_USERNAME;
    const expectedPwd = process.env.ADMIN_PASSWORD;

    if (user === expectedUser && pwd === expectedPwd) {
      // Nếu đúng, cho phép truy cập
      return NextResponse.next();
    }
  }

  // Nếu không có thông tin xác thực hoặc sai, trả về lỗi 401
  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  });
}