// src/components/TechStack.tsx

// Import các icon bạn muốn sử dụng từ react-icons
// Bạn có thể tìm kiếm icon tại: https://react-icons.github.io/react-icons/
import { FaReact, FaNodeJs, FaDocker } from 'react-icons/fa';
import { SiNextdotjs, SiTailwindcss, SiTypescript, SiPrisma } from 'react-icons/si';

// Định nghĩa một mảng các công nghệ
const technologies = [
  { name: 'React', icon: <FaReact size={48} /> },
  { name: 'Next.js', icon: <SiNextdotjs size={48} /> },
  { name: 'Node.js', icon: <FaNodeJs size={48} /> },
  { name: 'TypeScript', icon: <SiTypescript size={48} /> },
  { name: 'Tailwind CSS', icon: <SiTailwindcss size={48} /> },
  { name: 'Prisma', icon: <SiPrisma size={48} /> },
  { name: 'Docker', icon: <FaDocker size={48} /> },
  // Thêm các công nghệ khác bạn biết vào đây
];

const TechStack = () => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">Công nghệ tôi sử dụng</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8">
          {technologies.map((tech) => (
            <div key={tech.name} className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-md">
              <div className="text-blue-600 mb-2">{tech.icon}</div>
              <span className="font-semibold">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;