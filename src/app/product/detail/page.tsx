"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const products = [
  {
    id: 1,
    name: "Smart Watch",
    description: "High-quality smart watch with multiple features.",
    price: 199.99,
    images: [
      "/images/hero-1.jpg",
      "/images/hero-3.jpg",
      "/images/hero-1.jpg",
      "/images/hero-2.jpg",
      "/images/hero-1.jpg",
    ],
  },
];

const data = [
  {
    name: "James Watson",
    title: "Punk Art Collection",
    location: "Jakarta",
    image: "/images/hero-2.jpg",
    price: "60.000",
  },
  {
    name: "Anna Smith",
    title: "Modern Art Series",
    location: "Bali",
    image: "/images/hero-3.jpg",
    price: "50.000",
  },
  {
    name: "John Doe",
    title: "Abstract Art Pieces",
    location: "Surabaya",
    image: "/images/hero-4.jpg",
    price: "60.000",
  },
  {
    name: "James Watson",
    title: "Punk Art Collection",
    location: "Jakarta",
    image: "/images/hero-2.jpg",
    price: "60.000",
  },
  {
    name: "Anna Smith",
    title: "Modern Art Series",
    location: "Bali",
    image: "/images/hero-3.jpg",
    price: "60.000",
  },
  {
    name: "John Doe",
    title: "Abstract Art Pieces",
    location: "Surabaya",
    image: "/images/hero-4.jpg",
    price: "60.000",
  },
];

