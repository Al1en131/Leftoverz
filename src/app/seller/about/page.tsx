"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import "flowbite";
import "flowbite/dist/flowbite.css";
import { useTheme } from "next-themes";

export default function About() {
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    import("flowbite").then((flowbite) => {
      flowbite.initAccordions();
    });
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={`items-center ${
        theme === "dark" ? "dark:bg-[#080B2A]" : "bg-white"
      } min-h-screen`}
    >
      <main className="">
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
          src="/images/Star-1.svg"
          className="w-4 absolute top-28 right-8 max-lg:hidden -z-0"
        />
        <Image
          width={100}
          height={100}
          alt=""
          src="/images/Star-1.svg"
          className="w-4 absolute top-[400px] right-32 max-lg:hidden -z-0"
        />
        <Image
          width={100}
          height={100}
          alt=""
          src="/images/Star-1.svg"
          className="w-4 absolute top-44 left-10 max-lg:hidden -z-0"
        />
        <Image
          width={100}
          height={100}
          alt=""
          src="/images/Star-1.svg"
          className="w-4 absolute top-36 left-[550px] max-lg:hidden -z-0"
        />
        <div
          className={`pt-28 lg:pb-20 max-lg:pb-10 w-full lg:px-20 max-lg:px-6 flex flex-col items-center gap-6 relative ${
            theme === "dark" ? "bg-white/5" : "bg-black/5"
          }`}
        >
          <div className="relative w-full">
            <Image
              width={600}
              height={400}
              alt="Hero About"
              src="/images/hero-about.jpg"
              className="rounded-2xl w-full h-64"
            />
            <div
              className={`absolute top-0 left-0 w-full h-full rounded-2xl z-20 ${
                theme === "dark" ? "bg-black opacity-40" : "bg-white/20"
              }`}
            ></div>{" "}
            <h1
              className={`max-lg:text-4xl lg:text-6xl tracking-wide font-bold text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 ${
                theme === "dark" ? "text-white" : "text-[#080B2A]"
              }`}
            >
              About Us
            </h1>
          </div>
        </div>
        <div className="py-10 lg:px-20 max-lg:px-6">
          <p
            className={`
      text-base text-justify mb-4 tracking-wide
      ${theme === "dark" ? "text-white" : "text-blue-400"}
    `}
          >
            Leftoverz adalah sebuah website marketplace yang khusus menyediakan
            barang-barang bekas anak kost. Marketplace ini dirancang untuk
            memudahkan anak-anak kost yang akan lulus dan meninggalkan kostnya
            agar bisa menjual barang-barang bekas kost mereka dengan mudah dan
            cepat. Dengan Leftoverz, mereka tidak perlu repot membawa banyak
            barang saat pindah atau pulang, terutama bagi yang berasal dari luar
            pulau, sehingga proses pindahan menjadi lebih ringan dan efisien.
          </p>
          <p
            className={`
      text-base text-justify mb-4 tracking-wide
      ${theme === "dark" ? "text-white" : "text-blue-400"}
    `}
          >
            Selain itu, Leftoverz juga membantu mahasiswa atau perantau baru
            dalam mencari barang berkualitas dengan harga yang lebih terjangkau.
            Kamu bisa menemukan berbagai kebutuhan kost, mulai dari peralatan
            dapur, elektronik, hingga perabotan rumah dengan kondisi yang masih
            bagus. Hal ini tentu sangat menghemat biaya dan waktu dibandingkan
            membeli barang baru.
          </p>
          <p
            className={`
      text-base text-justify mb-4 tracking-wide
      ${theme === "dark" ? "text-white" : "text-blue-400"}
    `}
          >
            Marketplace ini juga menyediakan fitur unggulan untuk mendukung
            pengalaman pengguna. Fitur pengiriman barang memungkinkan kamu untuk
            mengirim barang secara aman dan terpercaya ke alamat tujuan, baik
            dalam satu kota maupun antar pulau. Dengan sistem ini, kamu tak
            perlu khawatir soal logistik dan dapat fokus pada proses jual beli.
          </p>
          <p
            className={`
      text-base text-justify mb-4 tracking-wide
      ${theme === "dark" ? "text-white" : "text-blue-400"}
    `}
          >
            Fitur Visual Search mempermudah pencarian produk dengan cara yang
            lebih interaktif. Cukup dengan mengunggah foto barang yang kamu
            cari, Leftoverz akan membantu menemukan produk serupa yang tersedia
            di marketplace. Ini sangat membantu bagi kamu yang belum tahu nama
            atau spesifikasi barang yang diinginkan.
          </p>
          <p
            className={`
      text-base text-justify mb-4 tracking-wide
      ${theme === "dark" ? "text-white" : "text-blue-400"}
    `}
          >
            Untuk kemudahan transaksi, Leftoverz juga menerapkan sistem
            pembayaran dengan auto-verification. Sistem ini memastikan
            pembayaran kamu terverifikasi secara otomatis tanpa harus menunggu
            konfirmasi manual, sehingga proses transaksi menjadi cepat dan aman.
          </p>
          <p
            className={`
      text-base text-justify mb-4 tracking-wide
      ${theme === "dark" ? "text-white" : "text-blue-400"}
    `}
          >
            Leftoverz dibuat oleh Alif Essa Nurcahyani, seorang mahasiswi
            Universitas Muhammadiyah PKU Surakarta yang memiliki pengalaman
            lebih dari satu tahun sebagai web developer. Melalui proyek ini,
            Alif berharap dapat memberikan solusi praktis dan bermanfaat bagi
            kebutuhan anak kost dan perantau di Indonesia, membantu mereka
            beradaptasi dan menjalani kehidupan kost dengan lebih mudah dan
            hemat.
          </p>
        </div>

        <div className="lg:px-20 lg:py-10 max-lg:px-6 max-lg:py-10 relative">
          <Image
            width={100}
            height={100}
            alt=""
            src="/images/Star-1.svg"
            className="w-8 absolute lg:bottom-20 max-lg:bottom-2 right-10 -z-0"
          />
          <Image
            width={100}
            height={100}
            alt=""
            src="/images/Star-1.svg"
            className="w-4 absolute top-28 right-32 -z-0"
          />
          <Image
            width={100}
            height={100}
            alt=""
            src="/images/Star-1.svg"
            className="w-4 absolute top-36 left-96 max-lg:hidden -z-0"
          />
          <Image
            width={100}
            height={100}
            alt=""
            src="/images/Star-1.svg"
            className="w-4 absolute lg:bottom-28 max-lg:bottom-4 left-20 -z-0"
          />
          <div
            className={`
  justify-center w-full text-center mb-10
  ${theme === "dark" ? "text-white" : "text-blue-400"}
`}
          >
            <h3 className="text-4xl font-bold mb-1">Question</h3>
            <p className="text-base text-gray-600">
              Jawaban dari pertanyaan ini akan muncul di sini.
            </p>
          </div>
          <div className="lg:flex max-lg:block gap-10 items-center max-lg:space-y-6">
            <div className="relative">
              <Image
                width={100}
                height={100}
                alt=""
                src="/images/bubble-8.svg"
                className={`
  ${theme === "dark" ? "dark:block" : "hidden"}
  absolute
  lg:h-[556px] lg:w-[556px]
  max-lg:w-72 max-lg:h-72
  lg:-top-48 max-lg:-top-20
  lg:-left-28 max-lg:-left-5
  -z-0
`}
              />
              <Image
                width={100}
                height={100}
                alt=""
                src="/images/bubble-8.svg"
                className={`
  absolute
  lg:h-[556px] lg:w-[556px]
  max-lg:w-72 max-lg:h-72
  ${theme === "dark" ? "block" : "hidden"}
  lg:top-0 max-lg:bottom-0
  lg:-right-20 max-lg:-right-5
  -z-0
`}
              />
              <div className="max-lg:flex max-lg:justify-center max-lg:items-center">
                <Image
                  width={600}
                  height={400}
                  alt="Hero About"
                  src="/images/question.png"
                  className="lg:w-[650px] max-lg:w-[400px] lg:h-[450px] max-lg:h-[380px] relative z-50"
                />
              </div>
            </div>
            <div className="w-full">
              <div id="accordion-open" data-accordion="open">
                {/* FAQ 1 */}
                <h2 id="accordion-open-heading-1">
                  <button
                    type="button"
                    className={`flex items-center justify-between w-full p-5 font-medium bg-white/10 rtl:text-right border-b-0 border_accordion rounded-t-xl ${
                      theme === "dark" ? "text-white" : "text-blue-400"
                    }`}
                    data-accordion-target="#accordion-open-body-1"
                    aria-expanded="true"
                    aria-controls="accordion-open-body-1"
                  >
                    <span className="flex items-center">
                      <svg
                        className="w-5 h-5 me-2 shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      Bagaimana cara membeli produk?
                    </span>
                    <svg
                      className="w-3 h-3 rotate-180 shrink-0"
                      fill="none"
                      viewBox="0 0 10 6"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5 5 1 1 5"
                      />
                    </svg>
                  </button>
                </h2>
                <div
                  id="accordion-open-body-1"
                  className="hidden"
                  aria-labelledby="accordion-open-heading-1"
                >
                  <div className="p-5 border-b-0 border_accordion2 bg-white/10">
                    <p className="mb-2 text-blue-400">
                      Untuk membeli produk, anda perlu mendaftar dulu sebagai
                      pembeli, kemudian silakan pilih produk yang diinginkan di
                      halaman produk, klik tombol &quot;Detail&quot; untuk
                      melihat rincian produk, kemudian jika sudah merasa yakin
                      maka klik tombol &quot;Beli&quot; dan ikuti instruksi
                      untuk menyelesaikan transaksi. Anda dapat memilih metode
                      pembayaran.
                    </p>
                  </div>
                </div>

                {/* FAQ 2 */}
                <h2 id="accordion-open-heading-2">
                  <button
                    type="button"
                    className={`flex items-center justify-between w-full p-5 font-medium bg-white/10 rtl:text-right border-b-0 border_accordion2 ${
                      theme === "dark" ? "text-white" : "text-blue-400"
                    }`}
                    data-accordion-target="#accordion-open-body-2"
                    aria-expanded="false"
                    aria-controls="accordion-open-body-2"
                  >
                    <span className="flex items-center">
                      <svg
                        className="w-5 h-5 me-2 shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      Bagaimana cara menjual produk saya?
                    </span>
                    <svg
                      className="w-3 h-3 rotate-180 shrink-0"
                      fill="none"
                      viewBox="0 0 10 6"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5 5 1 1 5"
                      />
                    </svg>
                  </button>
                </h2>
                <div
                  id="accordion-open-body-2"
                  className="hidden"
                  aria-labelledby="accordion-open-heading-2"
                >
                  <div className="p-5 border-b-0 border_accordion2 bg-white/10">
                    <p className="mb-2 text-blue-400">
                      Untuk menjual produk, Anda perlu mendaftar sebagai penjual
                      terlebih dahulu. Setelah itu, masuk ke dashboard Anda dan
                      pilih &quot;Tambah Produk&quot;, lalu isi detail produk
                      dan unggah gambar. Produk Anda akan ditampilkan setelah
                      disimpan.
                    </p>
                  </div>
                </div>

                {/* FAQ 3 */}
                <h2 id="accordion-open-heading-3">
                  <button
                    type="button"
                    className={`flex items-center justify-between w-full p-5 font-medium bg-white/10 rtl:text-right border-b-0 border_accordion2 ${
                      theme === "dark" ? "text-white" : "text-blue-400"
                    }`}
                    data-accordion-target="#accordion-open-body-3"
                    aria-expanded="false"
                    aria-controls="accordion-open-body-3"
                  >
                    <span className="flex items-center">
                      <svg
                        className="w-5 h-5 me-2 shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      Apakah saya bisa mengatur alamat pengiriman saya?
                    </span>
                    <svg
                      className="w-3 h-3 rotate-180 shrink-0"
                      fill="none"
                      viewBox="0 0 10 6"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5 5 1 1 5"
                      />
                    </svg>
                  </button>
                </h2>
                <div
                  id="accordion-open-body-3"
                  className="hidden"
                  aria-labelledby="accordion-open-heading-3"
                >
                  <div className="p-5 border-b-0 border_accordion2 bg-white/10">
                    <p className="mb-2 text-blue-400">
                      Ya, Anda bisa mengatur alamat pengiriman melalui halaman
                      profil Anda. Pastikan alamat diisi dengan lengkap agar
                      proses pengiriman berjalan lancar.
                    </p>
                  </div>
                </div>
              </div>
            </div>
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
