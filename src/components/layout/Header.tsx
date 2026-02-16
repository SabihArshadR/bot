"use client";
import Image from "next/image";
import React, { useCallback } from "react";
import Logo from "@/assets/headerlogo.svg";
import User from "@/assets/user.svg";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Menu from "../ui/Menu";
import { useSession, signOut } from "next-auth/react";
import arrow from "@/assets/arrowwhite.svg";

const Header = () => {
  const t = useTranslations("Head");
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleAuthClick = () => {
    if (status === "authenticated") {
      signOut({ callbackUrl: "/dashboard" });
    } else {
      router.push("/login");
    }
  };

   const playButtonSound = useCallback(() => {
    try {
      const audio = new Audio('/button-sounds/5.mp3');
      audio.play().catch(error => console.error('Error playing sound:', error));
    } catch (error) {
      console.error('Error initializing sound:', error);
    }
  }, []);

  const playButtonSound2 = useCallback(() => {
    try {
      const audio = new Audio('/button-sounds/4.mp3');
      audio.play().catch(error => console.error('Error playing sound:', error));
    } catch (error) {
      console.error('Error initializing sound:', error);
    }
  }, []);

  const handleBackClick = () => {
    playButtonSound();
    if (window.location.pathname === '/dashboard') {
      router.push("/");
    } else if (window.location.pathname === '/login') {
      router.push("/dashboard");
    } else {
      router.back();
    }
  };

  return (
    <div className="flex justify-between items-center w-full px-[14px] h-[183px] bg-green">
      <div className="mt-4 w-[70px]">
        {/* <Menu /> */}
        <Image src={arrow} alt="arrow" onClick={handleBackClick} className="ml-2 cursor-pointer" />
        <h1 className="text-white text-base font-medium">{t("back")}</h1>
      </div>

      <div>
        <div>
          <Image
            src={Logo}
            alt="Logo"
            width={220}
            height={88}
            onClick={() => router.push("/")}
          />
        </div>
      </div>

      <div
        className="flex items-end flex-col mt-2 w-[70px]"
        onClick={handleAuthClick}
      >
        <div className="flex flex-col justify-center items-center">
          <Image
          onClick={playButtonSound2}
            src={status === "authenticated" ? User : User}
            alt={status === "authenticated" ? "Logout" : "User"}
            className="w-[25px]"
          />
          <h1 className="text-white text-base font-medium text-center ">
            {status === "authenticated" ? t("title3") : t("title2")}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Header;
