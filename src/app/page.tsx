import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-[#080B2A]  items-center justify-items-center min-h-screen">
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
        <div className="flex justify-between p-8 sm:py-10 sm:px-20 items-center">
          <div className="w-1/2 block space-y-4">
            <h1 className="text-8xl font-bold text-white">Leftoverz</h1>
            <h4 className="text-4xl">
              Barang Bekas Kos dengan Harga Terjangkau dan Kualitas Terjamin
            </h4>
            <p>
              Jual beli barang bekas kos yang masih layak pakai dan berkualitas.
              Hemat uang, dapatkan barang yang kamu butuhkan, dan bantu kurangi
              sampah.
            </p>
            <div className="flex gap-4">
              <button className="bg-[#15BFFD] px-4 py-3 text-center text-white w-36 rounded-full hover:bg-transparent hover:text-[#15BFFD] hover:border-2 hover:border-[#15BFFD]">
                Registrasi
              </button>
              <button className="border-[#15BFFD] text-[#15BFFD] border-2 w-36 bg-transparent px-4 py-3 rounded-full text-center hover:bg-[#15BFFD] hover:text-white">
                Login
              </button>
            </div>
          </div>
          <div className="z-50 w-1/2 flex">
            <Image
              width={100}
              height={10}
              alt=""
              src="/images/hero.svg"
              className="z-50 w-full"
            />
          </div>
        </div>
        <div className=" justify-between flex items-center relative mb-10 w-full">
          <Image
            width={100}
            height={100}
            alt=""
            src="/images/bubble-3.svg"
            className="h-[356px] w-[356px] absolute top-48 -z-0 left-0"
          />
          <Image
            width={100}
            height={100}
            alt=""
            src="/images/bubble-4.svg"
            className="h-[356px] w-[356px] absolute -top-28 -z-0 right-0"
          />
          <Image
            width={100}
            height={100}
            alt=""
            src="/images/Star-1.svg"
            className="w-4 absolute -top-10 right-96 -z-0"
          />
          <Image
            width={100}
            height={100}
            alt=""
            src="/images/Star-1.svg"
            className="w-5 absolute top-28 right-48 opacity-20 -z-0"
          />
          <Image
            width={100}
            height={100}
            alt=""
            src="/images/Star-1.svg"
            className="w-5 absolute top-20 right-20 opacity-20 -z-0"
          />
          <Image
            width={100}
            height={100}
            alt=""
            src="/images/Star-1.svg"
            className="w-4 absolute top-10 opacity-20 left-56 -z-0"
          />
          <Image
            width={100}
            height={100}
            alt=""
            src="/images/Star-1.svg"
            className="w-4 absolute top-56 opacity-20 left-[850px] -z-0"
          />
          <div className="absolute inset-0 bg-white opacity-5 z-10"></div>
          <div className="relative z-50 w-2/4 ps-20 text-white">
            <h4 className="text-5xl pb-4">Why Choose Us?</h4>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged.
            </p>
            <button className="bg-[#15BFFD] px-4 mt-4 py-3 text-center text-white w-36 rounded-full hover:bg-transparent hover:text-[#15BFFD] hover:border-2 hover:border-[#15BFFD]">
                About Us
              </button>
          </div>
          <div className="w-2/4 z-50 flex justify-end">
            {" "}
            <Image
              width={100}
              height={100}
              alt=""
              src="/images/hero-2.svg"
              className="h-[456px] w-full"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
