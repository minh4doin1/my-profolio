// src/components/Navbar.tsx
import Link from 'next/link';
import ThemeSwitcher from './ThemeSwitcher';

const Navbar = () => {
  return (
    <nav className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link href="/" className="text-xl font-bold">
          Tên Của Bạn
        </Link>
        <div className="flex items-center space-x-6">
          <ul className="hidden md:flex items-center space-x-6">
            <li><Link href="/" className="hover:text-blue-500 transition-colors">Home</Link></li>
            <li><Link href="/about" className="hover:text-blue-500 transition-colors">About</Link></li>
            <li><Link href="/projects" className="hover:text-blue-500 transition-colors">Projects</Link></li>
            <li><Link href="/blog" className="hover:text-blue-500 transition-colors">Blog</Link></li>
          </ul>
          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;