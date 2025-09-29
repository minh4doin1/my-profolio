// src/components/os/apps/GitHubStats.tsx
"use client";
import { useState, useEffect } from 'react';
import { Star, Users, GitBranch } from 'lucide-react';

type Stats = {
  followers: number;
  publicRepos: number;
  stars: number;
};

const StatCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: number | string }) => (
  <div className="bg-gray-700/50 p-4 rounded-lg flex items-center space-x-4">
    <div className="text-blue-400">{icon}</div>
    <div>
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

const GitHubStats = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/github-stats');
        if (!res.ok) {
          throw new Error('Failed to fetch stats');
        }
        const data = await res.json();
        setStats(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center">Loading GitHub Stats...</div>;
  }

  if (error) {
    return <div className="text-center text-red-400">Error: {error}</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My GitHub Stats</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={<Users size={32} />} label="Followers" value={stats?.followers ?? 'N/A'} />
        <StatCard icon={<Star size={32} />} label="Total Stars" value={stats?.stars ?? 'N/A'} />
        <StatCard icon={<GitBranch size={32} />} label="Public Repos" value={stats?.publicRepos ?? 'N/A'} />
      </div>
      <p className="text-xs text-gray-500 mt-4">
        Data fetched in real-time from the GitHub API.
      </p>
    </div>
  );
};

export default GitHubStats;