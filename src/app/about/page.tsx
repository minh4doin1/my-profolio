// src/app/about/page.tsx
import ExperienceTimeline from '@/components/ExperienceTimeline';
import Image from 'next/image';
import Link from 'next/link';

const AboutPage = () => {
  return (
    <div className="container mx-auto py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
        {/* Cột ảnh và thông tin liên hệ */}
        <div className="md:col-span-1 flex flex-col items-center">
          <Image
            src="/minh-avatar.jpg" // <-- Đặt ảnh của bạn vào public/minh-avatar.jpg
            alt="Nguyễn Công Nhật Minh"
            width={200}
            height={200}
            className="rounded-full shadow-lg mb-6"
          />
          <h2 className="text-2xl font-bold">Nguyễn Công Nhật Minh</h2>
          <p className="text-gray-600 dark:text-gray-400">Lập trình viên</p>
          <div className="mt-4 space-y-2 text-center">
            <p>📧 minh2002811@gmail.com</p>
            <p>📞 0943174586</p>
            <Link href="https://github.com/minh4doin1" target="_blank" className="text-blue-500 hover:underline">
              GitHub: @minh4doin1
            </Link>
          </div>
        </div>

        {/* Cột giới thiệu và kỹ năng */}
        <div className="md:col-span-2">
          <h1 className="text-4xl font-bold mb-6">Giới thiệu</h1>
          <p className="text-lg mb-8 leading-relaxed">
            Áp dụng kiến thức và kỹ năng IT để tích lũy kinh nghiệm thực tế, không ngừng học
            hỏi công nghệ mới và phát triển kỹ năng làm việc nhóm, hướng tới trở thành một
            chuyên gia trong lĩnh vực phát triển phần mềm, góp phần vào các dự án lớn và tạo
            ra giá trị bền vững cho cộng đồng.
          </p>
          
          <h2 className="text-3xl font-bold mb-4">Kỹ năng</h2>
          <div className="flex flex-wrap gap-4">
            <span className="skill-badge">Angular</span>
            <span className="skill-badge">React</span>
            <span className="skill-badge">Next.js</span>
            <span className="skill-badge">NodeJS</span>
            <span className="skill-badge">TypeScript</span>
            <span className="skill-badge">Docker</span>
            <span className="skill-badge">IoT</span>
          </div>
        </div>
      </div>

      {/* Timeline Kinh nghiệm */}
      <div className="mt-20">
        <h2 className="text-3xl font-bold text-center mb-12">Hành trình sự nghiệp</h2>
        <ExperienceTimeline />
      </div>
    </div>
  );
};

export default AboutPage;