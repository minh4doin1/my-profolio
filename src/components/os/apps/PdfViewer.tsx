const PdfViewer = ({ fileUrl, isMobile }: { fileUrl: string, isMobile: boolean }) => {
  if (isMobile) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <p className="mb-4 text-lg">Trình xem PDF không được tối ưu cho di động.</p>
        <p className="mb-6 text-gray-400">Vui lòng mở CV trong một tab mới để có trải nghiệm tốt nhất.</p>
        <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg">
          Xem CV
        </a>
      </div>
    );
  }
  return <embed src={fileUrl} type="application/pdf" className="w-full h-full" />;
};
export default PdfViewer;