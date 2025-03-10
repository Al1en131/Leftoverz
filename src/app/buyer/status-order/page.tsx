"use client";
import Image from "next/image";
import Link from "next/link";

export default function StatusOrder() {

  return (
    <div className="bg-[#080B2A] min-h-screen flex flex-col items-center">
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
        className="w-8 absolute top-48 right-26 opacity-35 -z-0"
      />
      <Image
        width={100}
        height={100}
        alt=""
        src="/images/Star-1.svg"
        className="w-4 absolute top-36 right-[500px] opacity-35 -z-0"
      />
      <Image
        width={100}
        height={100}
        alt=""
        src="/images/Star-1.svg"
        className="w-4 absolute top-[750px] left-56 opacity-35 -z-0"
      />
      <Image
        width={100}
        height={100}
        alt=""
        src="/images/Star-1.svg"
        className="w-4 absolute top-[700px] right-[300px] opacity-35 -z-0"
      />
      <div className="p-20 mt-10">
        <div className="bg-white/20 p-10 border_section rounded-2xl">
          <div className="flex justify-between relative items-center h-auto">
            <div className="w-1/3">
              <div className="flex items-center mb-4 gap-2">
                <span className="w-8 h-8 bg-gray-300 rounded-full"></span>
                <p className="text-blue-400 text-xl tracking-wide font-semibold">
                  Alien
                </p>
              </div>
              <Image
                src="/images/hero-1.jpg"
                alt=""
                width={100}
                height={100}
                className="w-60 h-60 object-cover rounded-lg"
              />
            </div>
            <div className="w-full">
              <h3 className="text-blue-400 text-xl mb-4 font-bold tracking-wide">
                Product Name
              </h3>
              <p className="text-base">
                Contrary to popular belief, Lorem Ipsum is not simply random
                text. It has roots in a piece of classical Latin literature from
                45 BC, making it over 2000 years old. Richard McClintock, a
                Latin professor at Hampden-Sydney College in Virginia, looked up
                one of the more obscure Latin words, consectetur, from a Lorem
                Ipsum passage, and going through the cites of the word in
                classical literature, discovered the undoubtable source.
              </p>
              <div className="flex items-center gap-4 absolute bottom-0 right-0">
                <Link
                  href=""
                  className="bg-[#15BFFD] px-6 py-3 text-center w-full text-white rounded-full hover:bg-transparent z-50 hover:text-[#15BFFD] hover:border-2 hover:border-[#15BFFD]"
                >
                  Tracking Package
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white/20 p-10 border_section  my-10  rounded-2xl">
          <h3 className="text-3xl font-bold text-blue-400">Payment Detail</h3>
          <div className="block items-center py-4 space-y-2 border-b mb-4 border-b-white">
            <div className="flex justify-between items-center">
              <p className="text-base text-white">Barang</p>
              <p className="text-base text-white">Rp.30.000</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-base text-white">Barang</p>
              <p className="text-base text-white">Rp.30.000</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-base text-white">Barang</p>
              <p className="text-base text-white">Rp.30.000</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-base text-white font-bold tracking-wide">
              Total
            </p>
            <p className="text-base text-white">Rp.30.000</p>
          </div>
        </div>
        <Link
          href=""
          className="bg-white/20 px-6 py-3 text-center border border-blue-400 w-full flex justify-center text-white rounded-full hover:bg-transparent z-50 hover:text-[#15BFFD] hover:border-2 hover:border-[#15BFFD]"
        >
          Beli
        </Link>
      </div>
    </div>
  );
}
