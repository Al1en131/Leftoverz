"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

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
  used_duration: string;
  original_price : number;
  seller?: { name: string };
  user?: {
    subdistrict: string;
    ward: string;
    regency: string;
    province: string;
  };
};
export default function MyProduct() {
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const handleConfirmDelete = async () => {
    if (!selectedProductId) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://127.0.0.1:1031/api/v1/products/${selectedProductId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete product");
      }

      setProducts((prev) =>
        prev.filter((product) => product.id !== selectedProductId)
      );
      setSuccessMessage("Product deleted successfully.");
      setShowSuccessPopup(true);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message || "Failed to delete product.");
      } else {
        setErrorMessage("Failed to delete product.");
      }
      setShowErrorPopup(true);
    } finally {
      setShowConfirmPopup(false);
      setSelectedProductId(null);
    }
  };

  const handleClosePopup = () => {
    setShowSuccessPopup(false);
    setShowErrorPopup(false);
    setShowConfirmPopup(false);
  };
  const fetchProducts = async () => {
    const user_id = localStorage.getItem("id");
    try {
      const response = await fetch(
        `http://127.0.0.1:1031/api/v1/products/user/${user_id}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch products");
      }

      const data = await response.json();
      const parsedProducts = data.products.map((product: Product) => {
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
          ward: product.user?.ward,
          regency: product.user?.regency,
          province: product.user?.province,
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
  useEffect(() => {
    fetchProducts();
  }, []);
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
                className="block w-full p-3 ps-10 text-sm text-white border border-blue-400 rounded-lg bg-white/10"
                placeholder="Search Mockups, Logos..."
                required
              />
            </div>
          </form>

          <div className="lg:w-2/12 max-lg:w-full lg:flex lg:justify-end">
            <Link
              href="/seller/my-product/add"
              className="bg-blue-400 text-white font-medium rounded-lg p-2.5 w-full flex items-center justify-center gap-2 shadow-md hover:bg-blue-500 transition-all"
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
                <th className="px-6 py-3 text-center">Image</th>
                <th className="px-2 py-3 text-left">Product Name</th>
                <th className="px-2 py-3 text-left">Description</th>
                <th className="px-6 py-3 text-left">Price</th>
                <th className="px-6 py-3 text-left">Original Price</th>
                <th className="px-6 py-3 text-left">Use Duration</th>
                <th className="px-6 py-3 text-center">Status</th>
                <th className="px-6 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <tr key={item.id} className="border-b bg-white/10 transition">
                  <td className="px-6 py-4 justify-center flex text-center">
                    <Image
                      src={
                        item.image &&
                        Array.isArray(item.image) &&
                        item.image.length > 0 &&
                        typeof item.image[0] === "string" &&
                        item.image[0].startsWith("/")
                          ? `http://127.0.0.1:1031${item.image[0]}`
                          : "/images/default-item.png"
                      }
                      alt={item.name}
                      width={100}
                      height={100}
                      className="w-16 h-16 object-cover rounded-2xl"
                    />
                  </td>
                  <td className="px-2 py-4 text-white text-left">
                    {item.name && item.name.length > 20
                      ? item.name.slice(0, 20) + "..."
                      : item.name}
                  </td>
                  <td className="px-2 py-4 text-white text-left">
                    {item.description && item.description.length > 35
                      ? item.description.slice(0, 35) + "..."
                      : item.description}
                  </td>
                  <td className="px-6 py-4 text-white text-left">
                    Rp {item.price.toLocaleString("id-ID")}
                  </td>
                   <td className="px-6 py-4 text-white text-left">
                    Rp {item.original_price.toLocaleString("id-ID")}
                  </td>
                  <td className="px-6 py-4 text-white text-left">
                    {item.used_duration}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-4 py-2 text-sm tracking-wide capitalize font-semibold rounded-full ${
                        item.status === "available"
                          ? "bg-green-700 text-white"
                          : "bg-red-700 text-white"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center space-x-2">
                    <Link
                      href={`/seller/my-product/edit/${item.id}`}
                      className="px-4 py-2.5 text-sm font-bold text-white bg-blue-500 rounded-md shadow hover:bg-blue-600 transition"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => {
                        setSelectedProductId(item.id);
                        setShowConfirmPopup(true);
                      }}
                      className="px-4 py-2 text-sm font-bold text-white bg-red-500 rounded-md shadow hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/55 flex items-center justify-center z-50">
          <div className="bg-[#080B2A] border-blue-400 border rounded-lg py-8 px-14 shadow-lg text-center">
            <div className="flex justify-center mb-4">
              <Image
                src="/images/succes.svg"
                width={80}
                height={80}
                alt="Success"
                className="w-20 h-20"
              />
            </div>
            <h2 className="text-2xl font-bold mb-1 text-blue-400">Success!</h2>
            <p className="mb-6 text-blue-400">{successMessage}</p>
            <button
              onClick={handleClosePopup}
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
      {showConfirmPopup && (
        <div className="fixed inset-0 bg-black/55 flex items-center justify-center z-50">
          <div className="bg-[#080B2A] border-blue-400 border rounded-lg py-8 px-14 shadow-lg text-center">
            <div className="flex justify-center mb-4">
              <Image
                src="/images/warning.svg"
                width={80}
                height={80}
                alt="Confirm Delete"
                className="w-20 h-20"
              />
            </div>
            <h2 className="text-2xl font-bold mb-1 text-blue-400">
              Are you sure?
            </h2>
            <p className="mb-6 text-blue-400">
              Do you want to delete this product?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleClosePopup}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-full"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
