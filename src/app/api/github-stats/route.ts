import { NextResponse } from 'next/server';

export const revalidate = 3600;

export async function GET() {
  const username = process.env.GITHUB_USERNAME;
  const token = process.env.GITHUB_TOKEN;

  if (!username || !token) {
    return NextResponse.json({ error: 'GitHub credentials not configured' }, { status: 500 });
  }

  try {
    const userRes = await fetch(`https://api.github.com/users/${username}`, {
      headers: { Authorization: `token ${token}` },
      next: { revalidate: 3600 } // Cache fetch request
    });
    if (!userRes.ok) throw new Error('Failed to fetch user data');
    const userData = await userRes.json();

    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, {
      headers: { Authorization: `token ${token}` },
      next: { revalidate: 3600 }
    });
    if (!reposRes.ok) throw new Error('Failed to fetch repos data');
    const reposData = await reposRes.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const totalStars = reposData.reduce((acc: number, repo: any) => acc + repo.stargazers_count, 0);

    return NextResponse.json({
      followers: userData.followers,
      publicRepos: userData.public_repos,
      stars: totalStars,
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch GitHub stats' }, { status: 500 });
  }
}