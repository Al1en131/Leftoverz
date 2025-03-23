"use client";
import Image from "next/image";
import Link from "next/link";

export default function Login() {
  return (
    <div className="bg-[#080B2A] min-h-screen flex items-center justify-center px-6">
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
      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-10 lg:bg-white/10 rounded-2xl max-lg:p-6 lg:p-14">
        <div className="w-full lg:w-1/2 bg-blue-950/10 border_section rounded-lg shadow-lg max-lg:p-6 lg:p-12">
          <h1 className="text-xl font-bold mb-6 tracking-wide text-white lg:text-2xl">
            Sign in to your account
          </h1>
          <form className="space-y-6">
            <div>
              <label htmlFor="email" className="block mb-2 text-sm text-white">
                Your email
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-2.5 rounded-lg border_section bg-white/20 border border-gray-300 text-white"
                placeholder="name@company.com"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-2 text-sm text-white">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full p-2.5 rounded-lg bg-white/20 border_section border border-gray-300 text-white"
                placeholder="••••••••"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center text-white">
                <input type="checkbox" className="w-4 h-4 mr-2" />
                Remember me
              </label>
              <a href="#" className="text-blue-400 text-sm hover:underline">
                Forgot password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full text-white border-2 border-blue-400 rounded-lg py-2.5 hover:bg-blue-500 transition"
            >
              Sign in
            </button>
            <p className="text-sm text-gray-400">
              Don’t have an account?{" "}
              <Link href="/auth/register" className="text-blue-400 hover:underline">
                Register
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
