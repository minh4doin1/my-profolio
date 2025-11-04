// src/data/apps.tsx
import { AppData } from '@/store/useDesktopStore';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

import AboutContent from '@/components/os/apps/AboutApp';
import BlogApp from '@/components/os/apps/BlogApp';
import GuestbookApp from '@/components/os/apps/GuestbookApp';
import FileExplorer from '@/components/os/FileExplorer';
import PdfViewer from '@/components/os/apps/PdfViewer';

// Hàm getApps giờ đây sử dụng AppData được import
export const getApps = (isMobile: boolean, router: AppRouterInstance): Record<string, AppData> => ({
  about: {
    id: 'about',
    title: 'About Me',
    content: <AboutContent />,
    pageUrl: '/about',
    description: 'Đây là nơi bạn có thể tìm hiểu thông tin về tôi, kỹ năng và mục tiêu nghề nghiệp.',
  },
  projects: {
    id: 'projects',
    title: 'Projects',
    content: <FileExplorer />,
    pageUrl: '/projects',
    description: 'Khám phá các dự án tôi đã thực hiện, với các bài viết chi tiết về công nghệ và quá trình phát triển.',
  },
  conquest: {
    id: 'conquest',
    title: 'Project Conquest',
    action: () => router.push('/apps/conquest'),
    description: 'A real-time multiplayer strategy board game.',
  },
  blog: {
    id: 'blog',
    title: 'Code.log',
    content: <BlogApp />,
    pageUrl: '/blog',
    description: 'Blog cá nhân nơi tôi chia sẻ kiến thức, kinh nghiệm và những ghi chép trong quá trình học tập và làm việc.',
  },
  guestbook: {
    id: 'guestbook',
    title: 'Guestbook',
    content: <GuestbookApp />,
    description: 'Hãy để lại lời nhắn cho tôi! Bạn có thể đăng nhập hoặc gửi tin nhắn với tư cách khách.',
  },
  cv: {
    id: 'cv',
    title: 'CV.pdf',
    content: <PdfViewer fileUrl="/CV_NguyenCongNhatMinh.pdf" isMobile={isMobile} />,
    description: 'Xem hoặc tải xuống CV đầy đủ của tôi ở định dạng PDF tại đây.',
  },
});