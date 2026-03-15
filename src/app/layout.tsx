import "./globals.css";

// Root layout — delegates HTML structure to [locale]/layout.tsx
// This exists only to import global CSS and satisfy Next.js requirements
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
