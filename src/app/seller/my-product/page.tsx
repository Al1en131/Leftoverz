"use client";

import Image from "next/image";
import Link from "next/link";

export default function MyProduct() {
  const galleryData = [
    {
      id: 1,
      image: "/images/hero-1.jpg",
      name: "Apple Watch Series 4",
      category: "Digital Product",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit ...",
      location: "New York",
      price: "20.000",
      status: "Sold Out",
    },
    {
      id: 2,
      image: "/images/hero-2.jpg",
      name: "Apple Watch Series 4",
      category: "Digital Product",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit ...",
      location: "New York",
      price: "20.000",
      status: "Available",
    },
    {
      id: 3,
      image: "/images/hero-1.jpg",
      name: "Apple Watch Series 4",
      category: "Digital Product",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit ...",
      location: "New York",
      price: "20.000",
      status: "Available",
    },
    {
      id: 4,
      image: "/images/hero-2.jpg",
      name: "Apple Watch Series 4",
      category: "Digital Product",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit ...",
      location: "New York",
      price: "20.000",
      status: "Available",
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
          className="w-4 absolute top-28 right-8 max-lg:hidden -z-0"
        />
        <Image
          width={100}
          height={100}
          alt=""
          src="/images/Star-1.svg"
          className="w-4 absolute top-[400px] max-lg:hidden right-32 -z-0"
        />
        <Image
          width={100}
          height={100}
          alt=""
          src="/images/Star-1.svg"
          className="w-4 absolute top-44 left-10 max-lg:hidden -z-0"
        />
        <Image
          width={100}
          height={100}
          alt=""
          src="/images/Star-1.svg"
          className="w-4 absolute top-36 left-[550px] max-lg:hidden -z-0"
        />
        <div className="bg-white/5 pt-28 pb-20 w-full lg:px-20 max-lg:px-6 flex flex-col items-center gap-6 relative">
          <div className="relative w-full">
            <Image
              width={600}
              height={400}
              alt="Hero About"
              src="/images/hero-product.jpg"
              className="rounded-2xl w-full h-64"
            />
            <div className="absolute top-0 left-0 w-full h-full bg-black/50 backdrop-blur-md rounded-2xl flex flex-col justify-center max-lg:p-6 md:ps-20 gap-2 text-white z-40">
              <h1 className="lg:text-6xl max-lg:text-4xl font-bold">Product</h1>
              <p className="max-lg:text-base md:text-lg max-w-3xl">
                Contrary to popular belief, Lorem Ipsum is not simply random
                text. It has roots in a piece of classical Latin literature from
                45 BC, making it over 2000 years old.
              </p>
            </div>
          </div>
        </div>

        <div className="py-10 lg:px-20 max-lg:px-6 lg:flex lg:justify-between max-lg:space-y-4 items-center gap-4">
          <form className="lg:w-10/12 max-lg:w-full">
            <label className="mb-2 text-sm font-medium text-white sr-only">
              Search
            </label>
            <div className="relative">
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
              <input
                type="search"
                id="default-search"
                className="block w-full p-4 ps-10 text-sm text-white border border-blue-400 rounded-lg bg-white/10"
                placeholder="Search Mockups, Logos..."
                required
              />
            </div>
          </form>

          <div className="lg:w-2/12 max-lg:w-full lg:flex lg:justify-end">
            <Link
              href="/seller/my-product/add"
              className="bg-blue-400 text-white font-medium rounded-lg p-4 w-full flex items-center justify-center gap-2 shadow-md hover:bg-blue-500 transition-all"
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
              Add Product
            </Link>
          </div>
        </div>

        <div className="relative overflow-x-auto lg:px-20 max-lg:px-6 pb-10 shadow-lg rounded-lg">
          <table className="w-full border border-blue-400 rounded-lg max-lg:px-6 overflow-hidden">
            <thead className="bg-white/10 text-white text-md">
              <tr className="border-b">
                <th className="px-6 py-3 text-left">Image</th>
                <th className="px-6 py-3 text-left">Product Name</th>
                <th className="px-6 py-3 text-left">Category</th>
                <th className="px-6 py-3 text-left">Description</th>
                <th className="px-6 py-3 text-left">Location</th>
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
                  <td className="px-6 py-4 text-white">{item.category}</td>
                  <td className="px-6 py-4 text-white">{item.description}</td>
                  <td className="px-6 py-4 text-white">{item.location}</td>
                  <td className="px-6 py-4 text-white">Rp. {item.price}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-4 py-2 text-sm tracking-wide font-semibold rounded-full ${
                        item.status === "Available"
                          ? "bg-green-700 text-white"
                          : "bg-red-700 text-white"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 flex justify-center space-x-2">
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
      </main>
    </div>
  );
}
