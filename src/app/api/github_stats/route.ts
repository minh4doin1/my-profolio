// src/app/api/github-stats/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const username = process.env.GITHUB_USERNAME;
  const token = process.env.GITHUB_TOKEN;

  if (!username || !token) {
    return NextResponse.json({ error: 'GitHub credentials not configured' }, { status: 500 });
  }

  try {
    // Lấy thông tin người dùng (followers, public repos)
    const userRes = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        Authorization: `token ${token}`,
      },
    });
    const userData = await userRes.json();

    // Lấy thông tin các repository (để đếm sao)
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, {
      headers: {
        Authorization: `token ${token}`,
      },
    });
    const reposData = await reposRes.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const totalStars = reposData.reduce((acc: number, repo: any) => acc + repo.stargazers_count, 0);

    const stats = {
      followers: userData.followers,
      publicRepos: userData.public_repos,
      stars: totalStars,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('GitHub API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch GitHub stats' }, { status: 500 });
  }
}