"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import "flowbite/dist/flowbite.css";
import { Listbox } from "@headlessui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const options = [
  { value: "", label: "Pilih" },
  { value: "low-price", label: "Harga Termurah" },
  { value: "nearest", label: "Terdekat" },
  { value: "high-price", label: "Harga Tertinggi" },
];

type Product = {
  id: number;
  name: string;
  email: string;
  no_hp: string;
  role: string;
  image: string[];
  description: string;
  price: number;
  status: string;
  user_id: number;
  seller?: { name: string };
  user?: { subdistrict: string };
};

export default function Product() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [selected, setSelected] = useState(options[0]);
  const [loading, setLoading] = useState(true);

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

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://127.0.0.1:1031/api/v1/allproducts", {
        method: "GET",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch products");
      }

      const data = await response.json();
      console.log(data);

      const parsedProducts = data.products
        .filter((product: Product) => product.status === "available")
        .map((product: Product) => {
          let parsedImage: string[] = [];

          if (typeof product.image === "string") {
            try {
              const parsed = JSON.parse(product.image);
              if (Array.isArray(parsed)) {
                parsedImage = parsed;
              }
            } catch {
              parsedImage = [];
            }
          } else if (Array.isArray(product.image)) {
            parsedImage = product.image;
          }

          return {
            ...product,
            image: parsedImage,
            seller_name: product.seller?.name || "Unknown",
            subdistrict: product.user?.subdistrict || "Unknown",
          };
        });

      setProducts(parsedProducts);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error fetching products:", error.message);
      } else {
        console.error("An unknown error occurred:", error);
      }
    } finally {
      setLoading(false);
    }
  };

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

  const [favorites, setFavorites] = useState<number[]>([]);
  const [favoritesLoading, setFavoritesLoading] = useState(true);

  const fetchFavorites = async () => {
    const userId = localStorage.getItem("id");
    const token = localStorage.getItem("token");

    if (!userId || isNaN(Number(userId))) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:1031/api/v1/favorite/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (response.ok && data && data.data) {
        console.log("Data favorit diterima:", data.data);

        // Ambil ID produk dari objek product di dalam masing-masing item
        const favoriteIds = data.data
          .map((item: any) => Number(item.product?.id)) // pastikan number
          .filter(Boolean);

        console.log("Favorite IDs:", favoriteIds);
        setFavorites(favoriteIds);
        localStorage.setItem("favorites", JSON.stringify(favoriteIds));
      } else {
        console.error("Gagal mengambil data favorit atau data tidak valid.");
        setFavorites([]);
      }
    } catch (error) {
      console.error("Fetch favorite error:", error);
      setFavorites([]);
    } finally {
      setFavoritesLoading(false);
    }
  };

  useEffect(() => {
    const savedFavorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
    const validFavorites = savedFavorites
      .filter(Boolean)
      .map((id: any) => Number(id)); // pastikan number
    setFavorites(validFavorites);
  }, []);

  const handleAddFavorite = async (productId: number) => {
    const userId = localStorage.getItem("id");
    const token = localStorage.getItem("token");

    if (!userId || isNaN(Number(userId)))
      return alert("User belum login atau ID tidak valid.");

    const userIdNumber = parseInt(userId, 10);
    const isFavorited = favorites.includes(productId);

    try {
      if (isFavorited) {
        const response = await fetch(
          "http://127.0.0.1:1031/api/v1/favorite/delete",
          {
            method: "DELETE", // ⚠️ gunakan POST bukan DELETE
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ user_id: userIdNumber, item_id: productId }),
          }
        );

        if (response.ok) {
          const updatedFavorites = favorites.filter((id) => id !== productId);
          setFavorites(updatedFavorites);
          localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
          setSuccessMessage("Produk berhasil dihapus dari favorit!");
          setShowSuccessPopup(true);
        } else {
          setErrorMessage("Gagal menghapus produk dari favorit.");
          setShowErrorPopup(true);
        }
      } else {
        const response = await fetch(
          "http://127.0.0.1:1031/api/v1/favorite/create",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ user_id: userIdNumber, item_id: productId }),
          }
        );

        if (response.ok) {
          const updatedFavorites = [...favorites, productId];
          setFavorites(updatedFavorites);
          localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
          setSuccessMessage("Produk berhasil ditambahkan ke favorit!");
          setShowSuccessPopup(true);
        } else {
          setErrorMessage("Gagal menambahkan produk ke favorit.");
          setShowErrorPopup(true);
        }
      }
    } catch (error) {
      console.error("Favorit error:", error);
      setErrorMessage("Terjadi kesalahan saat mengubah status favorit.");
      setShowErrorPopup(true);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchFavorites();
  }, []);

  const handleClosePopup = () => {
    setShowErrorPopup(false);
  };
  const handleCloseSuccessPopup = async () => {
    setShowSuccessPopup(false);
    await fetchFavorites(); // Perbarui data favorit
    router.push("/buyer/favorite");
  };

  useEffect(() => {
    const refreshFavorites = () => {
      fetchFavorites();
    };

    window.addEventListener("focus", refreshFavorites); // <-- ini penting

    return () => {
      window.removeEventListener("focus", refreshFavorites);
    };
  }, []);

  useEffect(() => {
    console.log("Favorites updated:", favorites);
  }, [favorites]);

  if (loading || favoritesLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="items-center bg-[#080B2A] min-h-screen">
      <main>
        {showSuccessPopup && (
          <div className="fixed inset-0 bg-black/55 flex items-center justify-center z-50">
            <div className="bg-[#080B2A] border-blue-400 border z-50 rounded-lg py-8 px-14 shadow-lg text-center">
              <div className="flex justify-center mb-4">
                <Image
                  src="/images/succes.svg"
                  width={80}
                  height={80}
                  alt="Success"
                  className="w-20 h-20"
                />
              </div>
              <h2 className="text-2xl font-bold mb-1 text-blue-400">
                Success!
              </h2>
              <p className="mb-6 text-blue-400">{successMessage}</p>
              <button
                onClick={handleCloseSuccessPopup}
                className="bg-blue-400 hover:bg-blue-500 text-white font-semibold py-2 px-6 rounded-full"
              >
                OK
              </button>
            </div>
          </div>
        )}
        {showErrorPopup && (
          <div className="fixed inset-0 bg-black/55 flex items-center justify-center z-50">
            <div className="bg-[#080B2A] border-red-400 border rounded-lg py-8 px-14 shadow-lg text-center">
              <div className="flex justify-center mb-4">
                <Image
                  src="/images/error.svg"
                  width={80}
                  height={80}
                  alt="Error"
                  className="w-20 h-20"
                />
              </div>
              <h2 className="text-2xl font-bold mb-1 text-red-400">Error!</h2>
              <p className="mb-6 text-red-400">{errorMessage}</p>
              <button
                onClick={handleClosePopup}
                className="bg-red-400 hover:bg-red-500 text-white font-semibold py-2 px-6 rounded-full"
              >
                OK
              </button>
            </div>
          </div>
        )}
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
              Product
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
            {currentProducts.map((product) => (
              <div
                key={product.id}
                className="w-full p-6 rounded-xl border_section shadow-lg bg-white/5 relative"
              >
                <div className="mb-4 flex justify-between items-center">
                  <div className="block">
                    <h3 className="text-white text-lg mb-1 font-bold">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-white">
                        {product.seller?.name
                          ? product.seller.name
                              .split(" ")
                              .map((word) => word.charAt(0))
                              .join("")
                              .toUpperCase()
                          : "?"}
                      </span>
                      <p className="text-blue-400 font-semibold">
                        {product.seller?.name || "Unknown Seller"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mb-5">
                  <Image
                    src={
                      product.image &&
                      Array.isArray(product.image) &&
                      product.image.length > 0 &&
                      typeof product.image[0] === "string" &&
                      product.image[0].startsWith("/")
                        ? `http://127.0.0.1:1031${product.image[0]}`
                        : "/images/default-product.png"
                    }
                    alt={product.name}
                    width={100}
                    height={100}
                    className="w-full md:h-80 max-lg:h-72 object-cover rounded-2xl"
                  />
                </div>
                <div className="my-4 flex justify-between items-center">
                  <p className="text-blue-400 text-lg">
                    {product.user?.subdistrict}
                  </p>
                  <p className="text-blue-400 text-base">
                    {" "}
                    Rp {product.price.toLocaleString("id-ID")}
                  </p>
                </div>
                <div className="w-full flex justify-between items-center gap-2 text-white">
                  <Link
                    href={`/buyer/product/${product.id}`}
                    className="bg-[#15BFFD] px-6 py-3 text-center w-full text-white rounded-full hover:bg-transparent z-40 hover:text-[#15BFFD] hover:border-2 hover:border-[#15BFFD]"
                  >
                    Detail
                  </Link>
                  <button
                    className="z-50"
                    onClick={() => handleAddFavorite(product.id)}
                    aria-label={
                      favorites.includes(Number(product.id))
                        ? "Hapus dari favorit"
                        : "Tambahkan ke favorit"
                    }
                  >
                    <Image
                      src={
                        favorites.includes(Number(product.id))
                          ? "/images/heart-remove.svg"
                          : "/images/heart-add.svg"
                      }
                      width={32}
                      height={32}
                      alt={
                        favorites.includes(Number(product.id))
                          ? "Produk difavoritkan"
                          : "Produk belum difavoritkan"
                      }
                      className="w-8 h-8 hover:scale-110 transition"
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-4 mt-10 items-center">
            <button
              onClick={handlePreviousPage}
              className="px-4 py-2 text-sm font-bold text-white bg-blue-500 rounded-md shadow hover:bg-blue-600 transition"
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="text-white font-semibold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              className="px-4 py-2 text-sm font-bold text-white bg-blue-500 rounded-md shadow hover:bg-blue-600 transition"
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
