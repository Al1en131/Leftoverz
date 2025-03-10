"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function DetailProfile() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    sex: "",
    dateOfBirth: "",
    profileImage: null,
    coverImage: null,
  });

  // Handle perubahan input
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    // Simpan nilai sebelum React menghapus event
    const newValue = type === "file" ? files[0] : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  // Handle submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
  };

  return (
    <div className="bg-[#080B2A] items-center min-h-screen ">
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
          className="w-4 absolute top-44 left-56 -z-0"
        />
        <Image
          width={100}
          height={100}
          alt=""
          src="/images/Star-1.svg"
          className="w-4 absolute top-36 left-[550px] -z-0"
        />
        {/* Hero Section */}
        <div className="bg-white/5 pt-28 pb-20 w-full px-20 flex flex-col items-center gap-6 relative">
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
              Detail Profile
            </h1>
          </div>
        </div>
        <div className="flex justify-between py-10 px-20 w-full items-center">
          <section className="p-10 w-full my-auto bg-white/10 rounded-2xl border_section">
            <div className="w-full flex gap-4">
              <div className="w-full h-fit self-center">
                <div className="">
                  <div className="">
                    <h2 className="text-white text-xl font-semibold text-center">
                      Edit Profile
                    </h2>
                    <form onSubmit={handleSubmit}>
                      <div className="flex flex-col items-center my-4">
                        <label
                          htmlFor="profileImage"
                          className="cursor-pointer"
                        >
                          <div className="w-24 h-24 bg-gray-500 rounded-full flex items-center justify-center">
                            {formData.profileImage ? (
                              <img
                                src={URL.createObjectURL(formData.profileImage)}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <span>Upload</span>
                            )}
                          </div>
                        </label>
                        <input
                          type="file"
                          name="profileImage"
                          id="profileImage"
                          hidden
                          onChange={handleChange}
                        />
                      </div>
                      <div className="mt-4 mb-10 w-full">
                        <p className="text-lg text-white text-center">
                          Penjual
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="firstName" className="text-white">
                            Name
                          </label>
                          <input
                            type="text"
                            name="firstName"
                            id="firstName"
                            className="w-full border bg-white/30 text-white placeholder-white border-blue-400 p-2 rounded-lg"
                            placeholder="First Name"
                            onChange={handleChange}
                          />
                        </div>
                        <div>
                          <label htmlFor="lastName" className="text-white">
                            Email
                          </label>
                          <input
                            type="email"
                            name="lastName"
                            id="lastName"
                            className="w-full border bg-white/30 text-white placeholder-white border-blue-400 p-2 rounded-lg"
                            placeholder="john@example.com"
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 mt-4 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="firstName" className="text-white">
                            Number Phone
                          </label>
                          <input
                            type="tel"
                            name="firstName"
                            id="firstName"
                            className="w-full border bg-white/30 text-white placeholder-white border-blue-400 p-2 rounded-lg"
                            placeholder="085172041077"
                            onChange={handleChange}
                          />
                        </div>
                        <div>
                          <label htmlFor="lastName" className="text-white">
                            Password
                          </label>
                          <input
                            type="password"
                            name="lastName"
                            id="lastName"
                            className="w-full border bg-white/30 text-white placeholder-white border-blue-400 p-2 rounded-lg"
                            placeholder="password"
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      {/* Submit Button */}
                      <button
                        type="submit"
                        className="w-full mt-6 bg-blue-400 text-white py-2 rounded-lg"
                      >
                        Submit
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