export default function ProductDetail() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const product = products[0];
  const [selectedImage, setSelectedImage] = useState(product.images[0]);

  return (
    <div className="bg-[#080B2A] min-h-screen flex flex-col items-center">
      <Image
        width={100}
        height={100}
        alt=""
        src="/images/bubble.svg"
        className="h-[356px] w-[356px] absolute top-0 left-0 -z-0 max-lg:hidden"
      />
      <Image
        width={100}
        height={100}
        alt=""
        src="/images/bubble-2.svg"
        className="h-[356px] w-[356px] absolute top-0 right-0 max-lg:hidden"
      />
      <Image
        width={100}
        height={100}
        alt=""
        src="/images/Star-1.svg"
        className="w-8 absolute top-28 max-lg:hidden right-26 -z-0"
      />
      <Image
        width={100}
        height={100}
        alt=""
        src="/images/Star-1.svg"
        className="w-4 absolute top-28 right-96 max-lg:hidden -z-0"
      />
      <Image
        width={100}
        height={100}
        alt=""
        src="/images/Star-1.svg"
        className="w-4 absolute top-[750px] left-56 max-lg:hidden -z-0"
      />
      <Image
        width={100}
        height={100}
        alt=""
        src="/images/Star-1.svg"
        className="w-4 absolute top-[700px] max-lg:hidden right-[300px] -z-0"
      />
      <div className="md:flex md:gap-10 gap-4 md:p-20 px-6 py-14 mt-10 h-auto">
        <div className="md:w-4/12 w-full z-40 max-lg:mb-4">
          <div className="h-96 rounded-lg overflow-hidden">
            <Image
              src={selectedImage}
              alt={product.name}
              width={600}
              height={600}
              className="w-full h-auto rounded-lg"
            />
          </div>
          <div className="grid grid-cols-5 gap-4 md:mt-6 mt-0">
            {product.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(img)}
                className={`border ${
                  selectedImage === img ? "border-blue-500" : "border-gray-300"
                } rounded-lg overflow-hidden`}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${index}`}
                  width={100}
                  height={100}
                  className="md:w-24 md:h-24 h-16 object-cover rounded-lg"
                />
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4 md:w-8/12 w-full block items-center relative">
          <div className="block">
            <h3 className="text-white text-xl mb-4 font-bold tracking-wide">
              Product Name
            </h3>
            <div className="flex items-center mb-8 gap-2">
              <span className="w-6 h-6 bg-gray-300 rounded-full"></span>
              <p className="text-blue-400 font-semibold">Alien</p>
            </div>
            <p className="text-base max-lg:text-justify">
              Contrary to popular belief, Lorem Ipsum is not simply random text.
              It has roots in a piece of classical Latin literature from 45 BC,
              making it over 2000 years old. Richard McClintock, a Latin
              professor at Hampden-Sydney College in Virginia, looked up one of
              the more obscure Latin words, consectetur, from a Lorem Ipsum
              passage, and going through the cites of the word in classical
              literature, discovered the undoubtable source.
            </p>
          </div>
          <div className="flex items-center gap-4 md:absolute max-lg:mt-4 max-lg:justify-end md:bottom-0 md:right-0">
            <Image
              src="/images/heart-remove.svg"
              width={100}
              height={100}
              alt=""
              className="w-8 h-8 text-white"
            />
            <Link
              href=""
              className="bg-[#15BFFD] px-6 py-3 text-center w-40 text-white rounded-full hover:bg-transparent z-50 hover:text-[#15BFFD] hover:border-2 hover:border-[#15BFFD]"
            >
              Beli
            </Link>
          </div>
        </div>
      </div>
      <div className="md:pb-20 pb-10 md:pt-10 pt-0 w-full px-6 md:px-20">
        <h1 className="text-5xl font-bold text-white mb-8 text-center">
          Similar Product
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 md:gap-10 gap-4 z-50">
          {data.map((item, index) => (
            <div
              key={index}
              className="w-full p-6 rounded-xl border_section shadow-lg bg-white/5 relative"
            >
              <div className="mb-4 flex justify-between items-center">
                <div className="block">
                  <h3 className="text-white text-lg mb-1 font-bold">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-gray-300 rounded-full"></span>
                    <p className="text-blue-400 font-semibold">{item.name}</p>
                  </div>
                </div>
              </div>
              <div className="mb-5">
                <Image
                  width={100}
                  height={100}
                  alt={item.title}
                  src={item.image}
                  className="w-full rounded-2xl"
                />
              </div>

              <div className="my-4 flex justify-between items-center">
                <p className="text-blue-400 text-lg">{item.location}</p>
                <p className="text-blue-400 text-base">{item.price}</p>
              </div>

              <div className="w-full flex justify-between items-center gap-2 text-white">
                <Link
                  href="/buyer/buy-product"
                  className="bg-[#15BFFD] px-6 py-3 text-center w-full text-white rounded-full hover:bg-transparent z-50 hover:text-[#15BFFD] hover:border-2 hover:border-[#15BFFD]"
                >
                  Beli
                </Link>
                <Image
                  src="/images/heart-add.svg"
                  width={100}
                  height={100}
                  alt=""
                  className="w-8 h-8 text-white"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="bg-[#15BFFD] hover:bg-blue-400 text-white p-4 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <Image
            width={100}
            height={100}
            alt=""
            src="/images/chat.svg"
            className="w-8 h-8"
          />
        </button>

        {isChatOpen && (
          <div className="mt-4 w-80 bg-white border_section rounded-2xl shadow-xl overflow-hidden animate-fade-in">
            <div className="bg-[#15BFFD] text-white px-4 py-3 font-semibold flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-gray-300 rounded-full"></span>
                <p className="text-white font-semibold">Alien</p>
              </div>
              <button onClick={() => setIsChatOpen(false)}>
                <svg
                  className="w-6 h-6 text-white"
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
                    d="M6 18 17.94 6M18 18 6.06 6"
                  />
                </svg>
              </button>
            </div>
            <div className="p-4 max-h-60 overflow-y-auto space-y-3 text-sm">
              <div className="text-gray-700 bg-gray-300 w-fit p-2 rounded-lg">
                Halo! Ada yang bisa kami bantu?
              </div>
              <div className="text-white bg-[#15BFFD] p-2 rounded-lg self-end text-right ml-auto w-fit">
                Ya, saya ingin tanya tentang produk.
              </div>
            </div>
            <div className="border-t px-4 py-2 bg-gray-50">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Tulis pesan..."
                  className="flex-grow px-3 py-2 text-sm border rounded-lg focus:outline-none"
                />
                <button
                  type="submit"
                  className="text-white bg-[#15BFFD] px-3 py-2 rounded-lg text-sm hover:bg-blue-400"
                >
                  Kirim
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
