import './globals.css';
import DesktopPreview from './DesktopPreview';

export const metadata = {
  title: 'Satvic Movement — Livestock Emissions, Made Visible | Satvic Movement',
  description: 'A mindful space to share moments, nourishment, and inspiration with the Satvic community.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,400;6..96,500&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning><DesktopPreview>{children}</DesktopPreview></body>
    </html>
  );
}
