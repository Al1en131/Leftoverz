"use client";
import Image from "next/image";
import Link from "next/link";

export default function Login() {
  return (
    <div className="bg-[#080B2A] min-h-screen flex items-center justify-center p-6">
      <Image
        width={356}
        height={356}
        alt=""
        src="/images/bubble.svg"
        className="absolute top-0 left-0"
      />
      <Image
        width={356}
        height={356}
        alt=""
        src="/images/bubble-2.svg"
        className="absolute top-0 right-0"
      />
      <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-10 lg:bg-white/10 rounded-2xl max-lg:p-6 lg:p-12">
        <div className="w-full lg:w-1/2 bg-blue-950/10 border-2 border-blue-400 rounded-lg shadow-lg max-lg:p-6 lg:p-8">
          <h1 className="text-xl font-bold mb-6 tracking-wide text-white lg:text-2xl">
            Register your account
          </h1>
          <form className="space-y-6">
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
                className="bg-white/20 text-white rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
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
                className="bg-white/20 text-white rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
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

        {/* Image Section */}
        <div className="w-full lg:w-1/2 hidden lg:flex justify-center">
          <Image width={600} height={600} src="/images/login.svg" alt="" />
        </div>
      </div>
    </div>
  );
}
