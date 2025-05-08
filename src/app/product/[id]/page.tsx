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
        </div>
      </div>
    </div>
  );
}
