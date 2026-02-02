"use client";
import { FiArrowLeft } from "react-icons/fi";
import Image from "next/image";
import { useTranslations } from "next-intl";

import pic1 from "../../../public/history/1.1.png";
import pic2 from "../../../public/history/2.2.png";
import pic3 from "../../../public/history/3.3.png";
import pic4 from "../../../public/history/4.4.png";
import pic5 from "../../../public/history/5.5.png";
import pic6 from "../../../public/history/6.6.png";

const images = [
  { id: 1, image: pic1, link: 1 },
  { id: 2, image: pic2, link: 2 },
  { id: 3, image: pic3, link: 3 },
  { id: 4, image: pic4, link: 4 },
  { id: 5, image: pic5, link: 5 },
  { id: 6, image: pic6, link: 6 },
];

const SplashPopUp2 = ({ handleClose }: { handleClose: () => void }) => {
  const t = useTranslations("Dashboard");
  const t2 = useTranslations("Link");

  return (
    <div className="fixed inset-0 p-2 flex items-center justify-center bg-black/50 z-50">
      <div className="relative w-full max-w-md bg-[#F5EFE3] rounded-2xl shadow-2xl p-3 overflow-y-scroll max-h-[85vh]">
        <div className="flex  gap-3 p-4 ">
          <button onClick={handleClose} className="p-1">
            <FiArrowLeft size={24} />
          </button>
        </div>

        <div className="">
          <h2 className="text-[20px] text-backblack font-bold mb-6 text-center">
            {t("card6")}
          </h2>
          <div className="space-y-4">
            {images.map(({ id, image, link }) => (
              <div
                key={id}
                className="rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 flex items-center"
              >
                <div className="w-[128px] h-[128px] bg-white rounded-lg flex-shrink-0 flex items-center justify-center mr-4">
                  <Image
                    src={image}
                    alt={`Logo ${id}`}
                    width={100}
                    height={100}
                    className="object-cover"
                  />
                </div>
                <div className="flex-grow">
                  <p className="text-[20px] text-backblack font-medium">
                    {t(`pic${id}`)}
                  </p>
                  {/* <a
                    href={t2(`link${link}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#AD3F37] hover:underline block mb-2"
                  >
                    {t2(`link${link}`)}
                  </a> */}
                  <a
                    href={t2(`link${link}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#AD3F37] hover:underline italic mb-2"
                  >
                    {t2("title")}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashPopUp2;
