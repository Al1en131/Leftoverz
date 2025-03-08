import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="p-4 bg-[#080B2A]">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-lg font-semibold">
          <img src="/images/logo.png" alt="Logo" className="h-12" />
        </Link>
        <div className="space-x-12">
          <Link href="/buyer" className="text-white">
            Home
          </Link>
          <Link href="/seller" className="text-white">
            About Us
          </Link>
          <Link href="/admin" className="text-white">
            Product
          </Link>
        </div>
      </div>
    </nav>
  );
}
