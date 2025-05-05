"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

type Product = {
  id: number;
  name: string;
  email: string;
  no_hp: string;
  role: string;
  image: string[];
  description: string;
  price: number;
  status: string;
  user_id: number;
  seller?: { name: string };
  user?: {
    subdistrict: string;
    ward: string;
    regency: string;
    province: string;
  };
};

export default function ProductDetail() {
  const params = useParams();
  const productId = params?.id;
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:1031/api/v1/product/detail/${productId}`
        );
        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        let parsedImage = data.product.image;

        try {
          parsedImage = JSON.parse(parsedImage);
        } catch {
          console.log("Image is not in valid JSON format, skipping parsing.");
        }

        console.log("Parsed image data:", parsedImage);

        const formattedImages = Array.isArray(parsedImage)
          ? parsedImage.map(
              (imgUrl: string) => `http://127.0.0.1:1031${imgUrl}`
            )
          : parsedImage?.url
          ? [`http://127.0.0.1:1031${parsedImage.url}`]
          : [];

        setProduct({
          ...data.product,
          image: formattedImages,
        });

        setSelectedImage(formattedImages[0] || null);
        setLoading(false);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error(err.message);
        } else {
          console.error("An unknown error occurred");
        }
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="bg-[#080B2A] min-h-screen flex flex-col items-center">
      <Image
        width={100}
        height={100}
        alt=""
        src="/images/bubble.svg"
        className="h-[356px] w-[356px] absolute top-0 left-0 -z-0 max-lg:hidden"
      />
      <Image
        width={100}
        height={100}
        alt=""
        src="/images/bubble-2.svg"
        className="h-[356px] w-[356px] absolute top-0 right-0 max-lg:hidden"
      />
      <Image
        width={100}
        height={100}
        alt=""
        src="/images/Star-1.svg"
        className="w-8 absolute top-28 max-lg:hidden right-26 -z-0"
      />
      <Image
        width={100}
        height={100}
        alt=""
        src="/images/Star-1.svg"
        className="w-4 absolute top-28 right-96 max-lg:hidden -z-0"
      />
      <Image
        width={100}
        height={100}
        alt=""
        src="/images/Star-1.svg"
        className="w-4 absolute top-[750px] left-56 max-lg:hidden -z-0"
      />
      <Image
        width={100}
        height={100}
        alt=""
        src="/images/Star-1.svg"
        className="w-4 absolute top-[700px] max-lg:hidden right-[300px] -z-0"
      />
      <div className="md:flex md:gap-10 max-lg:gap-4 md:p-20 max-lg:px-6 w-full max-lg:py-14 mt-10 h-auto">
        <div className="md:w-4/12 max-lg:w-full z-40 max-lg:mb-4">
          <div className="h-96 rounded-lg overflow-hidden">
            {product && (
              <Image
                src={selectedImage ?? "/placeholder.jpg"}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-96 object-cover rounded-lg"
              />
            )}
          </div>
          <div className="grid grid-cols-5 gap-4 md:mt-6 max-lg:mt-0">
            {product?.image.map((img, index) => (
              <button key={index} onClick={() => setSelectedImage(img)}>
                <Image
                  src={img}
                  alt={`Thumbnail ${index}`}
                  width={100}
                  height={100}
                  className="md:w-24 md:h-24 max-lg:h-16 object-cover rounded-lg"
                />
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4 md:w-8/12 max-lg:w-full block items-center relative">
          <div className="block">
            <h3 className="text-white text-xl mb-2 font-bold tracking-wide">
              {product?.name}
            </h3>
            <p className="mb-2 !capitalize">
              {product?.user?.ward}, {product?.user?.subdistrict},{" "}
              {product?.user?.regency}, {product?.user?.province}
            </p>
            <div className="flex items-center mb-8 gap-2">
              <span className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center">
                {product?.seller?.name
                  ? product?.seller.name
                      .split(" ")
                      .map((word) => word.charAt(0))
                      .join("")
                      .toUpperCase()
                  : "?"}
              </span>
              <p className="text-blue-400 font-semibold">
                {product?.seller?.name}
              </p>
            </div>
            <p className="text-base max-lg:text-justify">
              {product?.description}
            </p>
          </div>
          <div className="flex items-center gap-4 md:absolute max-lg:mt-4 max-lg:justify-end md:bottom-0 md:right-0">
            <Image
              src="/images/heart-remove.svg"
              width={100}
              height={100}
              alt=""
              className="w-8 h-8 text-white"
            />
            <Link
              href=""
              className="bg-[#15BFFD] px-6 py-3 text-center w-40 text-white rounded-full hover:bg-transparent z-50 hover:text-[#15BFFD] hover:border-2 hover:border-[#15BFFD]"
            >
              Beli
            </Link>
          </div>
        </div>
      </div>
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="bg-[#15BFFD] hover:bg-blue-400 text-white p-4 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <Image
            width={100}
            height={100}
            alt=""
            src="/images/chat.svg"
            className="w-8 h-8"
          />
        </button>

        {isChatOpen && (
          <div className="mt-4 w-80 bg-white border_section rounded-2xl shadow-xl overflow-hidden animate-fade-in">
            <div className="bg-[#15BFFD] text-white px-4 py-3 font-semibold flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-gray-300 rounded-full"></span>
                <p className="text-white font-semibold">Alien</p>
              </div>
              <button onClick={() => setIsChatOpen(false)}>
                <svg
                  className="w-6 h-6 text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18 17.94 6M18 18 6.06 6"
                  />
                </svg>
              </button>
            </div>
            <div className="p-4 max-h-60 overflow-y-auto space-y-3 text-sm">
              <div className="text-gray-700 bg-gray-300 w-fit p-2 rounded-lg">
                Halo! Ada yang bisa kami bantu?
              </div>
              <div className="text-white bg-[#15BFFD] p-2 rounded-lg self-end text-right ml-auto w-fit">
                Ya, saya ingin tanya tentang produk.
              </div>
            </div>
            <div className="border-t px-4 py-2 bg-gray-50">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Tulis pesan..."
                  className="flex-grow px-3 py-2 text-sm border rounded-lg focus:outline-none"
                />
                <button
                  type="submit"
                  className="text-white bg-[#15BFFD] px-3 py-2 rounded-lg text-sm hover:bg-blue-400"
                >
                  Kirim
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
