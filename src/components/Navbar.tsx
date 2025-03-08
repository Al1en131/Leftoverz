import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-lg font-semibold">
          Leftoverz
        </Link>
        <div className="space-x-4">
          <Link href="/buyer" className="text-white">Buyer</Link>
          <Link href="/seller" className="text-white">Seller</Link>
          <Link href="/admin" className="text-white">Admin</Link>
        </div>
      </div>
    </nav>
  );
}
