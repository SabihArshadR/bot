"use client";
import React from "react";

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const CustomPhoneInput: React.FC<CustomInputProps> = ({
  className = "",
  ...props
}) => {
  return (
    <div className="flex border-2 border-[#c9c9c9] rounded-[8px] overflow-hidden w-full bg-white text-blackfont">
      <div className="bg-[#c9c9c9] flex items-center justify-center px-4">
        <span className="text-white text-xs">▼</span>
      </div>

      <input
        type="text"
        className={`flex-1 px-3 py-2 text-base outline-none ${className}`}
        {...props}
      />
    </div>
  );
};

export default CustomPhoneInput;
