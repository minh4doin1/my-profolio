import { App } from '@/store/useDesktopStore';
import AboutContent from '@/components/os/apps/AboutApp';
import BlogApp from '@/components/os/apps/BlogApp';
import GuestbookApp from '@/components/os/apps/GuestbookApp';
import FileExplorer from '@/components/os/FileExplorer';
import PdfViewer from '@/components/os/apps/PdfViewer';

// Mở rộng type App để có thêm mô tả cho tour
export type AppData = App & {
  description: string;
};

// Dùng một hàm để có thể truyền isMobile vào, giải quyết dependency
export const getApps = (isMobile: boolean): Record<string, AppData> => ({
  about: {
    id: 'about',
    title: 'About Me',
    // SỬA LỖI: Gán trực tiếp component JSX như một giá trị
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
    // SỬA LỖI: Gán component JSX với props một cách chính xác
    content: <PdfViewer fileUrl="/CV_NguyenCongNhatMinh.pdf" isMobile={isMobile} />,
    description: 'Xem hoặc tải xuống CV đầy đủ của tôi ở định dạng PDF tại đây.',
  },
});