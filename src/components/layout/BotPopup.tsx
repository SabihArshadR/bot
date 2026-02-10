"use client";
import React from "react";
import logo1 from "@/assets/webl1.svg";
import logo2 from "@/assets/webl2.svg";
import logo3 from "@/assets/webl3.svg";
import logo4 from "@/assets/webl4.png";
import logo5 from "@/assets/webl5.png";
import Image from "next/image";

interface BotPopupProps {
  onClose: () => void;
}

const BotPopup = ({ onClose }: BotPopupProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-white">
      <div className="w-full max-w-[400px] mx-auto">
        <div className="bg-white flex flex-col justify-center items-center pb-10">
          <h1 className="text-2xl font-semibold text-[#160500] mt-10">
            Amb el suport de:
          </h1>
          <Image
            src={logo1}
            alt="logo1"
            className="w-[157px] h-[68px] mt-[47px]"
          />
          <Image
            src={logo2}
            alt="log2"
            className="w-[209px] h-[52px] mt-[47px]"
          />
          <Image
            src={logo3}
            alt="log3"
            className="w-[130px] h-[105px] mt-[48px]"
          />
          <Image
            src={logo4}
            alt="log4"
            className="w-[73px] h-[98px] mt-[28px]"
          />
          <h1 className="text-2xl font-semibold text-[#160500] mt-[74px]">
            Creat per:
          </h1>
          <Image
            src={logo5}
            alt="log5"
            className="mt-[29px] w-[138px] h-[73px]"
          />
        </div>
      </div>
    </div>
  );
};

export default BotPopup;
