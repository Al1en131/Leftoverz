import Image from "next/image";

export default function Home() {
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
        <div className="flex justify-between p-8 sm:py-10 sm:px-20 items-center">
          <div className="w-1/2 block space-y-4">
            <h1 className="text-8xl leading-14 font-bold text-white">
              <span className="text-[#15BFFD]">Left</span>overz
            </h1>
            <h4 className="text-4xl font-bold">
              Barang Bekas Kos dengan Harga Terjangkau dan Kualitas Terjamin
            </h4>
            <p className="text-lg leading-6">
              Jual beli barang bekas kos yang masih layak pakai dan berkualitas.
              Hemat uang, dapatkan barang yang kamu butuhkan, dan bantu kurangi
              sampah.
            </p>
            <div className="flex gap-4 pt-4">
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
            className="h-[456px] w-[456px] absolute top-60 -z-0 left-0"
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
            <h4 className="text-5xl font-bold pb-4">Why Choose Us?</h4>
            <p className="text-lg">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry&apos;s standard dummy text
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
            <Image
              width={100}
              height={100}
              alt=""
              src="/images/hero-2.svg"
              className="h-[456px] w-full"
            />
          </div>
        </div>
        <div className="p-20 w-full relative">
          <Image
            width={100}
            height={100}
            alt=""
            src="/images/bubble-5.svg"
            className="h-[456px] w-[456px] absolute z-0 -bottom-20 left-0"
          />
          <Image
            width={100}
            height={100}
            alt=""
            src="/images/Star-1.svg"
            className="w-8 absolute top-40 right-10 -z-0"
          />
          <Image
            width={100}
            height={100}
            alt=""
            src="/images/Star-1.svg"
            className="w-4 absolute bottom-6 right-96 -z-0"
          />
          <Image
            width={100}
            height={100}
            alt=""
            src="/images/Star-1.svg"
            className="w-4 absolute top-20 left-56 -z-0"
          />
          <div className="text-center justify-center z-50">
            <h3 className="text-3xl font-bold text-white">Features</h3>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry
            </p>
            <div className=" pt-14 flex justify-between items-center">
              <div className="border_section bg-transparent h-[350px] text-white rounded-xl p-5 w-80 shadow-lg relative">
                <Image
                  width={100}
                  height={10}
                  alt=""
                  src="/images/camera.svg"
                  className="z-50 w-full h-3/4"
                />

                {/* Card Content */}
                <div className="mt-4 h-1/4">
                  <p className="text-lg font-semibold">Pencarian Visual</p>
                </div>
              </div>
              <div className="border_section bg-transparent h-[350px] text-white rounded-xl p-5 w-80 shadow-lg relative">
                <Image
                  width={100}
                  height={10}
                  alt=""
                  src="/images/Bag.svg"
                  className="z-50 w-full h-3/4"
                />

                {/* Card Content */}
                <div className="mt-4 h-1/4">
                  <p className="text-lg font-semibold">
                    Pembayaran Auto Verfication
                  </p>
                </div>
              </div>
              <div className="border_section bg-transparent h-[350px] text-white rounded-xl p-5 w-80 shadow-lg relative">
                <Image
                  width={100}
                  height={10}
                  alt=""
                  src="/images/Home.svg"
                  className="z-50 w-full h-3/4"
                />

                {/* Card Content */}
                <div className="mt-4 h-1/4">
                  <p className="text-lg font-semibold">
                    Terintegrasi dengan pengiriman
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-20 pb-20 w-full">
          <div className="flex flex-col items-center justify-center relative">
            <Image
              width={100}
              height={100}
              alt=""
              src="/images/Star-1.svg"
              className="w-4 absolute bottom-6 right-96 -z-0"
            />
            <Image
              width={100}
              height={100}
              alt=""
              src="/images/Star-1.svg"
              className="w-4 absolute top-20 left-56 -z-0"
            />
            <Image
              width={100}
              height={100}
              alt=""
              src="/images/Star-1.svg"
              className="w-4 absolute top-6 right-20 -z-0"
            />
            <Image
              width={100}
              height={100}
              alt=""
              src="/images/Star-1.svg"
              className="w-8 absolute top-10 right-5 -z-0"
            />
            <div className="pb-12 text-center">
              <h3 className="text-3xl font-bold text-white">How It Work?</h3>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry
              </p>
            </div>
            <div className="relative w-full">
              <div className="px-20 space-y-10">
                <div className="relative flex md:justify-end">
                  <div className="relative w-[580px] p-5 text-black rounded-2xl border_style shadow-md bg-white/5">
                    <p className="text-xl font-bold mb-1 text-blue-400">
                      1. Login atau Registrasi
                    </p>
                    <p className="text-white text-lg">
                      Pengguna dapat login jika sudah memiliki akun atau
                      melakukan registrasi dengan mengisi data seperti nama,
                      email, dan password.
                    </p>
                  </div>
                </div>
                <div className="relative flex md:justify-start">
                  <div className="relative w-[580px] p-5 text-black rounded-2xl border_style shadow-md bg-white/5">
                    <p className="text-xl font-bold mb-1 text-blue-400">
                      2. Mencari Barang
                    </p>
                    <p className="text-white text-lg">
                      Gunakan fitur pencarian dan filter untuk menemukan barang
                      yang diinginkan, lalu klik produk untuk melihat detailnya.
                    </p>
                  </div>
                </div>
                <div className="relative flex md:justify-end">
                  <div className="relative w-[580px] p-5 text-black rounded-2xl border_style shadow-md bg-white/5">
                    <p className="text-xl font-bold mb-1 text-blue-400">
                      3. Memesan Barang
                    </p>
                    <p className="text-white text-lg">
                      Klik &apos;Beli&apos; atau tambahkan ke favorit jika ingin membeli
                      lebih dari satu barang, lalu lanjutkan ke checkout.
                    </p>
                  </div>
                </div>
                <div className="relative flex md:justify-start">
                  <div className="relative w-[580px] p-5 text-black rounded-2xl border_style shadow-md bg-white/5">
                    <p className="text-xl font-bold mb-1 text-blue-400">
                      4. Mengisi Detail Pemesanan
                    </p>
                    <p className="text-white text-lg">
                      Periksa pesanan, pilih metode pembayaran (transfer,
                      e-wallet, atau COD), lalu konfirmasi pesanan.
                    </p>
                  </div>
                </div>
                <div className="relative flex md:justify-end">
                  <div className="relative w-[580px] p-5 text-black rounded-2xl border_style shadow-md bg-white/5">
                    <p className="text-xl font-bold mb-1 text-blue-400">
                      5. Pembayaran & Verifikasi Otomatis
                    </p>
                    <p className="text-white text-lg">
                      Lakukan pembayaran sesuai instruksi. Sistem akan otomatis
                      memverifikasi tanpa perlu unggah bukti.
                    </p>
                  </div>
                </div>
                <div className="relative flex md:justify-start">
                  <div className="relative w-[580px] p-5 text-black rounded-2xl border_style shadow-md bg-white/5">
                    <p className="text-xl font-bold mb-1 text-blue-400">
                      6. Mengambil atau Menerima Barang
                    </p>
                    <p className="text-white text-lg">
                      Tunggu barang dikirim sesuai estimasi waktu, lalu
                      konfirmasi penerimaan dan beri ulasan setelah barang
                      sampai.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-20 pb-20 w-full justify-center">
          <div className="pb-12 text-center">
            <h3 className="text-3xl font-bold text-white">
              Newly Added Product
            </h3>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry
            </p>
          </div>
          <div className="flex justify-center gap-10 items-center">
            <div className="w-80 p-6 rounded-xl border_section shadow-lg bg-white/5 relative">
              {/* Bagian Atas */}
              <div className="mb-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-gray-300 rounded-full"></span>
                  <p className="text-blue-400 font-semibold">James Watson</p>
                </div>
                <button className="bg-[#15BFFD] px-6 py-1 text-center text-white rounded-lg hover:bg-transparent hover:text-[#15BFFD] hover:border-2 hover:border-[#15BFFD]">
                  Beli
                </button>
              </div>
              <div className="mb-5">
                <Image
                  width={100}
                  height={100}
                  alt=""
                  src="/images/hero-2.jpg"
                  className="w-full rounded-2xl "
                />
              </div>

              {/* Bagian Bawah */}
              <div className="mt-4">
                <h3 className="text-white text-lg font-bold">
                  Punk Art Collection
                </h3>
                <p className="text-blue-400 text-base">Jakarta</p>
              </div>
            </div>
            <div className="w-80 p-6 rounded-xl border_section shadow-lg bg-white/5 relative">
              {/* Bagian Atas */}
              <div className="mb-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-gray-300 rounded-full"></span>
                  <p className="text-blue-400 font-semibold">James Watson</p>
                </div>
                <button className="bg-[#15BFFD] px-6 py-1 text-center text-white rounded-lg hover:bg-transparent hover:text-[#15BFFD] hover:border-2 hover:border-[#15BFFD]">
                  Beli
                </button>
              </div>
              <div className="mb-5">
                <Image
                  width={100}
                  height={100}
                  alt=""
                  src="/images/hero-2.jpg"
                  className="w-full rounded-2xl "
                />
              </div>

              {/* Bagian Bawah */}
              <div className="mt-4">
                <h3 className="text-white text-lg font-bold">
                  Punk Art Collection
                </h3>
                <p className="text-blue-400 text-base">Jakarta</p>
              </div>
            </div>
            <div className="w-80 p-6 rounded-xl border_section shadow-lg bg-white/5 relative">
              {/* Bagian Atas */}
              <div className="mb-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-gray-300 rounded-full"></span>
                  <p className="text-blue-400 font-semibold">James Watson</p>
                </div>
                <button className="bg-[#15BFFD] px-6 py-1 text-center text-white rounded-lg hover:bg-transparent hover:text-[#15BFFD] hover:border-2 hover:border-[#15BFFD]">
                  Beli
                </button>
              </div>
              <div className="mb-5">
                <Image
                  width={100}
                  height={100}
                  alt=""
                  src="/images/hero-2.jpg"
                  className="w-full rounded-2xl "
                />
              </div>

              {/* Bagian Bawah */}
              <div className="mt-4">
                <h3 className="text-white text-lg font-bold">
                  Punk Art Collection
                </h3>
                <p className="text-blue-400 text-base">Jakarta</p>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-10">
            <button className="bg-[#15BFFD] px-4 py-3 text-center text-white w-36 rounded-full hover:bg-transparent hover:text-[#15BFFD] hover:border-2 hover:border-[#15BFFD]">
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
