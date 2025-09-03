// src/components/Hero.tsx
import Link from 'next/link';

const Hero = () => {
  return (
    <section className="text-center py-20">
      <h1 className="text-5xl font-bold mb-4">
        Xin chào, tôi là [Tên Của Bạn]
      </h1>
      <h2 className="text-2xl text-gray-600 mb-8">
        Một Web Developer đam mê xây dựng những ứng dụng web hiện đại và hữu ích.
      </h2>
      <div className="space-x-4">
        <Link 
          href="/projects" 
          className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Xem dự án
        </Link>
        <Link 
          href="/contact" 
          className="bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition duration-300"
        >
          Liên hệ
        </Link>
      </div>
    </section>
  );
};

export default Hero;