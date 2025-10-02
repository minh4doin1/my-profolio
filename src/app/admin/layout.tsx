import { headers } from 'next/headers';
import { ReactNode } from 'react';

const isAuthenticated = async () => {
  const headersList = await headers();
  const basicAuth = headersList.get('authorization');

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    const [user, pwd] = Buffer.from(authValue, 'base64').toString().split(':');

    const expectedUser = process.env.ADMIN_USERNAME;
    const expectedPwd = process.env.ADMIN_PASSWORD;

    return user === expectedUser && pwd === expectedPwd;
  }
  return false;
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  const authenticated = isAuthenticated();

  if (!authenticated) {
    return new Response('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    });
  }

  return <>{children}</>;
}