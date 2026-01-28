"use client";
import React from "react";

interface PrimaryBoxProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<PrimaryBoxProps> = ({ children, className = "", onClick }) => {
  return (
    <div
      className={`border-b-5 border-[#2C4D21] rounded-[12px] w-[114px] h-[118px] 
        flex flex-col gap-[14px] items-center justify-center bg-white cursor-pointer
         hover:bg-skin px-1 py-2 text-center relative overflow-hidden ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;