import MaximizedWindowLayout from '@/components/os/MaximizedWindowLayout';

const AboutContent = () => (
  <div>
    <h2 className="text-3xl font-bold mb-4">Nguyễn Công Nhật Minh</h2>
    <p className="text-lg">
      Áp dụng kiến thức và kỹ năng IT để tích lũy kinh nghiệm thực tế...
    </p>
  </div>
);

export default function AboutPage() {
  return (
    <MaximizedWindowLayout windowId="about" title="About_Me.txt">
      <AboutContent />
    </MaximizedWindowLayout>
  );
}