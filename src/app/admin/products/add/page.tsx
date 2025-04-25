"use client";

import Image from "next/image";
import { useState } from "react";

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
    <div className="min-h-screen bg-[#060B26] text-white px-6 pt-6 relative">
      <Image
        width={100}
        height={100}
        alt=""
        src="/images/admin.png"
        className="w-full absolute right-0 top-0 min-h-screen mb-0"
      />
      <div className="flex justify-between items-center mb-7 relative z-20">
        <h1 className="text-3xl font-bold text-nowrap">Add Product</h1>
        <div className="relative flex justify-end gap-4 w-full">
          <div className="block">
            <p>Wednesdey</p>
            <p>12 Jul 2025</p>
          </div>
        </div>
      </div>
      <div className="mb-6 z-20">
        <div
          className="relative rounded-lg flex justify-between items-center z-40 text-start shadow-lg"
          style={{
            background:
              "linear-gradient(to bottom right, rgba(6, 11, 38, 0.74), rgba(26, 31, 55, 0.5))",
          }}
        >
          <div className="absolute inset-0 opacity-40 rounded-lg"></div>
          <div className="relative z-10 text-white  p-6">
            <span className="text-sm font-normal">Welcome back,</span>
            <h2 className="text-xl font-semibold mb-1">Mark Johnson</h2>
            <p className="text-sm text-gray-300">
              Glad to see you again! Ask me anything.
            </p>
            <button className="mt-4 text-white text-sm flex items-center gap-2">
              Tap to record →
            </button>
          </div>
          <div className="z-10">
            <Image
              src="/images/userss.png"
              alt="Welcome"
              width={300}
              height={300}
              className="rounded-lg absolute right-0 h-56 w-56 -top-10"
            />
          </div>
        </div>
      </div>
      <div
        className="relative overflow-x-auto rounded-lg"
        style={{
          background:
            "linear-gradient(to bottom right, rgba(6, 11, 38, 0.74), rgba(26, 31, 55, 0.5))",
        }}
      >
        <form onSubmit={handleSubmit} className="p-6">
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
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
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
      </div>
    </div>
  );
}
