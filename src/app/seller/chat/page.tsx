import Image from "next/image";

export default function RoomChat() {
  return (
    <div className="items-center bg-[#080B2A] min-h-screen">
      <main>
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
        <div className="bg-white/5 pt-28 pb-20 w-full lg:px-20 max-lg:px-6 flex flex-col items-center gap-6 relative">
          <div className="relative w-full">
            <Image
              width={600}
              height={400}
              alt="Hero About"
              src="/images/hero-product.jpg"
              className="rounded-2xl w-full h-64"
            />

            <div className="absolute top-0 left-0 w-full h-full bg-black/50 backdrop-blur-md rounded-2xl flex flex-col justify-center max-lg:p-6 md:ps-20 gap-2 text-white z-40">
              <h1 className="lg:text-6xl max-lg:text-4xl font-bold">Chat</h1>
              <p className="max-lg:text-base md:text-lg max-w-3xl">
                Contrary to popular belief, Lorem Ipsum is not simply random
                text. It has roots in a piece of classical Latin literature from
                45 BC, making it over 2000 years old.
              </p>
            </div>
          </div>
        </div>
        <div className="lg:px-20 max-lg:px-6 py-10 justify-center items-center rounded-lg ">
          <div className="bg-white/5 p-10 rounded-2xl border-2 border-blue-400">
            <div className="lg:flex lg:flex-row lg:justify-between max-lg:block z-50">
              <div className="flex flex-col lg:w-2/5 max-lg:w-full lg:border-r-2 overflow-y-auto">
                <div className="border-b-2 py-4 px-2">
                  <input
                    type="text"
                    placeholder="search chatting"
                    className="py-2 px-2 border-2 border-gray-200 rounded-2xl w-full"
                  />
                </div>
                <div className="flex flex-row py-4 px-2 justify-center items-center border-b-2">
                  <div className="w-1/4">
                    <Image
                      width={100}
                      height={100}
                      src="/images/profile.jpg"
                      className="object-cover h-12 w-12 rounded-full"
                      alt=""
                    />
                  </div>
                  <div className="w-full">
                    <div className="text-lg font-semibold">Luis1994</div>
                    <span className="text-gray-500">Pick me at 9:00 Am</span>
                  </div>
                </div>
                <div className="flex flex-row py-4 px-2 items-center border-b-2">
                  <div className="w-1/4">
                    <Image
                      width={100}
                      height={100}
                      src="/images/profile.jpg"
                      className="object-cover h-12 w-12 rounded-full"
                      alt=""
                    />
                  </div>
                  <div className="w-full">
                    <div className="text-lg font-semibold">
                      Everest Trip 2021
                    </div>
                    <span className="text-gray-500">Hi Sam, Welcome</span>
                  </div>
                </div>
                <div className="flex flex-row py-4 px-2 items-center border-b-2 border-l-4 border-blue-400">
                  <div className="w-1/4">
                    <Image
                      width={100}
                      height={100}
                      src="/images/profile.jpg"
                      className="object-cover h-12 w-12 rounded-full"
                      alt=""
                    />
                  </div>
                  <div className="w-full">
                    <div className="text-lg font-semibold">MERN Stack</div>
                    <span className="text-gray-500">
                      Lusi : Thanks Everyone
                    </span>
                  </div>
                </div>
                <div className="flex flex-row py-4 px-2 items-center border-b-2">
                  <div className="w-1/4">
                    <Image
                      width={100}
                      height={100}
                      src="/images/profile.jpg"
                      className="object-cover h-12 w-12 rounded-full"
                      alt=""
                    />
                  </div>
                  <div className="w-full">
                    <div className="text-lg font-semibold">
                      Javascript Indonesia
                    </div>
                    <span className="text-gray-500">
                      Evan : some one can fix this
                    </span>
                  </div>
                </div>
                <div className="flex flex-row py-4 px-2 items-center border-b-2">
                  <div className="w-1/4">
                    <Image
                      width={100}
                      height={100}
                      src="/images/profile.jpg"
                      className="object-cover h-12 w-12 rounded-full"
                      alt=""
                    />
                  </div>
                  <div className="w-full">
                    <div className="text-lg font-semibold">
                      Javascript Indonesia
                    </div>
                    <span className="text-gray-500">
                      Evan : some one can fix this
                    </span>
                  </div>
                </div>

                <div className="flex flex-row py-4 px-2 items-center border-b-2">
                  <div className="w-1/4">
                    <Image
                      width={100}
                      height={100}
                      src="/images/profile.jpg"
                      className="object-cover h-12 w-12 rounded-full"
                      alt=""
                    />
                  </div>
                  <div className="w-full">
                    <div className="text-lg font-semibold">
                      Javascript Indonesia
                    </div>
                    <span className="text-gray-500">
                      Evan : some one can fix this
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-full lg:px-5 flex flex-col justify-between">
                <div className="flex flex-col mt-5">
                  <div className="flex justify-end mb-4">
                    <div className="mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white">
                      Welcome to group everyone !
                    </div>
                    <Image
                      width={100}
                      height={100}
                      src="/images/profile.jpg"
                      className="object-cover h-12 w-12 rounded-full"
                      alt=""
                    />
                  </div>
                  <div className="flex justify-start mb-4">
                    <Image
                      width={100}
                      height={100}
                      src="/images/profile.jpg"
                      className="object-cover h-12 w-12 rounded-full"
                      alt=""
                    />
                    <div className="ml-2 py-3 px-4 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Quaerat at praesentium, aut ullam delectus odio error sit
                      rem. Architecto nulla doloribus laborum illo rem enim
                      dolor odio saepe, consequatur quas?
                    </div>
                  </div>
                  <div className="flex justify-end mb-4">
                    <div>
                      <div className="mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white">
                        Lorem ipsum dolor, sit amet consectetur adipisicing
                        elit. Magnam, repudiandae.
                      </div>

                      <div className="mt-4 mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Debitis, reiciendis!
                      </div>
                    </div>
                    <Image
                      width={100}
                      height={100}
                      src="/images/profile.jpg"
                      className="object-cover h-12 w-12 rounded-full"
                      alt=""
                    />
                  </div>
                  <div className="flex justify-start mb-4">
                    <Image
                      width={100}
                      height={100}
                      src="/images/profile.jpg"
                      className="object-cover h-12 w-12 rounded-full"
                      alt=""
                    />
                    <div className="ml-2 py-3 px-4 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white">
                      happy holiday guys!
                    </div>
                  </div>
                </div>
                <div className="py-5">
                  <input
                    className="w-full bg-gray-300 text-black z-50 py-5 px-3 rounded-xl"
                    type="text"
                    placeholder="type your message here..."
                  />
                </div>
              </div>
              <div className="lg:w-2/5 max-lg:w-full lg:border-l-2 lg:px-5">
                <div className="flex flex-col">
                  <div className="font-semibold text-xl py-4">
                    Mern Stack Group
                  </div>
                  <Image
                    width={100}
                    height={100}
                    src="/images/profile.jpg"
                    className="object-cover h-12 w-12 rounded-full"
                    alt=""
                  />
                  <div className="font-semibold py-4">Created 22 Sep 2021</div>
                  <div className="font-light">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Deserunt, perspiciatis!
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
