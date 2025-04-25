"use client";

import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Products() {
  const userData = [
    {
      id: 1,
      name: "Alif Essa",
      email: "essa@gmail.com",
      password: "password",
      phone_number: "New York",
      role: "Seller",
    },
    {
      id: 2,
      name: "Alif Essa",
      email: "essa@gmail.com",
      password: "password",
      phone_number: "New York",
      role: "Seller",
    },
    {
      id: 3,
      name: "Alif Essa",
      email: "essa@gmail.com",
      password: "password",
      phone_number: "New York",
      role: "Seller",
    },
    {
      id: 4,
      name: "Alif Essa",
      email: "essa@gmail.com",
      password: "password",
      phone_number: "New York",
      role: "Seller",
    },
    {
      id: 5,
      name: "Alif Essa",
      email: "essa@gmail.com",
      password: "password",
      phone_number: "New York",
      role: "Seller",
    },
  ];
  const [profileOpen, setProfileOpen] = useState(false);
  return (
    <div className="min-h-screen bg-[#060B26] text-white px-6 pt-6 relative">
      <Image
        width={100}
        height={100}
        alt=""
        src="/images/admin.png"
        className="w-full absolute right-0 top-0 min-h-screen mb-0"
      />
      <div className="flex justify-between items-center mb-7 relative z-20">
        <h1 className="text-3xl font-bold">Products</h1>
        <div className="relative flex justify-end gap-4 w-full">
          <div className="block">
            <p>Wednesdey</p>
            <p>12 Jul 2025</p>
          </div>
        </div>
      </div>
      <div className="mb-6 z-20">
        <div
          className="relative rounded-lg flex justify-between items-center z-40 text-start shadow-lg"
          style={{
            background:
              "linear-gradient(to bottom right, rgba(6, 11, 38, 0.74), rgba(26, 31, 55, 0.5))",
          }}
        >
          <div className="absolute inset-0 opacity-40 rounded-lg"></div>
          <div className="relative z-10 text-white  p-6">
            <span className="text-sm font-normal">Welcome back,</span>
            <h2 className="text-xl font-semibold mb-1">Mark Johnson</h2>
            <p className="text-sm text-gray-300">
              Glad to see you again! Ask me anything.
            </p>
            <button className="mt-4 text-white text-sm flex items-center gap-2">
              Tap to record →
            </button>
          </div>
          <div className="z-10">
            <Image
              src="/images/transaction.png"
              alt="Welcome"
              width={300}
              height={300}
              className="rounded-lg absolute right-0 h-56 w-56 -top-10"
            />
          </div>
        </div>
      </div>
      <div
        className="relative overflow-x-auto rounded-lg"
        style={{
          background:
            "linear-gradient(to bottom right, rgba(6, 11, 38, 0.74), rgba(26, 31, 55, 0.5))",
        }}
      >
        <div className="px-6 pt-5 pb-8 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">Lorem Ipsum</h3>
            <p>Lorem Ipsum bla bla bla</p>
          </div>
          <div className="flex gap-2 items-center">
            <div className="relative w-3/5">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-4 py-2 rounded text-white placeholder-gray-400 bg-transparent focus:outline-none"
              />
              <Search
                className="absolute top-2.5 right-3 text-gray-400"
                size={18}
              />
            </div>
            <Link
              href="/seller/my-product/add"
              className="bg-blue-400 text-white font-medium rounded-lg p-2 w-2/5 flex items-center justify-center gap-2 shadow-md hover:bg-blue-500 transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Add User
            </Link>
          </div>
        </div>
        <table className="w-full rounded-lg my-4 max-lg:px-6 overflow-hidden">
          <thead className=" text-white text-md">
            <tr className="border-b-2 border-[#56577A]">
              <th className="px-6 py-3 text-center">No.</th>
              <th className="px-6 py-3 text-center">Image</th>
              <th className="px-6 py-3 text-center">Product Name</th>
              <th className="px-6 py-3 text-center">Category</th>
              <th className="px-6 py-3 text-center">Description</th>
              <th className="px-6 py-3 text-center">Location</th>
              <th className="px-6 py-3 text-center">Price</th>
              <th className="px-6 py-3 text-center">Status</th>
              <th className="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {userData.map((item) => (
              <tr
                key={item.id}
                className="transition border-b border-[#56577A]"
              >
                <td className="px-6 py-4 text-white text-center">{item.id}</td>
                <td className="px-6 py-4 text-white text-center">
                  {item.name}
                </td>
                <td className="px-6 py-4 text-white text-center">
                  {item.email}
                </td>
                <td className="px-6 py-4 text-white text-center">
                  {item.password}
                </td>
                <td className="px-6 py-4 text-white text-center">
                  {item.phone_number}
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`px-4 py-2 text-sm tracking-wide font-semibold rounded-full ${
                      item.role === "Seller"
                        ? "bg-green-700 text-white"
                        : "bg-red-700 text-white"
                    }`}
                  >
                    {item.role}
                  </span>
                </td>
                <td className="px-6 py-4 flex justify-center space-x-2 text-center">
                  <Link
                    href="/seller/my-product/edit"
                    className="px-4 py-2 text-sm font-bold text-white bg-blue-500 rounded-md shadow hover:bg-blue-600 transition"
                  >
                    Edit
                  </Link>
                  <button className="px-4 py-2 text-sm font-bold text-white bg-red-500 rounded-md shadow hover:bg-red-600 transition">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
