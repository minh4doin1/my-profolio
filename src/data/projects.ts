// src/data/projects.ts

// 1. Định nghĩa kiểu dữ liệu cho một Project bằng TypeScript
export type Project = {
  slug: string; // Đường dẫn URL duy nhất, ví dụ: "my-e-commerce-site"
  title: string;
  description: string; // Mô tả ngắn gọn xuất hiện trên card
  longDescription: string; // Mô tả chi tiết cho trang riêng của dự án
  imageUrl: string;
  tags: string[]; // Danh sách các công nghệ sử dụng
  liveUrl?: string; // Link đến trang web thực tế (nếu có)
  sourceUrl?: string; // Link đến mã nguồn GitHub (nếu có)
};

// 2. Tạo một mảng chứa dữ liệu các dự án của bạn
export const projects: Project[] = [
  {
    slug: 'portfolio-website',
    title: 'Chính trang Portfolio này',
    description: 'Một portfolio "sống" được xây dựng bằng Next.js, TypeScript và Tailwind CSS.',
    longDescription: 'Đây chính là dự án bạn đang xem. Nó được xây dựng từ đầu với mục tiêu không chỉ là một trang tĩnh mà là một ứng dụng web hoàn chỉnh, thể hiện các kỹ năng về frontend, backend (API routes), tương tác với database và quy trình CI/CD chuyên nghiệp. Toàn bộ mã nguồn đều công khai trên GitHub.',
    imageUrl: '/images/project-portfolio.png', // <-- Bạn sẽ cần tạo ảnh này
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Vercel', 'Prisma'],
    sourceUrl: 'https://github.com/your-username/your-portfolio-repo', // <-- Thay link GitHub của bạn
  },
  {
    slug: 'e-commerce-platform',
    title: 'Trang web Thương mại Điện tử',
    description: 'Một nền tảng E-commerce đầy đủ tính năng với giỏ hàng, thanh toán và quản lý sản phẩm.',
    longDescription: 'Dự án này mô phỏng một trang thương mại điện tử hiện đại. Người dùng có thể xem sản phẩm, thêm vào giỏ hàng, tiến hành thanh toán (giả lập). Admin có một trang dashboard riêng để quản lý sản phẩm, đơn hàng và người dùng. Backend được xây dựng bằng Node.js/Express và database là MongoDB.',
    imageUrl: '/images/project-ecommerce.png', // <-- Bạn sẽ cần tạo ảnh này
    tags: ['React', 'Node.js', 'Express', 'MongoDB', 'Redux'],
    liveUrl: '#',
    sourceUrl: '#',
  },
  // Thêm các dự án khác của bạn vào đây
];