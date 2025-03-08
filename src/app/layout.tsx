import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#080B2A] relative font-[Poppins]">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
