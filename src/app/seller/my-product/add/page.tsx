"use client";
import { useState } from "react";
import Image from "next/image";

export default function AddProduct() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    location: "",
    category: "",
    description: "",
    productImage: null,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type, files } = e.target as HTMLInputElement;
    const newValue = type === "file" ? files?.[0] || null : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form Data:", formData);
  };

  return (
    <div className="bg-[#080B2A] items-center min-h-screen">
      <main className="">
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
          className="w-4 absolute top-[400px] right-32 max-lg:hidden -z-0"
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
          className="w-4 absolute top-36 max-lg:hidden left-[550px] -z-0"
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
            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-40 rounded-2xl z-40"></div>
            <h1 className="text-5xl md:text-8xl tracking-wide text-white font-bold text-center absolute inset-0 flex justify-center items-center z-50">
              Add Product
            </h1>
          </div>
        </div>

        <div className="flex justify-center py-10 lg:px-20 max-lg:px-6 w-full">
          <section className="lg:p-10 max-lg:p-6 bg-white/10 rounded-2xl w-full border border-blue-400">
            <h2 className="text-white text-2xl font-semibold text-center mb-6">
              Product Details
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col items-center mb-6">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white/40">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        className="w-8 h-8 mb-4 text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                      </svg>
                      <p className="mb-2 text-sm text-white">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-white">
                        SVG, PNG, JPG or GIF (MAX. 800x400px)
                      </p>
                    </div>
                    <input id="dropzone-file" type="file" className="hidden" />
                  </label>
                </div>
              </div>

              {/* Product Name */}
              <div className="mb-4">
                <label htmlFor="name" className="text-white block">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="w-full border bg-white/30 text-white placeholder-white border-blue-400 p-2 rounded-lg"
                  placeholder="Enter product name"
                  onChange={handleChange}
                  value={formData.name}
                />
              </div>

              {/* Price */}
              <div className="mb-4">
                <label htmlFor="price" className="text-white block">
                  Price (Rp.)
                </label>
                <input
                  type="number"
                  name="price"
                  id="price"
                  className="w-full border bg-white/30 text-white placeholder-white border-blue-400 p-2 rounded-lg"
                  placeholder="Enter product price"
                  onChange={handleChange}
                  value={formData.price}
                />
              </div>

              {/* Location */}
              <div className="mb-4">
                <label htmlFor="location" className="text-white block">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  className="w-full border bg-white/30 text-white placeholder-white border-blue-400 p-2 rounded-lg"
                  placeholder="Enter location"
                  onChange={handleChange}
                  value={formData.location}
                />
              </div>

              {/* Category */}
              <div className="mb-4">
                <label htmlFor="category" className="text-white block">
                  Category
                </label>
                <select
                  name="category"
                  id="category"
                  className="w-full border bg-white/30 text-white border-blue-400 p-2 rounded-lg"
                  onChange={handleChange}
                  value={formData.category}
                >
                  <option value="" disabled>
                    Select Category
                  </option>
                  <option value="Electronics">Electronics</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Home Appliances">Home Appliances</option>
                  <option value="Health & Beauty">Health & Beauty</option>
                </select>
              </div>

              {/* Description */}
              <div className="mb-6">
                <label htmlFor="description" className="text-white block">
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={4}
                  className="w-full border bg-white/30 text-white placeholder-white border-blue-400 p-2 rounded-lg"
                  placeholder="Enter product description"
                  onChange={handleChange}
                  value={formData.description}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-400 text-white py-2 rounded-lg hover:bg-blue-500"
              >
                Submit Product
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}
