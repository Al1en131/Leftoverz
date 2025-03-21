"use client";

import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Dashboard() {
  const [profileOpen, setProfileOpen] = useState(false);
  return (
    <div className="min-h-screen bg-[#060B26] text-white p-6 relative">
      <Image
        width={100}
        height={100}
        alt=""
        src="/images/bubble.svg"
        className="h-[356px] w-[356px] absolute top-0 left-0"
      />
      <Image
        width={100}
        height={100}
        alt=""
        src="/images/bubble-9.svg"
        className="h-[856px] w-[856px] absolute top-0 right-1/2 -z-0"
      />
      <Image
        width={100}
        height={100}
        alt=""
        src="/images/bubble-9.svg"
        className="h-[856px] w-[856px] absolute bottom-0 right-0 -z-0"
      />
      <Image
        width={100}
        height={100}
        alt=""
        src="/images/Star-1.svg"
        className="w-8 absolute top-28 right-26 -z-0"
      />
      <Image
        width={100}
        height={100}
        alt=""
        src="/images/Star-1.svg"
        className="w-4 absolute top-28 right-96 -z-0"
      />
      <Image
        width={100}
        height={100}
        alt=""
        src="/images/Star-1.svg"
        className="w-4 absolute top-44 left-56 -z-0"
      />
      <Image
        width={100}
        height={100}
        alt=""
        src="/images/Star-1.svg"
        className="w-4 absolute top-36 left-[550px] -z-0"
      />
      <div className="flex justify-between items-center mb-8 relative z-20">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="relative flex items-center gap-1 w-1/4">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 rounded text-white placeholder-gray-400 bg-gray-800 focus:outline-none"
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
      <div className="grid grid-cols-4 gap-6 mb-6 z-40">
        {[
          {
            label: "Buyer",
            value: "10k",
            color: "text-green-400",
          },
          {
            label: "Seller",
            value: "2,300",
            color: "text-green-400",
          },
          {
            label: "Total Products",
            value: "3,052",
            color: "text-red-400",
          },
          {
            label: "Total purchase",
            value: "Rp. 73,000",
            color: "text-green-400",
          },
        ].map((item, i) => (
          <div
            key={i}
            className=" p-4 z-40 rounded-lg shadow"
            style={{
              background:
                "linear-gradient(to bottom right, rgba(6, 11, 38, 0.74), rgba(26, 31, 55, 0.5))",
            }}
          >
            <p className="text-sm text-gray-300">{item.label}</p>
            <h2 className="text-xl font-semibold">{item.value} </h2>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6 z-40">
        <div
          className="relative rounded-lg flex justify-between items-center z-40 text-start shadow-lg"
          style={{
            background:
              "linear-gradient(to bottom right, rgba(6, 11, 38, 0.74), rgba(26, 31, 55, 0.5))",
          }}
        >
          <div className="absolute inset-0 bg-blue-900 opacity-40 rounded-lg"></div>
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

        <div
          className="p-6 rounded-lg shadow z-40"
          style={{
            background:
              "linear-gradient(to bottom right, rgba(6, 11, 38, 0.74), rgba(26, 31, 55, 0.5))",
          }}
        >
          <p className="text-sm text-gray-300">Satisfaction Rate</p>
          <div className="flex flex-col justify-center items-center h-full">
            <h1 className="text-4xl font-bold mb-2">95%</h1>
            <div className="w-3/4 bg-gray-700 h-2 rounded-full">
              <div
                className="bg-blue-500 h-full rounded-full"
                style={{ width: "95%" }}
              />
            </div>
          </div>
        </div>
        <div
          className="p-6 rounded-lg shadow z-40"
          style={{
            background:
              "linear-gradient(to bottom right, rgba(6, 11, 38, 0.74), rgba(26, 31, 55, 0.5))",
          }}
        >
          <p className="text-sm text-gray-300">Referral Tracking</p>
          <div className="mt-4 space-y-2">
            <p>
              Invited: <span className="font-semibold">145 people</span>
            </p>
            <p>
              Bonus: <span className="font-semibold">1,465</span>
            </p>
            <p>
              Safety Score:{" "}
              <span className="font-semibold text-green-400">9.3</span>
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div
          className="shadow rounded-lg p-4 sm:p-6 xl:p-8  z-50"
          style={{
            background:
              "linear-gradient(to bottom right, rgba(6, 11, 38, 0.74), rgba(26, 31, 55, 0.5))",
          }}
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold white mb-2">
                Latest Transactions
              </h3>
              <span className="text-base font-normal text-white">
                This is a list of latest transactions
              </span>
            </div>
            <div className="flex-shrink-0">
              <a
                href="#"
                className="text-sm font-medium text-cyan-600 hover:bg-gray-100 rounded-lg p-2"
              >
                View all
              </a>
            </div>
          </div>
          <div className="flex flex-col mt-8">
            <div className="overflow-x-auto rounded-lg">
              <div className="align-middle inline-block min-w-full">
                <div className="shadow overflow-hidden sm:rounded-lg">
                  <table className="min-w-full ">
                    <thead className="border-b-2 border-[#56577A]">
                      <tr>
                        <th
                          scope="col"
                          className="p-4 text-left text-xs font-medium text-white uppercase tracking-wider"
                        >
                          Transaction
                        </th>
                        <th
                          scope="col"
                          className="p-4 text-left text-xs font-medium text-white uppercase tracking-wider"
                        >
                          Date & Time
                        </th>
                        <th
                          scope="col"
                          className="p-4 text-left text-xs font-medium text-white uppercase tracking-wider"
                        >
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="">
                      <tr className="border-b border-[#56577A]">
                        <td className="p-4 whitespace-nowrap text-sm font-normal text-white">
                          Payment from{" "}
                          <span className="font-semibold">Bonnie Green</span>
                        </td>
                        <td className="p-4 whitespace-nowrap text-sm font-normal text-white">
                          Apr 23 ,2021
                        </td>
                        <td className="p-4 whitespace-nowrap text-sm font-semibold text-white">
                          $2300
                        </td>
                      </tr>
                      <tr className="border-b border-[#56577A]">
                        <td className="p-4 whitespace-nowrap text-sm font-normal text-white rounded-lg rounded-left">
                          Payment refund to{" "}
                          <span className="font-semibold">#00910</span>
                        </td>
                        <td className="p-4 whitespace-nowrap text-sm font-normal text-white">
                          Apr 23 ,2021
                        </td>
                        <td className="p-4 whitespace-nowrap text-sm font-semibold text-white">
                          -$670
                        </td>
                      </tr>
                      <tr className="border-b border-[#56577A]">
                        <td className="p-4 whitespace-nowrap text-sm font-normal text-white">
                          Payment failed from{" "}
                          <span className="font-semibold">#087651</span>
                        </td>
                        <td className="p-4 whitespace-nowrap text-sm font-normal text-white">
                          Apr 18 ,2021
                        </td>
                        <td className="p-4 whitespace-nowrap text-sm font-semibold text-white">
                          $234
                        </td>
                      </tr>
                      <tr className="border-b border-[#56577A]">
                        <td className="p-4 whitespace-nowrap text-sm font-normal text-white rounded-lg rounded-left">
                          Payment from{" "}
                          <span className="font-semibold">Lana Byrd</span>
                        </td>
                        <td className="p-4 whitespace-nowrap text-sm font-normal text-white">
                          Apr 15 ,2021
                        </td>
                        <td className="p-4 whitespace-nowrap text-sm font-semibold text-white">
                          $5000
                        </td>
                      </tr>
                      <tr className="border-b border-[#56577A]">
                        <td className="p-4 whitespace-nowrap text-sm font-normal text-white">
                          Payment from{" "}
                          <span className="font-semibold">Jese Leos</span>
                        </td>
                        <td className="p-4 whitespace-nowrap text-sm font-normal text-white">
                          Apr 15 ,2021
                        </td>
                        <td className="p-4 whitespace-nowrap text-sm font-semibold text-white">
                          $2300
                        </td>
                      </tr>
                      <tr className="border-b border-[#56577A]">
                        <td className="p-4 whitespace-nowrap text-sm font-normal text-white rounded-lg rounded-left">
                          Payment from{" "}
                          <span className="font-semibold">THEMESBERG LLC</span>
                        </td>
                        <td className="p-4 whitespace-nowrap text-sm font-normal text-white">
                          Apr 11 ,2021
                        </td>
                        <td className="p-4 whitespace-nowrap text-sm font-semibold text-white">
                          $560
                        </td>
                      </tr>
                      <tr className="border-b border-[#56577A]">
                        <td className="p-4 whitespace-nowrap text-sm font-normal text-white">
                          Payment from{" "}
                          <span className="font-semibold">Lana Lysle</span>
                        </td>
                        <td className="p-4 whitespace-nowrap text-sm font-normal text-white">
                          Apr 6 ,2021
                        </td>
                        <td className="p-4 whitespace-nowrap text-sm font-semibold text-white">
                          $1437
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="shadow rounded-lg p-4 sm:p-6 xl:p-8  z-50"
          style={{
            background:
              "linear-gradient(to bottom right, rgba(6, 11, 38, 0.74), rgba(26, 31, 55, 0.5))",
          }}
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold white mb-2">Latest Products</h3>
              <span className="text-base font-normal text-white">
                This is a list of latest products
              </span>
            </div>
            <div className="flex-shrink-0">
              <a
                href="#"
                className="text-sm font-medium text-cyan-600 hover:bg-gray-100 rounded-lg p-2"
              >
                View all
              </a>
            </div>
          </div>
          <div className="flex flex-col mt-8">
            <div className="overflow-x-auto rounded-lg">
              <div className="align-middle inline-block min-w-full">
                <div className="shadow overflow-hidden sm:rounded-lg">
                  <table className="min-w-full ">
                    <thead className="border-b-2 border-[#56577A]">
                      <tr>
                        <th
                          scope="col"
                          className="p-4 text-left text-xs font-medium text-white uppercase tracking-wider"
                        >
                          Transaction
                        </th>
                        <th
                          scope="col"
                          className="p-4 text-left text-xs font-medium text-white uppercase tracking-wider"
                        >
                          Date & Time
                        </th>
                        <th
                          scope="col"
                          className="p-4 text-left text-xs font-medium text-white uppercase tracking-wider"
                        >
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="">
                      <tr className="border-b border-[#56577A]">
                        <td className="p-4 whitespace-nowrap text-sm font-normal text-white">
                          Payment from{" "}
                          <span className="font-semibold">Bonnie Green</span>
                        </td>
                        <td className="p-4 whitespace-nowrap text-sm font-normal text-white">
                          Apr 23 ,2021
                        </td>
                        <td className="p-4 whitespace-nowrap text-sm font-semibold text-white">
                          $2300
                        </td>
                      </tr>
                      <tr className="border-b border-[#56577A]">
                        <td className="p-4 whitespace-nowrap text-sm font-normal text-white rounded-lg rounded-left">
                          Payment refund to{" "}
                          <span className="font-semibold">#00910</span>
                        </td>
                        <td className="p-4 whitespace-nowrap text-sm font-normal text-white">
                          Apr 23 ,2021
                        </td>
                        <td className="p-4 whitespace-nowrap text-sm font-semibold text-white">
                          -$670
                        </td>
                      </tr>
                      <tr className="border-b border-[#56577A]">
                        <td className="p-4 whitespace-nowrap text-sm font-normal text-white">
                          Payment failed from{" "}
                          <span className="font-semibold">#087651</span>
                        </td>
                        <td className="p-4 whitespace-nowrap text-sm font-normal text-white">
                          Apr 18 ,2021
                        </td>
                        <td className="p-4 whitespace-nowrap text-sm font-semibold text-white">
                          $234
                        </td>
                      </tr>
                      <tr className="border-b border-[#56577A]">
                        <td className="p-4 whitespace-nowrap text-sm font-normal text-white rounded-lg rounded-left">
                          Payment from{" "}
                          <span className="font-semibold">Lana Byrd</span>
                        </td>
                        <td className="p-4 whitespace-nowrap text-sm font-normal text-white">
                          Apr 15 ,2021
                        </td>
                        <td className="p-4 whitespace-nowrap text-sm font-semibold text-white">
                          $5000
                        </td>
                      </tr>
                      <tr className="border-b border-[#56577A]">
                        <td className="p-4 whitespace-nowrap text-sm font-normal text-white">
                          Payment from{" "}
                          <span className="font-semibold">Jese Leos</span>
                        </td>
                        <td className="p-4 whitespace-nowrap text-sm font-normal text-white">
                          Apr 15 ,2021
                        </td>
                        <td className="p-4 whitespace-nowrap text-sm font-semibold text-white">
                          $2300
                        </td>
                      </tr>
                      <tr className="border-b border-[#56577A]">
                        <td className="p-4 whitespace-nowrap text-sm font-normal text-white rounded-lg rounded-left">
                          Payment from{" "}
                          <span className="font-semibold">THEMESBERG LLC</span>
                        </td>
                        <td className="p-4 whitespace-nowrap text-sm font-normal text-white">
                          Apr 11 ,2021
                        </td>
                        <td className="p-4 whitespace-nowrap text-sm font-semibold text-white">
                          $560
                        </td>
                      </tr>
                      <tr className="border-b border-[#56577A]">
                        <td className="p-4 whitespace-nowrap text-sm font-normal text-white">
                          Payment from{" "}
                          <span className="font-semibold">Lana Lysle</span>
                        </td>
                        <td className="p-4 whitespace-nowrap text-sm font-normal text-white">
                          Apr 6 ,2021
                        </td>
                        <td className="p-4 whitespace-nowrap text-sm font-semibold text-white">
                          $1437
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
