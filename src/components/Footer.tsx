// src/components/Footer.tsx

const Footer = () => {
  const currentYear = new Date().getFullYear(); // Lấy năm hiện tại một cách tự động

  return (
    <footer className="bg-gray-800 text-white p-4 mt-8">
      <div className="container mx-auto text-center">
        <p>&copy; {currentYear} Tên Của Bạn. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;