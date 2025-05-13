"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import "flowbite/dist/flowbite.css";
import { Listbox } from "@headlessui/react";
import Link from "next/link";

const options = [
  { value: "", label: "Pilih" },
  { value: "low-price", label: "Harga Termurah" },
  { value: "nearest", label: "Terdekat" },
  { value: "high-price", label: "Harga Tertinggi" },
];

type Product = {
  id: number;
  item_id: number;
  user_id: number;
  seller?: { name: string };
  user?: {
    name: string;
    subdistrict: string;
    ward: string;
    regency: string;
    province: string;
  };
  product?: {
    id: number;
    name: string;
    price: number;
    image: string[];
    user_id: number;
    seller_name: string;
    subdistrict: string;
    seller: { name: string; subdistrict: string };
  };
};

type RawFavorite = Omit<Product, "product"> & {
  product: Omit<NonNullable<Product["product"]>, "image"> & {
    image: string; // ini masih dalam bentuk string JSON
  };
};

export default function Favorite() {
  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [selected, setSelected] = useState(options[0]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    const user_id = localStorage.getItem("id");
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://127.0.0.1:1031/api/v1/favorite/user/${user_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch favorites");
      }

      const data = await response.json();
      console.log(data);

      const parsedFavorites = data.data.map(
        (fav: RawFavorite): Product => ({
          ...fav,
          user: fav.user,
          product: {
            ...fav.product,
            image: JSON.parse(fav.product.image),
          },
        })
      );

      setProducts(parsedFavorites);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error fetching favorites:", error.message);
      } else {
        console.error("An unknown error occurred:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All categories");
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="items-center bg-[#080B2A] min-h-screen">
      <main>
        <Image
          width={100}
          height={100}
          alt=""
          src="/images/bubble.svg"
          className="h-[356px] w-[356px] max-lg:hidden absolute top-0 left-0"
        />
        <Image
          width={100}
          height={100}
          alt=""
          src="/images/bubble-2.svg"
          className="h-[356px] w-[356px] max-lg:hidden absolute top-0 right-0"
        />
        <Image
          width={100}
          height={100}
          alt=""
          src="/images/Star-1.svg"
          className="w-4 absolute top-28 max-lg:hidden right-8 -z-0"
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
          className="w-4 absolute top-44 max-lg:hidden left-10 -z-0"
        />
        <Image
          width={100}
          height={100}
          alt=""
          src="/images/Star-1.svg"
          className="w-4 absolute top-36 left-[550px] max-lg:hidden -z-0"
        />
        <div className="bg-white/5 pt-28 md:pb-20 max-lg:pb-10 w-full md:px-20 max-lg:px-6 flex flex-col items-center gap-6 relative">
          <div className="relative w-full">
            <Image
              width={600}
              height={400}
              alt="Hero About"
              src="/images/hero-product.jpg"
              className="rounded-2xl w-full h-64"
            />
            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-40 rounded-2xl z-20"></div>
            <h1 className="max-lg:text-5xl md:text-6xl tracking-wide text-white font-bold text-center absolute inset-0 flex justify-center items-center z-30">
              Favorite
            </h1>
          </div>
        </div>
        <div className="py-10 md:px-20 max-lg:px-6 flex justify-between items-center">
          <form className="w-full mx-auto relative">
            <div className="flex">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setDropdownOpen(!dropdownOpen);
                }}
                className="shrink-0 z-10 md:inline-flex hidden items-center py-2.5 px-4 text-base font-medium text-white bg-white/10 border border-blue-400 rounded-s-lg hover:bg-white/5"
                type="button"
              >
                {selectedCategory}
                <svg
                  className="w-2.5 h-2.5 ms-2.5"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>

              {dropdownOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute left-0 top-full mt-1 z-10 bg-black/60 border border-white divide-gray-100 rounded-lg shadow-sm w-44"
                >
                  <ul className="py-2 text-sm text-white">
                    {["Mockups", "Templates", "Design", "Logos"].map(
                      (category) => (
                        <li key={category}>
                          <button
                            type="button"
                            className="inline-flex w-full px-4 py-2 hover:bg-white/20"
                            onClick={() => {
                              setSelectedCategory(category);
                              setDropdownOpen(false);
                            }}
                          >
                            {category}
                          </button>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}
              <div className="relative w-full">
                <input
                  type="search"
                  className="block p-2.5 w-full z-20 text-base text-white bg-white/10 md:rounded-e-lg max-lg:rounded-lg border border-blue-400"
                  placeholder={`Search ${selectedCategory}...`}
                  required
                />
                <button
                  type="submit"
                  className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-blue-400 rounded-e-lg border border-blue-00 hover:bg-blue-500"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 20 20">
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </form>
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="text-blue-400 bg-primary-700 hover:bg-primary-800 font-medium rounded-lg text-sm ps-4 py-2.5 inline-flex items-center"
            >
              <svg
                className="w-6 h-6"
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
                  d="M18.796 4H5.204a1 1 0 0 0-.753 1.659l5.302 6.058a1 1 0 0 1 .247.659v4.874a.5.5 0 0 0 .2.4l3 2.25a.5.5 0 0 0 .8-.4v-7.124a1 1 0 0 1 .247-.659l5.302-6.059c.566-.646.106-1.658-.753-1.658Z"
                />
              </svg>
            </button>
            {open && (
              <div className="absolute z-10 w-72 p-4 right-0 top-10 bg-black/50 border border-white rounded-lg shadow-lg mt-2">
                <h6 className="mb-3 text-sm font-medium text-white">Filter</h6>
                <div className="mb-3">
                  <label className="text-sm font-medium text-white">
                    Upload Image
                  </label>
                  <input
                    type="file"
                    onChange={handleImageUpload}
                    className="mt-1 block w-full text-sm border bg-white/30 rounded-lg"
                  />
                </div>
                {image && (
                  <Image
                    src={image}
                    alt="Preview"
                    width={100}
                    height={100}
                    className="mt-2 rounded-lg"
                  />
                )}
                <div className="mb-3">
                  <label className="text-sm font-medium text-white">
                    Price
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="From"
                      value={priceFrom}
                      onChange={(e) => setPriceFrom(e.target.value)}
                      className="w-1/2 p-2 border rounded-lg placeholder-white text-white bg-white/30"
                    />
                    <input
                      type="number"
                      placeholder="To"
                      value={priceTo}
                      onChange={(e) => setPriceTo(e.target.value)}
                      className="w-1/2 p-2 border rounded-lg bg-white/30 placeholder-white text-white"
                    />
                  </div>
                </div>
                <div className="relative">
                  <Listbox value={selected} onChange={setSelected}>
                    <Listbox.Button className="w-full p-2 border rounded-lg text-white bg-white/30">
                      {selected.label}
                    </Listbox.Button>
                    <Listbox.Options className="absolute w-full bg-black/60 border border-white rounded-lg mt-1 shadow-lg">
                      {options.map((option) => (
                        <Listbox.Option
                          key={option.value}
                          value={option}
                          className="p-2 text-white hover:bg-blue-500 cursor-pointer"
                        >
                          {option.label}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Listbox>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="md:py-10 max-lg:pt-0 max-lg:pb-10 md:px-20 max-lg:px-6 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 md:gap-10 max-lg:gap-4 z-50">
            {currentProducts.map((item) => (
              <div
                key={item.id}
                className="w-full p-6 rounded-xl border_section shadow-lg bg-white/5 relative"
              >
                <div className="mb-4 flex justify-between items-center">
                  <div className="block">
                    <h3 className="text-white text-lg mb-1 font-bold">
                      {item.product?.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-white">
                        {item.product?.seller_name
                          ? item.product?.seller_name
                              .split(" ")
                              .map((word) => word.charAt(0))
                              .join("")
                              .toUpperCase()
                          : "?"}
                      </span>
                      <p className="text-blue-400 font-semibold">
                        {item.product?.seller_name || "Unknown Seller"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mb-5">
                  <Image
                    src={
                      item.product?.image[0]
                        ? `http://127.0.0.1:1031${item.product.image[0]}`
                        : "/images/default-item.png"
                    }
                    alt="product"
                    width={100}
                    height={100}
                    className="w-full h-96 object-cover rounded-2xl"
                  />
                </div>
                <div className="my-4 flex justify-between items-center">
                  <p className="text-blue-400 text-lg">
                    {item.product?.subdistrict}
                  </p>
                  <p className="text-blue-400 text-base">
                    {" "}
                    Rp {item.product?.price.toLocaleString("id-ID")}
                  </p>
                </div>
                <div className="w-full flex justify-between items-center gap-2 text-white">
                  <Link
                    href={`/buyer/product/${item.product?.id}`}
                    className="bg-[#15BFFD] px-6 py-3 text-center w-full text-white rounded-full hover:bg-transparent z-50 hover:text-[#15BFFD] hover:border-2 hover:border-[#15BFFD]"
                  >
                    Lihat Detail
                  </Link>
                  <Image
                    src="/images/heart-remove.svg"
                    width={100}
                    height={100}
                    alt=""
                    className="w-8 h-8 text-white"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-4 mt-10 items-center">
            <button
              onClick={handlePreviousPage}
              className="px-4 py-2 text-sm font-bold text-white bg-blue-400 rounded-md shadow hover:bg-blue-500 transition"
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="text-white font-semibold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              className="px-4 py-2 text-sm font-bold text-white bg-blue-400 rounded-md shadow hover:bg-blue-500 transition"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
