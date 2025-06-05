"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { withAuth } from '../../lib/withAuth.jsx';

type Product = {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  role: string;
  image: string[];
  description: string;
  price: number;
  status: string;
  user_id: number;
  seller?: { name: string };
  user?: { subdistrict: string };
  created_at: string;
};
function BuyerHome() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme, setTheme } = useTheme();
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme && storedTheme !== theme) {
      setTheme(storedTheme);
    }
  }, [theme, setTheme]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "https://backend-leftoverz-production.up.railway.app/api/v1/allproducts",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch products");
        }

        const data = await response.json();

        const parsedProducts = data.products
          .filter((product: Product) => product.status === "available")
          .sort(
            (a: Product, b: Product) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )
          .slice(0, 3)
          .map((product: Product) => {
            let parsedImage: string[] = [];

            if (typeof product.image === "string") {
              try {
                const parsed = JSON.parse(product.image);
                if (Array.isArray(parsed)) {
                  parsedImage = parsed;
                }
              } catch {
                parsedImage = [];
              }
            } else if (Array.isArray(product.image)) {
              parsedImage = product.image;
            }

            return {
              ...product,
              image: parsedImage,
              seller_name: product.seller?.name || "Unknown",
              subdistrict: product.user?.subdistrict || "Unknown",
            };
          });

        setProducts(parsedProducts);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error fetching products:", error.message);
        } else {
          console.error("An unknown error occurred:", error);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const router = useRouter();

  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) setEmail(storedEmail);
  }, [email]);

  const handleLogout = async () => {
    try {
      await fetch(
        "https://backend-leftoverz-production.up.railway.app/api/v1/logout",
        { method: "POST" }
      );
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      localStorage.removeItem("role");
      localStorage.removeItem("name");
      localStorage.removeItem("id");
      router.push("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };
  return (
    <div
      className={` ${
        theme === "dark" ? "dark:bg-[#080B2A]" : "bg-white"
      }  items-center justify-items-center min-h-screen `}
    >
      {showLogoutPopup && (
        <div className="fixed inset-0 bg-black/55 flex items-center justify-center z-100">
          <div
            className={`border-blue-400 border rounded-lg py-8 px-14 shadow-lg text-center ${
              theme === "dark" ? "bg-[#080B2A]" : "bg-white"
            }`}
          >
            <div className="flex justify-center mb-4">
              <Image
                src="/images/warning.svg"
                width={80}
                height={80}
                alt="Confirm"
                className="w-20 h-20"
              />
            </div>
            <h2 className="text-2xl font-bold mb-1 text-blue-400">Logout</h2>
            <p className="mb-6 text-blue-400">
              Apakah Anda yakin ingin logout?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleLogout}
                className="bg-blue-400 hover:bg-blue-500 text-white font-semibold py-2 px-6 rounded-full"
              >
                Ya
              </button>
              <button
                onClick={() => setShowLogoutPopup(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-6 rounded-full"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          width={100}
          height={100}
          alt=""
          src="/images/bubble.svg"
          className={`
        lg:h-[356px] lg:w-[356px]
        ${theme === "dark" ? "block" : "hidden"}
        max-lg:w-52 max-lg:h-72 absolute top-0 left-0
      `}
        />
        <Image
          width={100}
          height={100}
          alt=""
          src="/images/bubble-2.svg"
          className={`
        lg:h-[356px] lg:w-[356px]
        ${theme === "dark" ? "block" : "hidden"}
        max-lg:w-52 max-lg:h-72 absolute top-0 right-0
      `}
        />
        <Image
          width={100}
          height={100}
          alt=""
          src="/images/Vector.svg"
          className="lg:h-[678px] lg:w-[514.09px] max-lg:h-44 max-lg:w-52 max-lg:hidden absolute top-28 right-0 -z-0"
        />
        <Image
          width={100}
          height={100}
          alt=""
          src="/images/Star-1.svg"
          className="w-8 absolute top-28 max-lg:right-10 right-26 -z-0"
        />
        <Image
          width={100}
          height={100}
          alt=""
          src="/images/Star-1.svg"
          className="w-4 absolute lg:top-28 max-lg:top-30 lg:right-96 max-lg:left-10 -z-0"
        />

        <Image
          width={100}
          height={100}
          alt=""
          src="/images/Star-1.svg"
          className="w-4 absolute lg:top-44 lg:left-56 max-lg:right-5 max-lg:top-72 -z-0"
        />
        <Image
          width={100}
          height={100}
          alt=""
          src="/images/Star-1.svg"
          className="w-4 absolute top-36 lg:left-[550px] max-lg:hidden -z-0"
        />
        <div className="lg:flex lg:justify-between max-lg:justify-center max-lg:w-full z-20 items-center lg:pt-36 max-lg:pt-28 lg:pb-16 lg:px-20 max-lg:px-6 max-lg:text-center text-left">
          <div className="lg:w-1/2 max-lg:w-full block lg:space-y-4 max-lg:space-y-1 z-20">
            <h1 className="lg:text-8xl max-lg:text-5xl leading-14 lg:mb-6 max-md:mb-2 font-bold text-blue-400">
              Left
              <span
                className={`
        ${theme === "dark" ? "text-white" : "text-[#080B2A]"}
      `}
              >
                overz
              </span>
            </h1>
            <p
              className={`
        lg:text-4xl max-lg:text-xl font-bold z-20
        ${theme === "dark" ? "text-white" : "text-[#080B2A]"}
      `}
            >
              Barang Bekas Kos dengan Harga Terjangkau dan Kualitas Terjamin
            </p>
            <p
              className={`
        text-lg max-lg:text-base leading-6 z-20
        ${theme === "dark" ? "text-white" : "text-[#080B2A]"}
      `}
            >
              Jual beli barang bekas kos yang masih layak pakai dan berkualitas.
              Hemat uang, dapatkan barang yang kamu butuhkan, dan bantu kurangi
              sampah.
            </p>
            <div className="flex gap-4 pt-4 max-lg:justify-center">
              <button
                onClick={() => setShowLogoutPopup(true)}
                className="bg-blue-400 px-4 py-3 max-lg:py-1 max-lg:px-3 text-center text-white lg:w-36 rounded-full hover:bg-transparent hover:text-blue-400 hover:border-2 hover:border-blue-400"
              >
                Logout
              </button>
            </div>
          </div>
          <div className="z-50 w-1/2 max-lg:hidden">
            {/* Gambar untuk light mode */}
            <Image
              width={100}
              height={10}
              alt="Hero"
              src="/images/hero-dark.svg"
              className={`
        z-40 w-full block max-lg:hidden
        ${theme === "dark" ? "hidden" : "block"}
      `}
            />
            {/* Gambar untuk dark mode */}
            <Image
              width={100}
              height={10}
              alt="Hero Dark"
              src="/images/hero.svg"
              className={`
        z-40 w-full block max-lg:hidden
        ${theme === "dark" ? "block" : "hidden"}
      `}
            />
          </div>
        </div>
        <div className="lg:justify-between max-lg:justify-center lg:px-20 max-lg:px-6 max-lg:py-6 max-lg:space-y-4 lg:flex max-lg:block items-center relative lg:mb-10 max-lg:mb-0 w-full">
          <Image
            width={100}
            height={100}
            alt=""
            src="/images/bubble-3.svg"
            className={`
  absolute left-0 -z-0
  max-lg:h-72 max-lg:w-72 max-lg:bottom-0 lg:h-[456px] lg:w-[456px]
  lg:top-60
  ${theme === "dark" ? "block" : "hidden"}
`}
          />
          <Image
            width={100}
            height={100}
            alt=""
            src="/images/bubble-4.svg"
            className={`
  absolute -top-28 -z-0 right-0
  max-lg:w-72 max-lg:h-72 lg:h-[356px] lg:w-[356px]
  ${theme === "dark" ? "block" : "hidden"}
`}
          />
          <Image
            width={100}
            height={100}
            alt=""
            src="/images/Star-1.svg"
            className="w-4 absolute -top-10 lg:right-96 max-lg:right-24 -z-0"
          />
          <Image
            width={100}
            height={100}
            alt=""
            src="/images/Star-1.svg"
            className="w-5 absolute top-28 right-48 max-lg:hidden opacity-20 -z-0"
          />
          <Image
            width={100}
            height={100}
            alt=""
            src="/images/Star-1.svg"
            className="w-5 absolute top-20 right-20 opacity-20 max-lg:hidden -z-0"
          />
          <Image
            width={100}
            height={100}
            alt=""
            src="/images/Star-1.svg"
            className="w-4 absolute top-10 opacity-20 left-56 max-lg:hidden -z-0"
          />
          <Image
            width={100}
            height={100}
            alt=""
            src="/images/Star-1.svg"
            className="w-4 absolute top-56 opacity-20 left-[850px] max-lg:hidden -z-0"
          />
          <div
            className={`
    absolute inset-0 z-10
    ${theme === "dark" ? "bg-white/5" : "bg-blue-400"}
  `}
          ></div>
          <div
            className={`
  relative z-50
  lg:w-2/4 max-lg:w-full
  max-lg:text-center max-lg:justify-center
  ${theme === "dark" ? "text-white" : "text-[#080B2A]"}
`}
          >
            <h4 className="lg:text-5xl max-lg:text-4xl font-bold pb-4">
              Why Choose Us?
            </h4>
            <p className="text-lg max-lg:text-justify mb-6">
              Leftoverz hadir untuk memberikan solusi praktis dan terpercaya
              bagi para anak kost dan perantau yang ingin menjual atau membeli
              barang bekas berkualitas dengan mudah. Kami menawarkan fitur
              pengiriman yang handal, pencarian visual yang memudahkan menemukan
              barang impian, serta sistem pembayaran otomatis yang aman dan
              cepat. Dengan Leftoverz, proses pindah kost jadi lebih ringan, dan
              kebutuhan peralatan kost baru pun bisa terpenuhi tanpa harus
              merogoh kocek dalam.
            </p>

            <Link
              href="/buyer/about"
              className={`
  px-4 mt-4 py-3 text-center w-36 rounded-full
  hover:bg-transparent
  ${
    theme === "dark"
      ? "bg-blue-400 text-white hover:text-blue-400 hover:border-2 hover:border-blue-400"
      : "bg-white text-[#080B2A] hover:text-white hover:border-2 hover:border-white"
  }
`}
            >
              About Us
            </Link>
          </div>
          <div className="lg:w-2/4 z-50 max-lg:w-full lg:flex lg:justify-end">
            <Image
              width={100}
              height={100}
              alt=""
              src="/images/hero-2.svg"
              className="lg:h-[456px] max-lg:h-60 w-full"
            />
          </div>
        </div>
        <div className="lg:p-20 max-lg:p-6 w-full relative">
          <Image
            width={100}
            height={100}
            alt=""
            src="/images/bubble-5.svg"
            className={`
  absolute z-0 -bottom-20 left-0
  lg:h-[456px] lg:w-[456px]
  max-lg:h-72 max-lg:w-72
  ${theme === "dark" ? "lg:block" : "lg:hidden"} max-lg:hidden
`}
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
            className="w-4 absolute lg:bottom-6 lg:right-96 max-lg:right-10 max-lg:bottom-0 -z-0"
          />
          <Image
            width={100}
            height={100}
            alt=""
            src="/images/Star-1.svg"
            className="w-4 absolute lg:top-20 max-lg:top-0 lg:left-56 max-lg:left-28 -z-0"
          />
          <div
            className={`
  text-center justify-center z-50
  ${theme === "dark" ? "text-white" : "text-[#080B2A]"}
`}
          >
            <h3 className="text-3xl font-bold ">Features</h3>
            <p className="">
              Fitur-fitur canggih yang memudahkan jual beli barang bekas dengan
              cepat dan aman.
            </p>

            <div className="lg:pt-14 max-lg:pt-8 lg:flex lg:justify-between max-lg:justify-center max-lg:w-full max-lg:block max-lg:space-y-4 items-center">
              <div className="border_section bg-transparent h-[350px]  rounded-xl p-5 lg:w-80 max-lg:w-full shadow-lg relative">
                <Image
                  width={100}
                  height={10}
                  alt=""
                  src="/images/camera.svg"
                  className="z-50 w-full h-3/4"
                />
                <div className="mt-4 h-1/4">
                  <p className="text-lg font-semibold ">Pencarian Visual</p>
                </div>
              </div>
              <div className="border_section bg-transparent h-[350px]  rounded-xl p-5 lg:w-80 max-lg:w-full shadow-lg relative">
                <Image
                  width={100}
                  height={10}
                  alt=""
                  src="/images/Bag.svg"
                  className="z-50 w-full h-3/4"
                />
                <div className="mt-4 h-1/4">
                  <p className="text-lg font-semibold ">
                    Pembayaran Auto Verfication
                  </p>
                </div>
              </div>
              <div className="border_section bg-transparent h-[350px]  rounded-xl p-5 lg:w-80 max-lg:w-full shadow-lg relative">
                <Image
                  width={100}
                  height={10}
                  alt=""
                  src="/images/Home.svg"
                  className="z-50 w-full h-3/4"
                />
                <div className="mt-4 h-1/4">
                  <p className="text-lg font-semibold ">
                    Terintegrasi dengan pengiriman
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:px-20 lg:pb-20 max-lg:px-6 max-lg:pb-6 w-full">
          <div className="flex flex-col items-center justify-center relative">
            <Image
              width={100}
              height={100}
              alt=""
              src="/images/Star-1.svg"
              className="w-4 absolute -bottom-8 lg:right-96 max-lg:right-11 -z-0"
            />
            <Image
              width={100}
              height={100}
              alt=""
              src="/images/Star-1.svg"
              className="w-4 absolute top-20 lg:left-56 max-lg:left-10 -z-0"
            />
            <Image
              width={100}
              height={100}
              alt=""
              src="/images/Star-1.svg"
              className="w-4 absolute lg:top-6 lg:right-20 max-lg:right-14 max-lg:top-4 -z-0"
            />
            <Image
              width={100}
              height={100}
              alt=""
              src="/images/Star-1.svg"
              className="w-8 absolute lg:top-10 max-lg:top-16 right-5 -z-0"
            />
            <div
              className={`
  pb-12 text-center
  ${theme === "dark" ? "text-white" : "text-[#080B2A]"}
`}
            >
              <h3 className="text-3xl font-bold ">How It Work?</h3>
              <p className="">
                Ikuti langkah mudah untuk jual atau beli barang bekas dengan
                cepat dan nyaman di Leftoverz.
              </p>
            </div>
            <div className="relative w-full">
              <div className="lg:px-20 max-lg:px-6 space-y-10">
                <div className="relative lg:flex max-lg:justify-center max-lg:w-full lg:justify-end">
                  <div className="relative lg:w-[580px] max-lg:-w-full p-5 text-[#080B2A] rounded-2xl border_style shadow-md bg-white/5">
                    <p className="text-xl font-bold mb-1 text-blue-400">
                      1. Login atau Registrasi
                    </p>
                    <p
                      className={`text-lg ${
                        theme === "dark" ? "text-white" : "text-[#080B2A]"
                      }`}
                    >
                      Pengguna dapat login jika sudah memiliki akun atau
                      melakukan registrasi dengan mengisi data seperti nama,
                      email, dan password.
                    </p>
                  </div>
                </div>
                <div className="relative lg:flex max-lg:block max-lg:justify-center lg:justify-start">
                  <div className="relative lg:w-[580px] max-lg:-w-full p-5 text-[#080B2A] rounded-2xl border_style shadow-md bg-white/5">
                    <p className="text-xl font-bold mb-1 text-blue-400">
                      2. Mencari Barang
                    </p>
                    <p
                      className={`text-lg ${
                        theme === "dark" ? "text-white" : "text-[#080B2A]"
                      }`}
                    >
                      Gunakan fitur pencarian dan filter untuk menemukan barang
                      yang diinginkan, lalu klik produk untuk melihat detailnya.
                    </p>
                  </div>
                </div>
                <div className="relative lg:flex max-lg:block max-lg:justify-center lg:justify-end">
                  <div className="relative lg:w-[580px] max-lg:-w-full p-5 text-[#080B2A] rounded-2xl border_style shadow-md bg-white/5">
                    <p className="text-xl font-bold mb-1 text-blue-400">
                      3. Memesan Barang
                    </p>
                    <p
                      className={`text-lg ${
                        theme === "dark" ? "text-white" : "text-[#080B2A]"
                      }`}
                    >
                      Klik &apos;Beli&apos; atau tambahkan ke favorit jika ingin
                      membeli lebih dari satu barang, lalu lanjutkan ke
                      checkout.
                    </p>
                  </div>
                </div>
                <div className="relative lg:flex max-lg:block max-lg:justify-center lg:justify-start">
                  <div className="relative lg:w-[580px] max-lg:-w-full p-5 text-[#080B2A] rounded-2xl border_style shadow-md bg-white/5">
                    <p className="text-xl font-bold mb-1 text-blue-400">
                      4. Mengisi Detail Pemesanan
                    </p>
                    <p
                      className={`text-lg ${
                        theme === "dark" ? "text-white" : "text-[#080B2A]"
                      }`}
                    >
                      Periksa pesanan, pilih metode pembayaran (transfer,
                      e-wallet, atau COD), lalu konfirmasi pesanan.
                    </p>
                  </div>
                </div>
                <div className="relative lg:flex max-lg:block max-lg:justify-center lg:justify-end">
                  <div className="relative lg:w-[580px] max-lg:-w-full p-5 text-[#080B2A] rounded-2xl border_style shadow-md bg-white/5">
                    <p className="text-xl font-bold mb-1 text-blue-400">
                      5. Pembayaran & Verifikasi Otomatis
                    </p>
                    <p
                      className={`text-lg ${
                        theme === "dark" ? "text-white" : "text-[#080B2A]"
                      }`}
                    >
                      Lakukan pembayaran sesuai instruksi. Sistem akan otomatis
                      memverifikasi tanpa perlu unggah bukti.
                    </p>
                  </div>
                </div>
                <div className="relative lg:flex max-lg:block max-lg:justify-center lg:justify-start">
                  <div className="relative lg:w-[580px] max-lg:-w-full p-5 text-[#080B2A] rounded-2xl border_style shadow-md bg-white/5">
                    <p className="text-xl font-bold mb-1 text-blue-400">
                      6. Mengambil atau Menerima Barang
                    </p>
                    <p
                      className={`text-lg ${
                        theme === "dark" ? "text-white" : "text-[#080B2A]"
                      }`}
                    >
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
        <div className="lg:px-20 lg:pb-20 max-lg:px-6 max-lg:pb-6 w-full justify-center relative">
          <Image
            width={100}
            height={100}
            alt=""
            src="/images/bubble-6.svg"
            className={`
  lg:w-[456px] max-lg:w-72 absolute -top-44 left-0 -z-0
  ${theme === "dark" ? "block" : "hidden"}
`}
          />
          <Image
            width={100}
            height={100}
            alt=""
            src="/images/bubble-7.svg"
            className={`
  lg:w-[456px] max-lg:w-72 absolute -bottom-10 right-0 -z-0
  ${theme === "dark" ? "block" : "hidden"}
`}
          />
          <Image
            width={100}
            height={100}
            alt=""
            src="/images/Star-1.svg"
            className="w-8 absolute top-44 right-20 max-lg:hidden -z-0"
          />
          <div
            className={`
  pb-12 text-center 
  ${theme === "dark" ? "text-white" : "text-[#080B2A]"}
`}
          >
            <h3 className="text-3xl font-bold ">Newly Added Product</h3>
            <p className="">
              Temukan produk-produk terbaru yang baru saja ditambahkan dan siap
              untuk kamu miliki.
            </p>
          </div>
          {loading ? (
            <div className="flex justify-center w-full py-10">
              <p className="text-blue-400 text-lg">Loading...</p>
            </div>
          ) : (
            <div className="lg:flex justify-center w-full max-lg:space-y-4 gap-10 z-50 items-center flex-wrap">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="lg:w-80 max-lg:w-full p-6 rounded-xl border_section shadow-lg bg-white/5 relative"
                >
                  <div className="mb-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="w-9 h-9 bg-blue-400 rounded-full flex items-center justify-center text-white">
                        {product.seller?.name
                          ? product.seller.name
                              .split(" ")
                              .map((word) => word.charAt(0))
                              .join("")
                              .toUpperCase()
                          : "?"}
                      </span>
                      <p className="text-blue-400 font-semibold">
                        {product.seller?.name}
                      </p>
                    </div>
                    <Link
                      href={`/product/${product.id}`}
                      className="bg-blue-400 px-4 py-1 text-center text-white rounded-lg hover:bg-transparent z-20 hover:text-blue-400 hover:border-2 hover:border-blue-400"
                    >
                      Detail
                    </Link>
                  </div>
                  <div className="mb-5">
                    <Image
                      src={
                        product.image &&
                        Array.isArray(product.image) &&
                        product.image.length > 0 &&
                        typeof product.image[0] === "string" &&
                        product.image[0].startsWith("/")
                          ? `https://backend-leftoverz-production.up.railway.app${product.image[0]}`
                          : "/images/default-product.png"
                      }
                      alt={product.name}
                      width={100}
                      height={100}
                      className={`w-full h-64 object-cover rounded-2xl ${
                        theme === "dark" ? "" : "border-[1.9px] border-blue-400"
                      }`}
                    />
                  </div>
                  <div className="mt-4">
                    <h3 className="text-blue-400 text-lg font-bold">
                      {product.name}
                    </h3>
                    <p className="text-blue-400 text-base">
                      {product.user?.subdistrict}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-center mt-10">
            <Link
              href="/buyer/product"
              className="bg-blue-400 px-4 py-3 text-center dark:text-white text-[#080B2A] w-36 rounded-full hover:bg-transparent hover:text-blue-400 hover:border-2 hover:border-blue-text-blue-400"
            >
              Next
            </Link>
          </div>
        </div>
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          title="Toggle theme"
          className={`fixed bottom-6 lg:right-20 max-md:right-8 z-50 p-3 rounded-full bg-blue-400 ${
            theme === "dark"
              ? "text-white border border-white"
              : "text-[#080B2A] border border-[#080B2A]"
          }
`}
        >
          {theme === "dark" ? (
            <svg
              role="graphics-symbol"
              viewBox="0 0 15 15"
              width="15"
              height="15"
              fill="none"
              className={`${theme === "dark" ? "block" : "hidden"} w-7 h-7`}
            >
              <path
                d="M2.89998 0.499976C2.89998 0.279062 2.72089 0.0999756 2.49998 0.0999756C2.27906 0.0999756 2.09998 0.279062 2.09998 0.499976V1.09998H1.49998C1.27906 1.09998 1.09998 1.27906 1.09998 1.49998C1.09998 1.72089 1.27906 1.89998 1.49998 1.89998H2.09998V2.49998C2.09998 2.72089 2.27906 2.89998 2.49998 2.89998C2.72089 2.89998 2.89998 2.72089 2.89998 2.49998V1.89998H3.49998C3.72089 1.89998 3.89998 1.72089 3.89998 1.49998C3.89998 1.27906 3.72089 1.09998 3.49998 1.09998H2.89998V0.499976ZM5.89998 3.49998C5.89998 3.27906 5.72089 3.09998 5.49998 3.09998C5.27906 3.09998 5.09998 3.27906 5.09998 3.49998V4.09998H4.49998C4.27906 4.09998 4.09998 4.27906 4.09998 4.49998C4.09998 4.72089 4.27906 4.89998 4.49998 4.89998H5.09998V5.49998C5.09998 5.72089 5.27906 5.89998 5.49998 5.89998C5.72089 5.89998 5.89998 5.72089 5.89998 5.49998V4.89998H6.49998C6.72089 4.89998 6.89998 4.72089 6.89998 4.49998C6.89998 4.27906 6.72089 4.09998 6.49998 4.09998H5.89998V3.49998ZM1.89998 6.49998C1.89998 6.27906 1.72089 6.09998 1.49998 6.09998C1.27906 6.09998 1.09998 6.27906 1.09998 6.49998V7.09998H0.499976C0.279062 7.09998 0.0999756 7.27906 0.0999756 7.49998C0.0999756 7.72089 0.279062 7.89998 0.499976 7.89998H1.09998V8.49998C1.09998 8.72089 1.27906 8.89997 1.49998 8.89997C1.72089 8.89997 1.89998 8.72089 1.89998 8.49998V7.89998H2.49998C2.72089 7.89998 2.89998 7.72089 2.89998 7.49998C2.89998 7.27906 2.72089 7.09998 2.49998 7.09998H1.89998V6.49998ZM8.54406 0.98184L8.24618 0.941586C8.03275 0.917676 7.90692 1.1655 8.02936 1.34194C8.17013 1.54479 8.29981 1.75592 8.41754 1.97445C8.91878 2.90485 9.20322 3.96932 9.20322 5.10022C9.20322 8.37201 6.82247 11.0878 3.69887 11.6097C3.45736 11.65 3.20988 11.6772 2.96008 11.6906C2.74563 11.702 2.62729 11.9535 2.77721 12.1072C2.84551 12.1773 2.91535 12.2458 2.98667 12.3128L3.05883 12.3795L3.31883 12.6045L3.50684 12.7532L3.62796 12.8433L3.81491 12.9742L3.99079 13.089C4.11175 13.1651 4.23536 13.2375 4.36157 13.3059L4.62496 13.4412L4.88553 13.5607L5.18837 13.6828L5.43169 13.7686C5.56564 13.8128 5.70149 13.8529 5.83857 13.8885C5.94262 13.9155 6.04767 13.9401 6.15405 13.9622C6.27993 13.9883 6.40713 14.0109 6.53544 14.0298L6.85241 14.0685L7.11934 14.0892C7.24637 14.0965 7.37436 14.1002 7.50322 14.1002C11.1483 14.1002 14.1032 11.1453 14.1032 7.50023C14.1032 7.25044 14.0893 7.00389 14.0623 6.76131L14.0255 6.48407C13.991 6.26083 13.9453 6.04129 13.8891 5.82642C13.8213 5.56709 13.7382 5.31398 13.6409 5.06881L13.5279 4.80132L13.4507 4.63542L13.3766 4.48666C13.2178 4.17773 13.0353 3.88295 12.8312 3.60423L12.6782 3.40352L12.4793 3.16432L12.3157 2.98361L12.1961 2.85951L12.0355 2.70246L11.8134 2.50184L11.4925 2.24191L11.2483 2.06498L10.9562 1.87446L10.6346 1.68894L10.3073 1.52378L10.1938 1.47176L9.95488 1.3706L9.67791 1.2669L9.42566 1.1846L9.10075 1.09489L8.83599 1.03486L8.54406 0.98184ZM10.4032 5.30023C10.4032 4.27588 10.2002 3.29829 9.83244 2.40604C11.7623 3.28995 13.1032 5.23862 13.1032 7.50023C13.1032 10.593 10.596 13.1002 7.50322 13.1002C6.63646 13.1002 5.81597 12.9036 5.08355 12.5522C6.5419 12.0941 7.81081 11.2082 8.74322 10.0416C8.87963 10.2284 9.10028 10.3497 9.34928 10.3497C9.76349 10.3497 10.0993 10.0139 10.0993 9.59971C10.0993 9.24256 9.84965 8.94373 9.51535 8.86816C9.57741 8.75165 9.63653 8.63334 9.6926 8.51332C9.88358 8.63163 10.1088 8.69993 10.35 8.69993C11.0403 8.69993 11.6 8.14028 11.6 7.44993C11.6 6.75976 11.0406 6.20024 10.3505 6.19993C10.3853 5.90487 10.4032 5.60464 10.4032 5.30023Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
          ) : (
            <svg
              role="graphics-symbol"
              viewBox="0 0 15 15"
              width="15"
              height="15"
              fill="none"
              className={`${theme === "dark" ? "hidden" : "block"} w-7 h-7`}
            >
              <path
                d="M7.5 0C7.77614 0 8 0.223858 8 0.5V2.5C8 2.77614 7.77614 3 7.5 3C7.22386 3 7 2.77614 7 2.5V0.5C7 0.223858 7.22386 0 7.5 0ZM2.1967 2.1967C2.39196 2.00144 2.70854 2.00144 2.90381 2.1967L4.31802 3.61091C4.51328 3.80617 4.51328 4.12276 4.31802 4.31802C4.12276 4.51328 3.80617 4.51328 3.61091 4.31802L2.1967 2.90381C2.00144 2.70854 2.00144 2.39196 2.1967 2.1967ZM0.5 7C0.223858 7 0 7.22386 0 7.5C0 7.77614 0.223858 8 0.5 8H2.5C2.77614 8 3 7.77614 3 7.5C3 7.22386 2.77614 7 2.5 7H0.5ZM2.1967 12.8033C2.00144 12.608 2.00144 12.2915 2.1967 12.0962L3.61091 10.682C3.80617 10.4867 4.12276 10.4867 4.31802 10.682C4.51328 10.8772 4.51328 11.1938 4.31802 11.3891L2.90381 12.8033C2.70854 12.9986 2.39196 12.9986 2.1967 12.8033ZM12.5 7C12.2239 7 12 7.22386 12 7.5C12 7.77614 12.2239 8 12.5 8H14.5C14.7761 8 15 7.77614 15 7.5C15 7.22386 14.7761 7 14.5 7H12.5ZM10.682 4.31802C10.4867 4.12276 10.4867 3.80617 10.682 3.61091L12.0962 2.1967C12.2915 2.00144 12.608 2.00144 12.8033 2.1967C12.9986 2.39196 12.9986 2.70854 12.8033 2.90381L11.3891 4.31802C11.1938 4.51328 10.8772 4.51328 10.682 4.31802ZM8 12.5C8 12.2239 7.77614 12 7.5 12C7.22386 12 7 12.2239 7 12.5V14.5C7 14.7761 7.22386 15 7.5 15C7.77614 15 8 14.7761 8 14.5V12.5ZM10.682 10.682C10.8772 10.4867 11.1938 10.4867 11.3891 10.682L12.8033 12.0962C12.9986 12.2915 12.9986 12.608 12.8033 12.8033C12.608 12.9986 12.2915 12.9986 12.0962 12.8033L10.682 11.3891C10.4867 11.1938 10.4867 10.8772 10.682 10.682ZM5.5 7.5C5.5 6.39543 6.39543 5.5 7.5 5.5C8.60457 5.5 9.5 6.39543 9.5 7.5C9.5 8.60457 8.60457 9.5 7.5 9.5C6.39543 9.5 5.5 8.60457 5.5 7.5ZM7.5 4.5C5.84315 4.5 4.5 5.84315 4.5 7.5C4.5 9.15685 5.84315 10.5 7.5 10.5C9.15685 10.5 10.5 9.15685 10.5 7.5C10.5 5.84315 9.15685 4.5 7.5 4.5Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
          )}
        </button>
      </main>
    </div>
  );
}

export default withAuth(BuyerHome);