"use client";

import Image from "next/image";
import { useEffect } from "react";
import "flowbite";
import "flowbite/dist/flowbite.css";
import Link from "next/link";

export default function Login() {
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
                    Sign in to your account
                  </h1>
                  <form className="space-y-4 md:space-y-6" action="#">
                    <div>
                      <label
                        htmlFor="email"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Your email
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
                    <div className="flex items-center justify-between">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="remember"
                            aria-describedby="remember"
                            type="checkbox"
                            className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                            required
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label
                            htmlFor="remember"
                            className="text-gray-500 dark:text-gray-300"
                          >
                            Remember me
                          </label>
                        </div>
                      </div>
                      <a
                        href="#"
                        className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                      >
                        Forgot password?
                      </a>
                    </div>
                    <button
                      type="submit"
                      className="w-full text-white bg-transparent z-50  font-medium rounded-lg text-sm px-5 py-2.5 text-center border-blue-400 border-2"
                    >
                      Sign in
                    </button>
                    <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                      Don’t have an account yet?
                      <Link
                        href="/auth/register"
                        className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                      >
                        Register
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
