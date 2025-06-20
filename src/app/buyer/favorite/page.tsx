"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import "flowbite/dist/flowbite.css";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

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
    status: string;
    seller: { name: string; subdistrict: string };
  };
};

type RawFavorite = Omit<Product, "product"> & {
  product: Omit<NonNullable<Product["product"]>, "image"> & {
    image: string;
  };
};

export default function Favorite() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Product | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("id");
    if (storedUserId) setUserId(storedUserId);
  }, []);

  const fetchFavorites = async () => {
    const user_id = localStorage.getItem("id");
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `https://backend-leftoverz-production.up.railway.app/api/v1/favorite/user/${user_id}`,
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

      const parsedFavorites = data.data
        .filter((fav: RawFavorite) => fav.product?.status === "available")
        .map(
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
  const handleDeleteFavorite = async (userId: string, itemId: number) => {
    if (!userId || !itemId) {
      console.error("User ID or Item ID is missing");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        "https://backend-leftoverz-production.up.railway.app/api/v1/favorite/delete",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: userId,
            item_id: itemId,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal menghapus favorit");
      }

      setProducts((prev) => prev.filter((item) => item.product?.id !== itemId));
      setSuccessMessage("Berhasil menghapus favorit.");
      setShowSuccessPopup(true);
      setShowConfirmPopup(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error deleting favorite:", error.message);
        setErrorMessage(error.message);
      } else {
        console.error("An unknown error occurred:", error);
        setErrorMessage("Terjadi kesalahan yang tidak diketahui.");
      }
      setShowErrorPopup(true);
      setShowConfirmPopup(false);
    }
  };

  const handleClosePopup = () => {
    setShowErrorPopup(false);
    setShowSuccessPopup(false);
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    setSearchTerm(keyword);

    const filtered = products.filter((p) =>
      p.product?.name.toLowerCase().includes(keyword.toLowerCase())
    );

    setFilteredProducts(filtered);
  };
  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const { theme, setTheme } = useTheme();
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme && storedTheme !== theme) {
      setTheme(storedTheme);
    }
  }, [theme, setTheme]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/auth/login");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) return null;
  return (
    <div
      className={`items-center ${
        theme === "dark" ? "dark:bg-[#080B2A]" : "bg-white"
      } min-h-screen`}
    >
      {showConfirmPopup && itemToDelete && itemToDelete.product && (
        <div className="fixed inset-0 bg-black/55 flex items-center justify-center z-50">
          <div className="bg-[#080B2A] border-blue-400 border z-50 rounded-lg py-8 px-14 shadow-lg text-center">
            <div className="flex justify-center mb-4">
              <Image
                src="/images/warning.svg"
                width={80}
                height={80}
                alt="Success"
                className="w-20 h-20"
              />
            </div>
            <h2 className="text-2xl font-bold mb-1 text-blue-400">
              Konfirmasi Hapus
            </h2>
            <p className="mb-6 text-blue-400">
              Apakah Anda yakin ingin menghapus {itemToDelete.product.name} dari
              favorit?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  if (itemToDelete.product?.id) {
                    handleDeleteFavorite(userId, itemToDelete.product.id);
                    setShowConfirmPopup(false);
                  } else {
                    console.error("Product ID is missing");
                  }
                }}
                className="bg-blue-400 hover:bg-blue-500 text-white font-semibold py-2 px-6 rounded-full"
              >
                Ya
              </button>
              <button
                onClick={() => setShowConfirmPopup(false)}
                className="bg-red-400 hover:bg-red-500 text-white font-semibold py-2 px-6 rounded-full"
              >
                Tidak
              </button>
            </div>
          </div>
        </div>
      )}

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
            <h2 className="text-2xl font-bold mb-1 text-blue-400">Sukses!</h2>
            <p className="mb-6 text-blue-400">{successMessage}</p>
           <button
              onClick={handleClosePopup}
              className="bg-blue-400 hover:bg-blue-500 tracking-wide text-white font-semibold py-2 px-6 rounded-full"
            >
              Oke
            </button>
          </div>
        </div>
      )}
      {showErrorPopup && (
        <div className="fixed inset-0 bg-black/55 flex items-center justify-center z-50">
          <div
            className={`border-red-400 border rounded-lg py-8 px-14 shadow-lg text-center ${
              theme === "dark" ? "bg-[#080B2A]" : "bg-white"
            }`}
          >
            <div className="flex justify-center mb-4">
              <Image
                src="/images/error.svg"
                width={80}
                height={80}
                alt="Error"
                className="w-20 h-20"
              />
            </div>
            <h2 className="text-2xl font-bold mb-1 text-red-400">Eror!</h2>
            <p className="mb-6 text-red-400">{errorMessage}</p>
            <button
              onClick={handleClosePopup}
              className="bg-red-400 hover:bg-red-500 tracking-wide text-white font-semibold py-2 px-6 rounded-full"
            >
              Oke
            </button>
          </div>
        </div>
      )}
      <main>
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
  ${theme === "dark" ? "bg-white/5" : "bg-black/5"}
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
            <div
              className={`absolute top-0 left-0 w-full h-full rounded-2xl z-20 ${
                theme === "dark" ? "bg-black opacity-40" : "bg-white/20"
              }`}
            ></div>
            <h1
              className={`max-lg:text-4xl lg:text-6xl tracking-wide font-bold text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 ${
                theme === "dark" ? "text-white" : "text-[#080B2A]"
              }`}
            >
              Favorit
            </h1>
          </div>
        </div>
        <div className="py-10 lg:px-20 max-lg:px-6 flex justify-between items-center">
          <form className="w-full mx-auto relative">
            <div className="flex">
              <div className="relative w-full">
                <input
                  type="search"
                  className="block p-2.5 w-full z-20 text-base text-white bg-white/10 lg:rounded-lg max-lg:rounded-lg border border-blue-400"
                  placeholder="Cari produk..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  required
                />
                <button
                  type="submit"
                  className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-blue-400 rounded-e-lg border border-blue-400 hover:bg-blue-500"
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
        </div>
        <div className="lg:py-10 max-lg:pt-0 max-lg:pb-10 lg:px-20 max-lg:px-6 w-full">
          {loading ? (
            <div className="text-center text-blue-400">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10 max-lg:gap-4 z-50">
              {currentProducts.length === 0 ? (
                <div
                  className={`col-span-full block text-center justify-center text-lg mb-1 font-bold ${
                    theme === "dark" ? "text-white" : "text-blue-400"
                  }`}
                >
                  <svg
                    width="800px"
                    height="800px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mb-6 w-32 h-32 flex mx-auto justify-center text-center items-center"
                  >
                    <path
                      d="M6.10999 17.5C3.89999 15.43 2 12.48 2 8.67999C2 5.58999 4.49 3.09003 7.56 3.09003C9.38 3.09003 10.99 3.97002 12 5.33002C13.01 3.97002 14.63 3.09003 16.44 3.09003C17.59 3.09003 18.66 3.43999 19.55 4.04999"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M21.74 7C21.91 7.53 22 8.1 22 8.69C22 15.69 15.52 19.82 12.62 20.82C12.28 20.94 11.72 20.94 11.38 20.82C10.73 20.6 9.91002 20.22 9.02002 19.69"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M22 2L2 22"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Belum ada data favorit yang anda masukkan.
                </div>
              ) : (
                currentProducts.map((item) => (
                  <div
                    key={item.id}
                    className="w-full p-6 rounded-xl border_section shadow-lg bg-white/5 relative"
                  >
                    <div className="mb-4 flex justify-between items-center">
                      <div className="block">
                        <h3
                          className={`text-lg mb-1 font-bold ${
                            theme === "dark" ? "text-white" : "text-blue-400"
                          }`}
                        >
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
                            ? `https://backend-leftoverz-production.up.railway.app${item.product.image[0]}`
                            : "/images/default-item.png"
                        }
                        alt="product"
                        width={100}
                        height={100}
                        className={`w-full lg:h-80 max-lg:h-72 object-cover rounded-2xl ${
                          theme === "dark"
                            ? ""
                            : "border-[1.9px] border-blue-400"
                        }`}
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
                        className="bg-blue-400 px-6 py-3 text-center w-full text-white rounded-full hover:bg-transparent z-30 hover:text-blue-400 hover:border-2 hover:border-blue-400"
                      >
                        Lihat Detail
                      </Link>
                      <button
                        className={`z-30 ${
                          theme === "dark" ? "text-white" : "text-blue-400"
                        }`}
                        onClick={() => {
                          const userId = localStorage.getItem("id");
                          if (!userId) {
                            console.error("User ID is missing");
                            return;
                          }
                          if (!item.product?.id) {
                            console.error("Item ID is missing");
                            return;
                          }
                          setItemToDelete(item);
                          setShowConfirmPopup(true);
                        }}
                        title="Hapus dari Favorit"
                      >
                        <svg
                          width="800px"
                          height="800px"
                          viewBox="0 0 24 24"
                          className="w-8 h-8 hover:scale-110 transition"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M22 17.2C22 19.85 19.85 22 17.2 22C15.78 22 14.51 21.38 13.63 20.4C12.87 19.55 12.4 18.43 12.4 17.2C12.4 14.55 14.55 12.4 17.2 12.4C18.57 12.4 19.81 12.98 20.69 13.91C20.68 13.91 20.68 13.91 20.69 13.92C21.5 14.78 22 15.93 22 17.2Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeMiterlimit="10"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M18.48 18.54L15.95 16"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeMiterlimit="10"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M18.45 16.03L15.92 18.57"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeMiterlimit="10"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M22 8.69C22 10.66 21.49 12.4 20.69 13.91C19.81 12.98 18.57 12.4 17.2 12.4C14.55 12.4 12.4 14.55 12.4 17.2C12.4 18.43 12.87 19.55 13.63 20.4C13.26 20.57 12.92 20.71 12.62 20.81C12.28 20.93 11.72 20.93 11.38 20.81C8.48 19.82 2 15.69 2 8.69C2 5.6 4.49 3.09998 7.56 3.09998C9.37 3.09998 10.99 3.98002 12 5.33002C13.01 3.98002 14.63 3.09998 16.44 3.09998C19.51 3.09998 22 5.6 22 8.69Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          <div className="flex justify-center gap-4 mt-10 items-center">
            <button
              onClick={handlePreviousPage}
              className="px-4 py-2 text-sm font-bold text-white bg-blue-400 rounded-md shadow hover:bg-blue-500 transition"
              disabled={currentPage === 1}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5 8.25 12l7.5-7.5"
                />
              </svg>
            </button>
            <span
              className={`font-semibold ${
                theme === "dark" ? "text-white" : "text-blue-400"
              }`}
            >
              {currentPage} dari {totalPages}
            </span>

            <button
              onClick={handleNextPage}
              className="px-4 py-2 text-sm font-bold text-white bg-blue-400 rounded-md shadow hover:bg-blue-500 transition"
              disabled={currentPage === totalPages}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </div>
        </div>
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          title="Toggle theme"
          className={`fixed bottom-6 lg:right-20 max-md:right-8 z-40 p-3 rounded-full bg-blue-400 ${
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
