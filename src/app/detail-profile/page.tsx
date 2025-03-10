"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    sex: "",
    dateOfBirth: "",
    profileImage: null,
    coverImage: null,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
  };
  return (
    <div className="bg-[#080B2A]  items-center justify-items-center min-h-screen ">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
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
          src="/images/Vector.svg"
          className="h-[678px] w-[514.09px] absolute top-28 right-0 -z-0"
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
        <div className="flex justify-between pt-28 px-20 items-center">
          <section className="py-10 my-auto dark:bg-gray-900">
            <div className="lg:w-[80%] md:w-[90%] w-[96%] mx-auto flex gap-4">
              <div className="lg:w-[88%] sm:w-[88%] w-full mx-auto shadow-2xl p-4 rounded-xl h-fit self-center dark:bg-gray-800/40">
                <div className="">
                  <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg">
                    <h2 className="text-gray-700 text-xl font-semibold text-center">
                      Create Profile
                    </h2>
                    <form onSubmit={handleSubmit}>
                      {/* Upload Profile & Cover Image */}
                      <div className="flex flex-col items-center my-4">
                        <label
                          htmlFor="profileImage"
                          className="cursor-pointer"
                        >
                          <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
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

                      {/* First Name & Last Name */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="firstName" className="text-gray-700">
                            First Name
                          </label>
                          <input
                            type="text"
                            name="firstName"
                            id="firstName"
                            className="w-full border p-2 rounded-lg"
                            placeholder="First Name"
                            onChange={handleChange}
                          />
                        </div>
                        <div>
                          <label htmlFor="lastName" className="text-gray-700">
                            Last Name
                          </label>
                          <input
                            type="text"
                            name="lastName"
                            id="lastName"
                            className="w-full border p-2 rounded-lg"
                            placeholder="Last Name"
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      {/* Sex & Date of Birth */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <label htmlFor="sex" className="text-gray-700">
                            Sex
                          </label>
                          <select
                            name="sex"
                            id="sex"
                            className="w-full border p-2 rounded-lg"
                            onChange={handleChange}
                          >
                            <option value="">Select Sex</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </select>
                        </div>
                        <div>
                          <label
                            htmlFor="dateOfBirth"
                            className="text-gray-700"
                          >
                            Date of Birth
                          </label>
                          <input
                            type="date"
                            name="dateOfBirth"
                            id="dateOfBirth"
                            className="w-full border p-2 rounded-lg"
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        className="w-full mt-6 bg-blue-500 text-white py-2 rounded-lg"
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
