// src/components/Navbar.tsx
import Link from 'next/link'; // Import component Link để điều hướng

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Phần Logo/Tên của bạn */}
        <Link href="/" className="text-xl font-bold">
          Tên Của Bạn
        </Link>

        {/* Phần các link điều hướng */}
        <ul className="flex space-x-4">
          <li>
            <Link href="/" className="hover:text-gray-300">
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" className="hover:text-gray-300">
              About
            </Link>
          </li>
          <li>
            <Link href="/projects" className="hover:text-gray-300">
              Projects
            </Link>
          </li>
          <li>
            <Link href="/blog" className="hover:text-gray-300">
              Blog
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;