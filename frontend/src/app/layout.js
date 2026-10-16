import '@/styles/globals.css';

export const metadata = {
  title: 'Hotel Management System',
  description: 'A modern hotel management system',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
