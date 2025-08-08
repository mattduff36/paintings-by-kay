export const metadata = {
  title: 'Admin · Paintings by Kay',
  description: 'Admin area',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
