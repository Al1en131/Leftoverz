"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import "flowbite/dist/flowbite.css";
import { Listbox } from "@headlessui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

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
  phone_number: string;
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
  const { theme, setTheme } = useTheme();
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme && storedTheme !== theme) {
      setTheme(storedTheme);
    }
  }, []);

  // Fungsi untuk toggle tema
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

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
    <div
      className={`items-center ${
        theme === "dark" ? "dark:bg-[#080B2A]" : "bg-white"
      } min-h-screen`}
    >
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
          className={`
        lg:h-[356px] lg:w-[356px]
        ${theme === "dark" ? "block" : "hidden"}
        max-lg:w-52 max-lg:h-72 absolute top-0 left-0
      `}
        />
        <Image
          width={100}
          height={100}
          alt=""
          src="/images/bubble-2.svg"
          className={`
        lg:h-[356px] lg:w-[356px]
        ${theme === "dark" ? "block" : "hidden"}
        max-lg:w-52 max-lg:h-72 absolute top-0 right-0
      `}
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
        <div
          className={`
  pt-28 lg:pb-20 max-lg:pb-10 w-full lg:px-20 max-lg:px-6
  flex flex-col items-center gap-6 relative
  ${theme === "dark" ? "bg-white/5" : "bg-black/10"}
`}
        >
          <div className="relative w-full">
            <Image
              width={600}
              height={400}
              alt="Hero About"
              src="/images/hero-product.jpg"
              className="rounded-2xl w-full h-64"
            />
            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-40 rounded-2xl z-20"></div>
            <h1 className="max-lg:text-5xl lg:text-6xl tracking-wide text-white font-bold text-center absolute inset-0 flex justify-center items-center z-30">
              Product
            </h1>
          </div>
        </div>
        <div className="py-10 lg:px-20 max-lg:px-6 flex justify-between items-center">
          <form className="w-full mx-auto relative">
            <div className="flex">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setDropdownOpen(!dropdownOpen);
                }}
                className="shrink-0 z-10 lg:inline-flex hidden items-center py-2.5 px-4 text-base font-medium text-white bg-white/10 border border-blue-400 rounded-s-lg hover:bg-white/5"
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
                  className="block p-2.5 w-full z-20 text-base text-white bg-white/10 lg:rounded-e-lg max-lg:rounded-lg border border-blue-400"
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
              className="text-blue-400 font-medium rounded-lg text-sm ps-4 py-2.5 inline-flex items-center"
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
        <div className="lg:py-10 max-lg:pt-0 max-lg:pb-10 lg:px-20 max-lg:px-6 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10 max-lg:gap-4 z-50">
            {currentProducts.map((product) => (
              <div
                key={product.id}
                className="w-full p-6 rounded-xl border_section shadow-lg bg-white/5 relative"
              >
                <div className="mb-4 flex justify-between items-center">
                  <div className="block">
                    <h3
                      className={`text-lg mb-1 font-bold ${
                        theme === "dark" ? "text-white" : "text-blue-400"
                      }`}
                    >
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
                    className={`w-full lg:h-80 max-lg:h-72 object-cover rounded-2xl ${
                      theme === "dark" ? "" : "border-2 border-blue-400"
                    }`}
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
                    className="bg-blue-400 px-6 py-3 text-center w-full text-white rounded-full hover:bg-transparent z-40 hover:text-blue-400 hover:border-2 hover:border-blue-400"
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
              className="px-4 py-2 text-sm font-bold text-white bg-blue-400 rounded-md shadow hover:bg-blue-500 transition"
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span
              className={`font-semibold ${
                theme === "dark" ? "text-white" : "text-blue-400"
              }`}
            >
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
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          title="Toggle theme"
          className={`
  fixed bottom-6 lg:right-20 max-md:right-8 z-50 p-2 rounded-full bg-blue-400
  ${
    theme === "dark"
      ? "text-white border border-white"
      : "text-[#080B2A] border border-[#080B2A]"
  }
`}
        >
          {theme === "dark" ? (
            <svg
              role="graphics-symbol"
              viewBox="0 0 15 15"
              width="15"
              height="15"
              fill="none"
              className={`${theme === "dark" ? "block" : "hidden"} w-7 h-7`}
            >
              <path
                d="M2.89998 0.499976C2.89998 0.279062 2.72089 0.0999756 2.49998 0.0999756C2.27906 0.0999756 2.09998 0.279062 2.09998 0.499976V1.09998H1.49998C1.27906 1.09998 1.09998 1.27906 1.09998 1.49998C1.09998 1.72089 1.27906 1.89998 1.49998 1.89998H2.09998V2.49998C2.09998 2.72089 2.27906 2.89998 2.49998 2.89998C2.72089 2.89998 2.89998 2.72089 2.89998 2.49998V1.89998H3.49998C3.72089 1.89998 3.89998 1.72089 3.89998 1.49998C3.89998 1.27906 3.72089 1.09998 3.49998 1.09998H2.89998V0.499976ZM5.89998 3.49998C5.89998 3.27906 5.72089 3.09998 5.49998 3.09998C5.27906 3.09998 5.09998 3.27906 5.09998 3.49998V4.09998H4.49998C4.27906 4.09998 4.09998 4.27906 4.09998 4.49998C4.09998 4.72089 4.27906 4.89998 4.49998 4.89998H5.09998V5.49998C5.09998 5.72089 5.27906 5.89998 5.49998 5.89998C5.72089 5.89998 5.89998 5.72089 5.89998 5.49998V4.89998H6.49998C6.72089 4.89998 6.89998 4.72089 6.89998 4.49998C6.89998 4.27906 6.72089 4.09998 6.49998 4.09998H5.89998V3.49998ZM1.89998 6.49998C1.89998 6.27906 1.72089 6.09998 1.49998 6.09998C1.27906 6.09998 1.09998 6.27906 1.09998 6.49998V7.09998H0.499976C0.279062 7.09998 0.0999756 7.27906 0.0999756 7.49998C0.0999756 7.72089 0.279062 7.89998 0.499976 7.89998H1.09998V8.49998C1.09998 8.72089 1.27906 8.89997 1.49998 8.89997C1.72089 8.89997 1.89998 8.72089 1.89998 8.49998V7.89998H2.49998C2.72089 7.89998 2.89998 7.72089 2.89998 7.49998C2.89998 7.27906 2.72089 7.09998 2.49998 7.09998H1.89998V6.49998ZM8.54406 0.98184L8.24618 0.941586C8.03275 0.917676 7.90692 1.1655 8.02936 1.34194C8.17013 1.54479 8.29981 1.75592 8.41754 1.97445C8.91878 2.90485 9.20322 3.96932 9.20322 5.10022C9.20322 8.37201 6.82247 11.0878 3.69887 11.6097C3.45736 11.65 3.20988 11.6772 2.96008 11.6906C2.74563 11.702 2.62729 11.9535 2.77721 12.1072C2.84551 12.1773 2.91535 12.2458 2.98667 12.3128L3.05883 12.3795L3.31883 12.6045L3.50684 12.7532L3.62796 12.8433L3.81491 12.9742L3.99079 13.089C4.11175 13.1651 4.23536 13.2375 4.36157 13.3059L4.62496 13.4412L4.88553 13.5607L5.18837 13.6828L5.43169 13.7686C5.56564 13.8128 5.70149 13.8529 5.83857 13.8885C5.94262 13.9155 6.04767 13.9401 6.15405 13.9622C6.27993 13.9883 6.40713 14.0109 6.53544 14.0298L6.85241 14.0685L7.11934 14.0892C7.24637 14.0965 7.37436 14.1002 7.50322 14.1002C11.1483 14.1002 14.1032 11.1453 14.1032 7.50023C14.1032 7.25044 14.0893 7.00389 14.0623 6.76131L14.0255 6.48407C13.991 6.26083 13.9453 6.04129 13.8891 5.82642C13.8213 5.56709 13.7382 5.31398 13.6409 5.06881L13.5279 4.80132L13.4507 4.63542L13.3766 4.48666C13.2178 4.17773 13.0353 3.88295 12.8312 3.60423L12.6782 3.40352L12.4793 3.16432L12.3157 2.98361L12.1961 2.85951L12.0355 2.70246L11.8134 2.50184L11.4925 2.24191L11.2483 2.06498L10.9562 1.87446L10.6346 1.68894L10.3073 1.52378L10.1938 1.47176L9.95488 1.3706L9.67791 1.2669L9.42566 1.1846L9.10075 1.09489L8.83599 1.03486L8.54406 0.98184ZM10.4032 5.30023C10.4032 4.27588 10.2002 3.29829 9.83244 2.40604C11.7623 3.28995 13.1032 5.23862 13.1032 7.50023C13.1032 10.593 10.596 13.1002 7.50322 13.1002C6.63646 13.1002 5.81597 12.9036 5.08355 12.5522C6.5419 12.0941 7.81081 11.2082 8.74322 10.0416C8.87963 10.2284 9.10028 10.3497 9.34928 10.3497C9.76349 10.3497 10.0993 10.0139 10.0993 9.59971C10.0993 9.24256 9.84965 8.94373 9.51535 8.86816C9.57741 8.75165 9.63653 8.63334 9.6926 8.51332C9.88358 8.63163 10.1088 8.69993 10.35 8.69993C11.0403 8.69993 11.6 8.14028 11.6 7.44993C11.6 6.75976 11.0406 6.20024 10.3505 6.19993C10.3853 5.90487 10.4032 5.60464 10.4032 5.30023Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
          ) : (
            <svg
              role="graphics-symbol"
              viewBox="0 0 15 15"
              width="15"
              height="15"
              fill="none"
              className={`${theme === "dark" ? "hidden" : "block"} w-7 h-7`}
            >
              <path
                d="M7.5 0C7.77614 0 8 0.223858 8 0.5V2.5C8 2.77614 7.77614 3 7.5 3C7.22386 3 7 2.77614 7 2.5V0.5C7 0.223858 7.22386 0 7.5 0ZM2.1967 2.1967C2.39196 2.00144 2.70854 2.00144 2.90381 2.1967L4.31802 3.61091C4.51328 3.80617 4.51328 4.12276 4.31802 4.31802C4.12276 4.51328 3.80617 4.51328 3.61091 4.31802L2.1967 2.90381C2.00144 2.70854 2.00144 2.39196 2.1967 2.1967ZM0.5 7C0.223858 7 0 7.22386 0 7.5C0 7.77614 0.223858 8 0.5 8H2.5C2.77614 8 3 7.77614 3 7.5C3 7.22386 2.77614 7 2.5 7H0.5ZM2.1967 12.8033C2.00144 12.608 2.00144 12.2915 2.1967 12.0962L3.61091 10.682C3.80617 10.4867 4.12276 10.4867 4.31802 10.682C4.51328 10.8772 4.51328 11.1938 4.31802 11.3891L2.90381 12.8033C2.70854 12.9986 2.39196 12.9986 2.1967 12.8033ZM12.5 7C12.2239 7 12 7.22386 12 7.5C12 7.77614 12.2239 8 12.5 8H14.5C14.7761 8 15 7.77614 15 7.5C15 7.22386 14.7761 7 14.5 7H12.5ZM10.682 4.31802C10.4867 4.12276 10.4867 3.80617 10.682 3.61091L12.0962 2.1967C12.2915 2.00144 12.608 2.00144 12.8033 2.1967C12.9986 2.39196 12.9986 2.70854 12.8033 2.90381L11.3891 4.31802C11.1938 4.51328 10.8772 4.51328 10.682 4.31802ZM8 12.5C8 12.2239 7.77614 12 7.5 12C7.22386 12 7 12.2239 7 12.5V14.5C7 14.7761 7.22386 15 7.5 15C7.77614 15 8 14.7761 8 14.5V12.5ZM10.682 10.682C10.8772 10.4867 11.1938 10.4867 11.3891 10.682L12.8033 12.0962C12.9986 12.2915 12.9986 12.608 12.8033 12.8033C12.608 12.9986 12.2915 12.9986 12.0962 12.8033L10.682 11.3891C10.4867 11.1938 10.4867 10.8772 10.682 10.682ZM5.5 7.5C5.5 6.39543 6.39543 5.5 7.5 5.5C8.60457 5.5 9.5 6.39543 9.5 7.5C9.5 8.60457 8.60457 9.5 7.5 9.5C6.39543 9.5 5.5 8.60457 5.5 7.5ZM7.5 4.5C5.84315 4.5 4.5 5.84315 4.5 7.5C4.5 9.15685 5.84315 10.5 7.5 10.5C9.15685 10.5 10.5 9.15685 10.5 7.5C10.5 5.84315 9.15685 4.5 7.5 4.5Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
          )}
        </button>
      </main>
    </div>
  );
}
