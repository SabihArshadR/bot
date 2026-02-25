"use client";
import { useState, useEffect } from "react";
import logo1 from "@/assets/final1.jpg";
import logo2 from "@/assets/final2.jpg";
import logo3 from "@/assets/final3.jpg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface BotFinalProps {
  onContinue?: () => void;
}

const BotFinal = ({ onContinue }: BotFinalProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [logo1, logo2, logo3];
  const router = useRouter();
  const t = useTranslations("intro")

  useEffect(() => {
    if (currentIndex < 2) {
      const timer = setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  const handleContinue = () => {
    if (onContinue) {
      onContinue();
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center z-50 bg-white">
      <div className="w-full max-w-[440px] mx-auto">
        <div className="relative w-full h-full">
          <div>
            <Image
              src={images[currentIndex]}
              alt={`logo${currentIndex + 1}`}
              fill
              className="object-cover"
            />
            {currentIndex === 2 && (
              <button
                onClick={handleContinue}
                className="absolute bottom-16 left-1/2 transform -translate-x-1/2
                bg-[#A82B00] rounded-[8px] text-[20px] text-white 
                font-bold py-2 max-w-[399px] w-full hover:cursor-pointer px-2 mt-5 
                transition-all duration-400 ease-in-out hover:brightness-150 
                active:brightness-150 active:-translate-y-[5px]
                "
              >
                {t("button")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BotFinal;
