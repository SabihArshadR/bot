"use client";
import React from "react";

interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <button
      className={`bg-brown rounded-[8px] text-[20px] text-white font-bold py-2 max-w-[499px] w-full hover:cursor-pointer font-roboto px-2 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default CustomButton;
