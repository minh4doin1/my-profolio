// src/data/projects.ts

// Bỏ import ReactNode không cần thiết

// SỬA LỖI 1: Thêm "export" để các file khác có thể import type này
export type ContentBlock =
  | { type: 'heading'; level: 2 | 3; content: string }
  | { type: 'paragraph'; content: string }
  | { type: 'image'; src: string; alt: string; caption?: string }
  | { type: 'list'; items: string[] };

// SỬA LỖI 2: Đảm bảo type Project có đầy đủ các trường mới
export type Project = {
  slug: string;
  title: string;
  tags: string[];
  coverImage: string;
  metadata: {
    [key: string]: string;
  };
  links: {
    live?: string;
    repo?: string;
  };
  content: ContentBlock[];
  summary: string;
};

export const projects: Project[] = [
  {
    slug: 'mobifone-econtract',
    title: 'Mobifone E-Contract',
    summary: 'Số hóa quy trình ký kết hợp đồng, giúp doanh nghiệp tiết kiệm thời gian, chi phí và nâng cao tính bảo mật.',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Redux Toolkit', 'Ant Design'],
    coverImage: '/projects/econtract-logo.png',
    metadata: {
      "Vai trò": "Frontend Developer",
      "Thời gian": "2023 - 2024",
      "Lĩnh vực": "Hợp đồng điện tử",
      "Công nghệ chính": "Next.js, Redux, Ant Design",
    },
    links: {
      live: 'https://mobifone-econtract.vn/',
    },
    content: [
      {
        type: 'heading',
        level: 2,
        content: 'Bối cảnh và Thách thức',
      },
      {
        type: 'paragraph',
        content: 'Dự án Hợp đồng điện tử Mobifone (Mobifone E-Contract) được xây dựng nhằm số hóa toàn bộ quy trình ký kết hợp đồng, giúp doanh nghiệp tiết kiệm thời gian, chi phí và nâng cao tính bảo mật. Thách thức lớn nhất là phải xây dựng một giao diện người dùng (UI) trực quan, dễ sử dụng cho nhiều đối tượng người dùng khác nhau, đồng thời phải đảm bảo hiệu năng và xử lý luồng ký kết phức tạp với nhiều bước xác thực.',
      },
      {
        type: 'image',
        src: '/projects/econtract-dashboard.png',
        alt: 'Giao diện dashboard của Mobifone E-Contract',
        caption: 'Giao diện quản lý chính.'
      },
      {
        type: 'heading',
        level: 2,
        content: 'Giải pháp và Vai trò',
      },
      {
        type: 'paragraph',
        content: 'Với vai trò là Lập trình viên Frontend, tôi chịu trách nhiệm chính trong việc phát triển các thành phần giao diện cốt lõi bằng Next.js và TypeScript. Tôi đã sử dụng Redux Toolkit để quản lý trạng thái phức tạp của ứng dụng, từ thông tin người dùng, danh sách hợp đồng cho đến luồng ký kết nhiều bước. Thư viện Ant Design được tùy chỉnh sâu để phù hợp với bộ nhận diện thương hiệu của Mobifone.',
      },
      {
        type: 'heading',
        level: 3,
        content: 'Các tính năng nổi bật đã phát triển:',
      },
      {
        type: 'list',
        items: [
          'Tối ưu và sửa lỗi các  luồng ký kết hợp đồng (document signing flow) với các bước kéo-thả chữ ký, xác thực OTP.',
          'Phát triển tính năng ghi chú cho hợp đồng từ chối',
          'Xây dựng tính năng upload file từ các hệ thống đám mây như Google Drive, Onedrive.',
          'Đảm bảo giao diện responsive, hoạt động tốt trên cả desktop và các thiết bị di động.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        content: 'Kết quả và Bài học',
      },
      {
        type: 'paragraph',
        content: 'Dự án đã được triển khai thành công và nhận được phản hồi tích cực từ phía khách hàng. Qua dự án này, tôi đã học hỏi được rất nhiều về cách quản lý state trong một ứng dụng lớn, cách làm việc với các thư viện UI component phức tạp và quy trình làm việc chuyên nghiệp trong một đội nhóm.',
      },
    ],
  },
  {
    slug: 'mobifone-easyconnect',
    title: 'Mobifone EasyConnect',
    summary: 'Xây dựng một Single Page Application (SPA) để hiện đại hóa và hợp nhất các công cụ quản lý thông tin khách hàng và tổng đài đa kênh.',
    tags: ['React.js', 'TypeScript', 'Redux', 'Styled-Components', 'REST API'],
    coverImage: '/projects/easy-connect.png', // Đặt ảnh này trong public/projects/
    metadata: {
      "Vai trò": "Frontend Developer",
      "Thời gian": "2022 - 2023",
      "Lĩnh vực": "Quản lý Dịch vụ Viễn thông",
      "Công nghệ chính": "React, Redux, Styled-Components",
    },
    links: {
      live: 'https://easyconnect.mobifone.ai/',
    },
    content: [
      {
        type: 'heading',
        level: 2,
        content: 'Bối cảnh và Thách thức',
      },
      {
        type: 'paragraph',
        content: 'Mobifone EasyConnect là một hệ thống nội bộ được xây dựng để hiện đại hóa và hợp nhất các công cụ quản lý thông tin khách hàng và dịch vụ viễn thông. Trước đây, nhân viên phải sử dụng nhiều phần mềm cũ, rời rạc và chậm chạp để tra cứu thông tin thuê bao, đăng ký gói cước, và xử lý các yêu cầu của khách hàng. Thách thức đặt ra là xây dựng một Single Page Application (SPA) nhanh, mạnh mẽ và có giao diện thân thiện để thay thế hoàn toàn các công cụ cũ.',
      },
      {
        type: 'image',
        src: '/projects/easy-connect-dashboard.png', // Đặt ảnh này trong public/projects/
        alt: 'Giao diện quản lý của Mobifone EasyConnect',
        caption: 'Giao diện chính.'
      },
      {
        type: 'heading',
        level: 2,
        content: 'Giải pháp và Vai trò',
      },
      {
        type: 'paragraph',
        content: 'Trong dự án này, tôi tham gia với vai trò Frontend Developer, tập trung vào việc xây dựng giao diện người dùng bằng React và TypeScript. Chúng tôi đã chọn Styled-Components để tạo ra một hệ thống component-based styling linh hoạt và dễ bảo trì. Toàn bộ trạng thái của ứng dụng, từ dữ liệu người dùng, danh sách gói cước, đến lịch sử giao dịch, được quản lý tập trung bằng Redux.',
      },
      {
        type: 'heading',
        level: 3,
        content: 'Các đóng góp chính:',
      },
      {
        type: 'list',
        items: [
          'Phát triển module live chat kết nối nhiều kênh mạng xã hội vào 1 nền tảng chat',
          'Xây dựng giao diện đăng ký, thay đổi và hủy các gói cước data/thoại một cách trực quan.',
          'Tích hợp với các REST API từ backend để lấy và cập nhật dữ liệu thuê bao theo thời gian thực.',
          'Tạo các biểu đồ báo cáo đơn giản bằng thư viện Chart.js để hiển thị thống kê dịch vụ.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        content: 'Kết quả',
      },
      {
        type: 'paragraph',
        content: 'Hệ thống EasyConnect hoạt động ổn định trong nội bộ PM2 Mobifone, nâng cao năng xuất làm việc',
      },
    ],
  },
  {
    slug: 'iot-health-device',
    title: 'IoT Health Device',
    summary: 'Thiết bị an ninh IoT chi phí thấp sử dụng ESP32 và cảm biến để theo dõi sức khỏe và gửi cảnh báo ngã theo thời gian thực.',
    tags: ['C/C++', 'Embedded Systems', 'IoT', 'MQTT', 'ESP32'],
    coverImage: '/projects/iothealth.jpg', // Đặt ảnh này trong public/projects/
    metadata: {
      "Vai trò": "Embedded Developer (Đồ án tốt nghiệp)",
      "Thời gian": "2021 - 2022",
      "Lĩnh vực": "Sức khỏe & IoT",
      "Nền tảng": "ESP32, FreeRTOS",
    },
    links: {
      live: 'https://tudonghoangaynay.vn/ung-dung-cong-nghe-iot-va-hoc-may-trong-giam-sat-suc-khoe-va-phat-hien-te-nga-o-nguoi-cao-tuoi-10821.html', // Nhớ thay link repo thật
    },
    content: [
      {
        type: 'heading',
        level: 2,
        content: 'Mục tiêu và Ý tưởng',
      },
      {
        type: 'paragraph',
        content: 'Đây là dự án đồ án tốt nghiệp của tôi, với mục tiêu xây dựng một thiết bị an ninh IoT chi phí thấp có khả năng giám sát sức khỏe và gửi cảnh báo ngã theo thời gian thực. Ý tưởng cốt lõi là sử dụng vi điều khiển ESP32 kết hợp với cảm biến phát hiện các dấu hiệu sức khỏe và gửi thông báo ngay lập tức đến một máy chủ trung tâm qua giao thức MQTT.',
      },
      // {
      //   type: 'image',
      //   src: '/projects/iot-circuit.jpg', // Đặt ảnh này trong public/projects/
      //   alt: 'Nguyên mẫu thiết bị IoT',
      //   caption: 'Sơ đồ mạch và nguyên mẫu thiết bị thực tế.'
      // },
      {
        type: 'heading',
        level: 2,
        content: 'Triển khai Kỹ thuật',
      },
      {
        type: 'paragraph',
        content: 'Phần mềm cho thiết bị được phát triển hoàn toàn bằng ngôn ngữ C/C++ trên nền tảng ESP-IDF. Tôi đã sử dụng hệ điều hành thời gian thực (RTOS) FreeRTOS để quản lý các tác vụ đồng thời: một tác vụ dành cho việc đọc dữ liệu từ cảm biến, một tác vụ khác để xử lý kết nối Wi-Fi và giao tiếp MQTT. Việc sử dụng RTOS giúp hệ thống hoạt động ổn định và hiệu quả, đặc biệt là trong việc xử lý các sự kiện bất đồng bộ.',
      },
      {
        type: 'heading',
        level: 3,
        content: 'Luồng hoạt động của thiết bị:',
      },
      {
        type: 'list',
        items: [
          'Thiết bị khởi động và tự động kết nối vào mạng Wi-Fi đã được cấu hình.',
          'Sau khi kết nối thành công, thiết bị đăng ký vào một MQTT broker và lắng nghe các topic điều khiển.',
          'Hệ thống chuyển sang chế độ năng lượng thấp, liên tục giám sát tín hiệu từ cảm biến PIR.',
          'Khi phát hiện chuyển động, thiết bị "thức dậy", gửi một tin nhắn JSON chứa thông tin cảnh báo (ID thiết bị, thời gian) đến topic "alerts".',
          'Sau khi gửi, thiết bị quay trở lại chế độ năng lượng thấp để tiết kiệm pin.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        content: 'Kết quả và Thành tựu',
      },
      {
        type: 'paragraph',
        content: 'Sản phẩm hoàn thiện đã hoạt động đúng như mong đợi, có khả năng gửi cảnh báo gần như ngay lập tức với độ trễ thấp. Dự án đã đạt điểm cao và giúp tôi có được nền tảng vững chắc về lập trình nhúng, hệ điều hành thời gian thực và các giao thức truyền thông trong mạng lưới IoT. Đây là một trải nghiệm quý báu, cho thấy khả năng học hỏi và làm việc với cả phần cứng lẫn phần mềm của tôi.',
      },
    ],
  },
  {
    slug: 'iot-water-monitor-device',
    title: 'IoT Water Monitor App',
    summary: 'App theo dõi các thông số nước',
    tags: ['C/C++', 'Embedded Systems', 'IoT', 'MQTT', 'ESP32'],
    coverImage: '/projects/aqualogo.jpg', // Đặt ảnh này trong public/projects/
    metadata: {
      "Vai trò": "App Developer",
      "Thời gian": "2021 - 2022",
      "Lĩnh vực": "IoT",
      "Nền tảng": "React Native, Expo",
    },
    links: {
      repo: 'https://github.com/minh4doin1/AquaWatchApp',
    },
    content: [
      {
        type: 'heading',
        level: 2,
        content: 'Mục tiêu và Ý tưởng',
      },
      {
        type: 'paragraph',
        content: 'Xây dựng App mobile theo dõi các chỉ số nước.',
      },
      {
        type: 'heading',
        level: 2,
        content: 'Triển khai Kỹ thuật',
      },
      {
        type: 'paragraph',
        content: 'Phần mềm phát triển bằng react native cho phép sử dụng đa nền tảng.',
      },

      {
        type: 'heading',
        level: 2,
        content: 'Kết quả và Thành tựu',
      },
      {
        type: 'image',
        src: '/projects/aquaapp.jpg',
        alt: 'Nguyên mẫu thiết bị IoT',
        caption: 'Giao diện app.'
      },
      {
        type: 'paragraph',
        content: 'Sản phẩm hoàn thiện đã hoạt động đúng như mong đợi',
      },
    ],
  },
];