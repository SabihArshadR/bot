"use client";
import React from "react";
import logo1 from "@/assets/1.png";
import logo2 from "@/assets/2.png";
import logo3 from "@/assets/3.png";
import logo4 from "@/assets/4.png";
import logo5 from "@/assets/5.png";
import logo6 from "@/assets/6.png";
import logo7 from "@/assets/7.jpeg";
import logo8 from "@/assets/8.jpg";
import Image from "next/image";

interface BotPopupProps {
  onClose: () => void;
}

const BotPopup = ({ onClose }: BotPopupProps) => {
  return (
    <div className="fixed inset-0 flex justify-center z-50 bg-white">
      <div className="w-full max-w-[400px] mx-auto">
        <div className="bg-white flex flex-col justify-center items-center pb-10">
          {/* <h1 className="text-2xl font-semibold text-[#160500] mt-10">
            Amb el suport de:
          </h1> */}
          <Image
            src={logo1}
            alt="logo1"
            className="w-[200px] h-[200px] object-cover"
          />
          <Image
            src={logo2}
            alt="log2"
            className="w-[200px] h-[52px] object-cover"
          />
          <Image
            src={logo3}
            alt="log3"
            className="w-[200px] h-[100px] object-cover"
          />
          <Image
            src={logo4}
            alt="log4"
            className="w-[200px] h-[100px] object-cover"
          />
          {/* <h1 className="text-2xl font-semibold text-[#160500] mt-[50px]">
            Creat per:
          </h1> */}
          <Image
            src={logo5}
            alt="log5"
            className="w-[200px] h-[100px] object-cover"
          />
          <Image
            src={logo6}
            alt="log6"
            className="w-[200px] h-[100px] object-cover"
          />
          <Image
            src={logo7}
            alt="logo7"
            className="w-[200px] h-[100px] object-cover"
          />
          <Image
            src={logo8}
            alt="logo8"
            className="w-[200px] h-[100px] object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default BotPopup;
