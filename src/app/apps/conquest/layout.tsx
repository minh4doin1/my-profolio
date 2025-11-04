// src/app/apps/conquest/layout.tsx
import MaximizedWindowLayout from "@/components/os/MaximizedWindowLayout";

export default function ConquestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Chúng ta tái sử dụng MaximizedWindowLayout để có thanh tiêu đề và nút đóng
  // Điều này giúp game có cảm giác như một ứng dụng được phóng to hết cỡ.
  return (
    <MaximizedWindowLayout windowId="conquest" title="Project Conquest">
      {children}
    </MaximizedWindowLayout>
  );
}