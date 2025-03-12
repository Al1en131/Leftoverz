"use client";

import Image from "next/image";
import Link from "next/link";

export default function Transaction() {
  const galleryData = [
    {
      id: 1,
      image: "/images/hero-1.jpg",
      name: "Apple Watch Series 4",
      buyer: "John",
      payment: "COD",
      price: "20.000",
      status: "Paid",
    },
    {
      id: 1,
      image: "/images/hero-1.jpg",
      name: "Apple Watch Series 4",
      buyer: "John",
      payment: "Gopay",
      price: "20.000",
      status: "Paid",
    },
    {
      id: 1,
      image: "/images/hero-1.jpg",
      name: "Apple Watch Series 4",
      buyer: "John",
      payment: "Bri",
      price: "20.000",
      status: "Paid",
    },
    {
      id: 1,
      image: "/images/hero-1.jpg",
      name: "Apple Watch Series 4",
      buyer: "John",
      payment: "COD",
      price: "20.000",
      status: "Unpaid",
    },
  ];

  return (
    <div className="items-center bg-[#080B2A] min-h-screen">
      <main>
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
          src="/images/bubble-2.svg"
          className="h-[356px] w-[356px] absolute top-0 right-0"
        />
        <Image
          width={100}
          height={100}
          alt=""
          src="/images/Star-1.svg"
          className="w-4 absolute top-28 right-8 -z-0"
        />
        <Image
          width={100}
          height={100}
          alt=""
          src="/images/Star-1.svg"
          className="w-4 absolute top-[400px] right-32 -z-0"
        />
        <Image
          width={100}
          height={100}
          alt=""
          src="/images/Star-1.svg"
          className="w-4 absolute top-44 left-10 -z-0"
        />
        <Image
          width={100}
          height={100}
          alt=""
          src="/images/Star-1.svg"
          className="w-4 absolute top-36 left-[550px] -z-0"
        />
        <div className="bg-white/5 pt-28 pb-20 w-full px-20 flex flex-col items-center gap-6 relative">
          <div className="relative w-full">
            {/* Hero Image */}
            <Image
              width={600}
              height={400}
              alt="Hero About"
              src="/images/hero-product.jpg"
              className="rounded-2xl w-full h-64"
            />

            {/* Overlay */}
            <div className="absolute top-0 left-0 w-full h-full bg-black/50 backdrop-blur-md rounded-2xl flex flex-col justify-center ps-10 md:ps-20 gap-2 text-white z-40">
              <h1 className="text-6xl font-bold">Transaction</h1>
              <p className="text-base md:text-lg max-w-3xl">
                Contrary to popular belief, Lorem Ipsum is not simply random
                text. It has roots in a piece of classical Latin literature from
                45 BC, making it over 2000 years old.
              </p>
            </div>
          </div>
        </div>

        <div className="py-10 px-20 flex justify-between items-center gap-4">
          {/* Search Form */}
          <form className="w-full">
            <label className="mb-2 text-sm font-medium text-white sr-only">
              Search
            </label>
            <div className="relative">
              {/* Search Icon */}
              <div className="absolute inset-y-0 start-0 flex items-center ps-3">
                <svg
                  className="w-4 h-4 text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              {/* Search Input */}
              <input
                type="search"
                id="default-search"
                className="block w-full p-4 ps-10 text-sm text-white border border-blue-400 rounded-lg bg-white/10"
                placeholder="Search Mockups, Logos..."
                required
              />
            </div>
          </form>
        </div>

        <div className="relative overflow-x-auto px-20 pb-10 shadow-lg rounded-lg">
          <table className="w-full border border-blue-400 rounded-lg overflow-hidden">
            {/* Header */}
            <thead className="bg-white/10 text-white text-md">
              <tr className="border-b">
                <th className="px-6 py-3 text-left">Image</th>
                <th className="px-6 py-3 text-left">Product Name</th>
                <th className="px-6 py-3 text-left">Buyer</th>
                <th className="px-6 py-3 text-left">Payment Method</th>
                <th className="px-6 py-3 text-left">Price</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-center">Action</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {galleryData.map((item) => (
                <tr key={item.id} className="border-b bg-white/10 transition">
                  <td className="px-6 py-4 justify-center">
                    <Image
                      src={item.image}
                      width={60}
                      height={60}
                      alt="Gallery Image"
                      className="rounded-lg shadow-md"
                    />
                  </td>
                  <td className="px-6 py-4 text-white">{item.name}</td>
                  <td className="px-6 py-4 text-white">{item.buyer}</td>
                  <td className="px-6 py-4 text-white">{item.payment}</td>
                  <td className="px-6 py-4 text-white">Rp. {item.price}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-4 py-2 text-sm tracking-wide font-semibold rounded-full ${
                        item.status === "Paid"
                          ? "bg-green-700 text-white"
                          : "bg-red-700 text-white"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex justify-center space-x-2">
                    <Link
                      href={``}
                      className="px-4 py-2 text-sm font-bold text-white bg-blue-500 rounded-md shadow hover:bg-blue-600 transition"
                    >
                      Edit
                    </Link>

                    {/* Delete Button */}
                    <button className="px-4 py-2 text-sm font-bold text-white bg-red-500 rounded-md shadow hover:bg-red-600 transition">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
