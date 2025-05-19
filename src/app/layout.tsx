// app/layout.tsx
import "../styles/globals.css";
import { Providers } from "./providers";
import LayoutClient from "./LayoutClient"; // Client Component

export const metadata = {
  title: "Leftoverz",
  description: "Description",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white dark:bg-[#080B2A] relative">
        <Providers>
          <LayoutClient>{children}</LayoutClient>
        </Providers>
      </body>
    </html>
  );
}
