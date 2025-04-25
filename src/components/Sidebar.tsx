"use client";

import Link from "next/link";
import Image from "next/image";

const Sidebar = () => {
  return (
    <div className="flex min-h-screen">
      <div className="w-64 bg-[#121b39] text-white p-6">
        <Link href="/" className="text-white text-lg font-semibold">
          <Image
            width={100}
            height={100}
            src="/images/logo.png"
            alt="Logo"
            className="h-12 w-36"
          />
        </Link>
        <ul className="space-y-6 text-lg mt-7">
          <div className="flex gap-3 border-b py-3 border-white border-t items-center">
            <Image
              width={60}
              height={60}
              src="/images/profile.jpg"
              alt="Profile"
              className="w-16 h-16 rounded-full cursor-pointer"
            />
            <div>
              <p>Admin</p>
              <p className="text-base">Admin@gmail.com</p>
            </div>
          </div>
          <li className=" flex items-center gap-3">
            <svg
              className="w-6 text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"
              />
            </svg>
            <Link href="/admin" className="hover:text-blue-400">
              Dashboard
            </Link>
          </li>
          <li className="flex items-center gap-3">
            <svg
              className="w-6 text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeWidth="2"
                d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>

            <Link href="/admin/users" className="hover:text-blue-400">
              Users
            </Link>
          </li>
          <li className="flex items-center gap-3">
            <svg
              className="w-6 h-6 text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M18 17v2M12 5.5V10m-6 7v2m15-2v-4c0-1.6569-1.3431-3-3-3H6c-1.65685 0-3 1.3431-3 3v4h18Zm-2-7V8c0-1.65685-1.3431-3-3-3H8C6.34315 5 5 6.34315 5 8v2h14Z"
              />
            </svg>

            <Link href="/admin/products" className="hover:text-blue-400">
              Products
            </Link>
          </li>
          <li className="flex items-center gap-3">
            <svg
              className="w-6 h-6 text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2"
                d="M8 7V6a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-1M3 18v-7a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
              />
            </svg>

            <Link href="/admin/transactions" className="hover:text-blue-400">
              Transactions
            </Link>
          </li>
          <li className="flex items-center gap-3">
            <svg
              className="w-6 h-6 text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2"
                d="m3.5 5.5 7.893 6.036a1 1 0 0 0 1.214 0L20.5 5.5M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z"
              />
            </svg>

            <Link href="/admin/chats" className="hover:text-blue-400">
              Chats
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
