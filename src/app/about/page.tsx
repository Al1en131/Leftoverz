"use client";

import Image from "next/image";
import { useEffect } from "react";
import "flowbite";
import "flowbite/dist/flowbite.css";

export default function About() {
  useEffect(() => {
    import("flowbite").then((flowbite) => {
      flowbite.initAccordions();
    });
  }, []);
  return (
    <div className="items-center bg-[#080B2A] min-h-screen ">
      <main className="">
        <Image
          width={100}
          height={100}
          alt=""
          src="/images/bubble.svg"
          className="h-[356px] w-[356px] max-lg:hidden absolute top-0 left-0"
        />
        <Image
          width={100}
          height={100}
          alt=""
          src="/images/bubble-2.svg"
          className="h-[356px] w-[356px] absolute max-lg:hidden top-0 right-0"
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
        <div className="bg-white/5 pt-28 md:pb-20 pb-10 w-full md:px-20 px-6 flex flex-col items-center gap-6 relative">
          <div className="relative w-full">
            <Image
              width={600}
              height={400}
              alt="Hero About"
              src="/images/hero-about.jpg"
              className="rounded-2xl w-full h-64"
            />
            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-40 rounded-2xl z-40"></div>{" "}
            <h1 className="text-4xl md:text-8xl tracking-wide text-white font-bold text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
              About Us
            </h1>
          </div>
        </div>
        <div className="py-10 md:px-20 px-6">
          <p className="text-white text-base md:text-center max-lg:text-justify tracking-wide">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry&apos;s standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
          </p>
        </div>
        <div className="md:px-20 md:py-20 px-6 py-10 relative">
          <Image
            width={100}
            height={100}
            alt=""
            src="/images/Star-1.svg"
            className="w-8 absolute md:bottom-20 bottom-2 right-10 -z-0"
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
            className="w-4 absolute md:bottom-28 bottom-4 left-20 -z-0"
          />
          <div className="justify-center w-full text-center mb-10">
            <h3 className="text-4xl text-white font-bold mb-1">Question</h3>
            <p>Lorem ipsum</p>
          </div>
          <div className="md:flex block gap-10 items-center max-lg:space-y-6">
            <div className="relative">
              <Image
                width={100}
                height={100}
                alt=""
                src="/images/bubble-8.svg"
                className="md:h-[556px] md:w-[556px] w-72 h-72 absolute md:-top-48 -top-20 md:-left-28  -left-5 -z-0"
              />
              <Image
                width={100}
                height={100}
                alt=""
                src="/images/bubble-8.svg"
                className="md:h-[556px] md:w-[556px] w-72 h-72 absolute md:top-0 bottom-0 md:-right-20 -right-5 -z-0"
              />
              <Image
                width={600}
                height={400}
                alt="Hero About"
                src="/images/question.png"
                className="md:w-[650px] w-[400px] md:h-[450px] h-[380px] relative z-50"
              />
            </div>
            <div className="w-full">
              <div id="accordion-open" data-accordion="open">
                <h2 id="accordion-open-heading-1">
                  <button
                    type="button"
                    className="flex items-center justify-between w-full p-5 font-medium bg-white/10 rtl:text-right text-white border-b-0 border_accordion rounded-t-xl "
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
                      </svg>{" "}
                      What is Flowbite?
                    </span>
                    <svg
                      data-accordion-icon
                      className="w-3 h-3 rotate-180 shrink-0"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
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
                    <p className="mb-2 text-[#15BFFD]">
                      Flowbite is an open-source library of interactive
                      components built on top of Tailwind CSS including buttons,
                      dropdowns, modals, navbars, and more.
                    </p>
                  </div>
                </div>
                <h2 id="accordion-open-heading-2">
                  <button
                    type="button"
                    className="flex items-center justify-between w-full p-5 font-medium bg-white/10 rtl:text-right text-white border-b-0 border_accordion2"
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
                      Is there a Figma file available?
                    </span>
                    <svg
                      data-accordion-icon
                      className="w-3 h-3 rotate-180 shrink-0"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
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
                    <p className="mb-2 text-[#15BFFD]">
                      Flowbite is first conceptualized and designed using the
                      Figma software so everything you see in the library has a
                      design equivalent in our Figma file.
                    </p>
                    <p className="text-gray-500 dark:text-gray-400">
                      Check out the{" "}
                      <a
                        href="https://flowbite.com/figma/"
                        className="text-blue-600 dark:text-blue-500 hover:underline"
                      >
                        Figma design system
                      </a>{" "}
                      based on the utility classNamees from Tailwind CSS and
                      components from Flowbite.
                    </p>
                  </div>
                </div>
                <h2 id="accordion-open-heading-3">
                  <button
                    type="button"
                    className="flex items-center justify-between w-full p-5 font-medium bg-white/10 rtl:text-right text-white border-b-0 border_accordion2"
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
                      </svg>{" "}
                      What are the differences between Flowbite and Tailwind UI?
                    </span>
                    <svg
                      data-accordion-icon
                      className="w-3 h-3 rotate-180 shrink-0"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
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
                    <p className="mb-2 text-[#15BFFD]">
                      The main difference is that the core components from
                      Flowbite are open source under the MIT license, whereas
                      Tailwind UI is a paid product. Another difference is that
                      Flowbite relies on smaller and standalone components,
                      whereas Tailwind UI offers sections of pages.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
