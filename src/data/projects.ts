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
    slug: 'mobifone-easyconnect',
    title: 'Mobifone EasyConnect',
    description: 'Tạo giao diện người dùng, sửa các logic về cơ sở dữ liệu cho dự án.',
    longDescription: 'Là một Lập trình viên Frontend tại Mobifone IT, tôi đã tham gia vào dự án EasyConnect. Các nhiệm vụ chính bao gồm xây dựng các component giao diện mới theo thiết kế, đồng thời làm việc với backend team để sửa đổi và tối ưu hóa các logic liên quan đến cơ sở dữ liệu.',
    imageUrl: '/images/project-easyconnect.png', // <-- Cần ảnh placeholder
    tags: ['NextJs', 'Docker', 'NodeJS'],
    sourceUrl: 'https://github.com/minh4doin1',
  },
  {
    slug: 'mobifone-econtract',
    title: 'Mobifone Econtract',
    description: 'Tạo giao diện người dùng, sửa các logic về các loại chữ kí.',
    longDescription: 'Trong vai trò Thực tập sinh tại Mobifone IT, tôi đã đóng góp vào dự án Econtract, một hệ thống hợp đồng điện tử. Tôi chịu trách nhiệm phát triển giao diện người dùng và xử lý các logic phức tạp liên quan đến các loại chữ ký số, đảm bảo tính toàn vẹn và bảo mật.',
    imageUrl: '/images/project-econtract.png', // <-- Cần ảnh placeholder
    tags: ['Angular', 'NodeJS'],
    sourceUrl: 'https://github.com/minh4doin1',
  },
  {
    slug: 'iot-security-monitoring',
    title: 'Thiết bị IOT giám sát an toàn phòng máy tính',
    description: 'Nghiên cứu và phát triển thiết bị IoT, xuất bản bài báo khoa học.',
    longDescription: 'Đây là một dự án nghiên cứu khoa học khi tôi còn là thực tập sinh tại Viện Hàn lâm KH&KT. Dự án tập trung vào việc xây dựng một thiết bị IoT để giám sát các thông số an toàn trong phòng máy chủ. Kết quả của dự án đã được xuất bản thành bài báo tại tạp chí khoa học Đại học Tân Trào.',
    imageUrl: '/images/project-iot.png', // <-- Cần ảnh placeholder
    tags: ['IoT', 'WebServer', 'NCKH'],
    sourceUrl: 'https://tudonghoangaynay.vn/ung-dung-cong-nghe-iot-va-hoc-may-trong-giam-sat-suc-khoe-va-phat-hien-te-nga-o-nguoi-cao-tuoi-10821.html', // Link bài báo
  },
  // Thêm các dự án khác nếu muốn
];