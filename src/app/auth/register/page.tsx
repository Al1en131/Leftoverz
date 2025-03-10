"use client";

import Image from "next/image";
import { useEffect } from "react";
import "flowbite";
import "flowbite/dist/flowbite.css";
import Link from "next/link";

export default function Register() {
  useEffect(() => {
    import("flowbite").then((flowbite) => {
      flowbite.initAccordions();
    });
  }, []);
  return (
    <div className="bg-[#080B2A] min-h-screen">
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
        className="w-4 absolute top-28 right-8 -z-0"
      />
      <Image
        width={100}
        height={100}
        alt=""
        src="/images/Star-1.svg"
        className="w-4 absolute top-[400px] right-32 -z-0"
      />
      <Image
        width={100}
        height={100}
        alt=""
        src="/images/Star-1.svg"
        className="w-4 absolute top-44 left-10 -z-0"
      />
      <Image
        width={100}
        height={100}
        alt=""
        src="/images/Star-1.svg"
        className="w-4 absolute top-36 left-[550px] -z-0"
      />
      <div className="w-full p-10">
        <div className="items-center bg-white/10 rounded-2xl justify-center">
          <section className="w-full">
            <div className="flex justify-between w-full items-center py-10 px-20">
              <div className="w-1/3 bg-blue-950/10 rounded-lg shadow border_section md:mt-0  xl:p-0">
                <div className="p-12 space-y-4 md:space-y-8">
                  <h1 className="text-xl font-bold leading-tight mb-8 tracking-wide text-white md:text-2xl">
                    Register to your account
                  </h1>
                  <form className="space-y-4 md:space-y-6" action="#">
                    <div>
                      <label
                        htmlFor="name"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        className="bg-white/20 border_section text-white rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                        placeholder="username"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        className="bg-white/20 border_section text-white rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                        placeholder="name@company.com"
                        required
                      />
                    </div>
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone_number"
                      id="phone_number"
                      className="bg-white/20 border_section text-white rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                      placeholder="0851"
                      required
                      pattern="[\+]?[0-9]{1,4}[0-9]{7,15}"
                    />
                    <div>
                      <label
                        htmlFor="password"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="••••••••"
                        className="bg-white/20 border_section text-white rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="Role"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Role
                      </label>
                      <div className="flex gap-8 items-center">
                        <div>
                          <input
                            type="radio"
                            id="penjual"
                            name="role"
                            value="penjual"
                            className="border_section"
                          />
                          <label htmlFor="penjual" className="ps-2">
                            Penjual
                          </label>
                        </div>
                        <div>
                          <input
                            type="radio"
                            id="pembeli"
                            name="role"
                            value="pembeli"
                            className="border_section"
                          />
                          <label htmlFor="pembeli" className="ps-2">
                            Pembeli
                          </label>
                        </div>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full text-white bg-transparent z-50  font-medium rounded-lg text-sm px-5 py-2.5 text-center border-blue-400 border-2"
                    >
                      Register
                    </button>
                    <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                      Have an account?
                      <Link
                        href="/auth/login"
                        className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                      >
                        Log in here
                      </Link>
                    </p>
                  </form>
                </div>
              </div>
              <div className="2/3 flex justify-end">
                <Image
                  width={100}
                  height={100}
                  alt=""
                  src="/images/login.svg"
                  className="h-[800px] w-full"
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
