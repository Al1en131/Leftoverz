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
  const product = products[0];
  const [selectedImage, setSelectedImage] = useState(product.images[0]);

  return (
    <div className="bg-[#080B2A] min-h-screen flex flex-col items-center">
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
        className="w-4 absolute top-[750px] left-56 -z-0"
      />
      <Image
        width={100}
        height={100}
        alt=""
        src="/images/Star-1.svg"
        className="w-4 absolute top-[700px] right-[300px] -z-0"
      />
      <div className="flex gap-10 p-20 mt-10 h-auto">
        <div className="w-4/12 z-40">
          {" "}
          <div className="h-96 rounded-lg overflow-hidden">
            <Image
              src={selectedImage}
              alt={product.name}
              width={600}
              height={600}
              className="w-full h-auto rounded-lg"
            />
          </div>
          <div className="grid grid-cols-5 gap-4 mt-6">
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
                  className="w-24 h-24 object-cover rounded-lg"
                />
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4 w-8/12 block items-center relative">
          <div className="block">
            <h3 className="text-white text-xl mb-4 font-bold tracking-wide">
              Product Name
            </h3>
            <div className="flex items-center mb-8 gap-2">
              <span className="w-6 h-6 bg-gray-300 rounded-full"></span>
              <p className="text-blue-400 font-semibold">Alien</p>
            </div>
            <p className="text-base">
              Contrary to popular belief, Lorem Ipsum is not simply random text.
              It has roots in a piece of classical Latin literature from 45 BC,
              making it over 2000 years old. Richard McClintock, a Latin
              professor at Hampden-Sydney College in Virginia, looked up one of
              the more obscure Latin words, consectetur, from a Lorem Ipsum
              passage, and going through the cites of the word in classical
              literature, discovered the undoubtable source.
            </p>
          </div>
          <div className="flex items-center gap-4 absolute bottom-0 right-0">
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
      <div className="pb-20 pt-10 w-full px-20">
        <h1 className="text-5xl font-bold text-white mb-8 text-center">
          Similar Product
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 z-50">
          {data.map((item, index) => (
            <div
              key={index}
              className="w-full p-6 rounded-xl border_section shadow-lg bg-white/5 relative"
            >
              {/* Bagian Atas */}
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

              {/* Bagian Bawah */}
              <div className="my-4 flex justify-between items-center">
                <p className="text-blue-400 text-lg">{item.location}</p>
                <p className="text-blue-400 text-base">{item.price}</p>
              </div>

              {/* Tombol Beli */}
              <div className="w-full flex justify-between items-center gap-2 text-white">
                <Link
                  href=""
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
    </div>
  );
}
