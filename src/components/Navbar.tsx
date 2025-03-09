import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="absolute top-0 left-0 w-full py-4 px-20 bg-transparent z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-lg font-semibold">
          <Image width={100} height={100} src="/images/logo.png" alt="Logo" className="h-12 w-36" />
        </Link>
        <div className="space-x-12 text-lg z-50">
          <Link href="/" className="text-white">
            Home
          </Link>
          <Link href="/about" className="text-white">
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
