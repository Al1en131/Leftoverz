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
      <Image
        width={100}
        height={100}
        alt=""
        src="/images/Star-1.svg"
        className="w-8 absolute top-10 right-26 -z-0"
      />
      <Image
        width={100}
        height={100}
        alt=""
        src="/images/Star-1.svg"
        className="w-4 absolute top-14 right-96 -z-0"
      />
      <Image
        width={100}
        height={100}
        alt=""
        src="/images/Star-1.svg"
        className="w-4 absolute top-16 left-56 -z-0"
      />
      <Image
        width={100}
        height={100}
        alt=""
        src="/images/Star-1.svg"
        className="w-4 absolute top-10 left-[550px] -z-0"
      />
      <div className="flex justify-between items-center mb-8 relative z-20">
        <h1 className="text-3xl font-bold">Users</h1>
        <div className="relative flex items-center gap-1 w-1/4">
          <div className="relative w-full">
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
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="w-1/4 flex justify-end"
          >
            <Image
              width={40}
              height={40}
              src="/images/profile.jpg"
              alt="Profile"
              className="w-10 h-10 rounded-full cursor-pointer"
            />
          </button>
          {profileOpen && (
            <div className="absolute right-0 top-12 w-48 bg-white shadow-lg rounded-lg py-2 z-50">
              <div className="px-4 py-2 text-gray-800">
                <p className="font-semibold">John Doe</p>
                <p className="text-sm text-gray-500">john.doe@example.com</p>
              </div>
              <hr />
              <Link
                href="/buyer/detail-profile"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Lihat Profil
              </Link>
              <Link
                href="/buyer/favorite"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Favorit
              </Link>
              <button
                className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                onClick={() => console.log("Logout")}
              >
                Logout
              </button>
            </div>
          )}
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
          <div className="relative z-10">
            <Image
              src="/images/dashboard.png"
              alt="Welcome"
              width={300}
              height={300}
              className="rounded-lg w-full h-full"
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
              <th className="px-6 py-3 text-center">Name</th>
              <th className="px-6 py-3 text-center">Email</th>
              <th className="px-6 py-3 text-center">Password</th>
              <th className="px-6 py-3 text-center">Phone Number</th>
              <th className="px-6 py-3 text-center">Role</th>
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
