"use client";
import Image from "next/image";
import React, { useCallback } from "react";
import Map from "@/assets/map.svg";
import CustomButton from "../ui/Button";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useUser } from "@/context/UserContext";
import Loading from "./Loading";
import { FaCheckCircle } from "react-icons/fa";

const stop = ["first", "second", "third", "fourth", "fifth"];

const stopTitle = [
  "first_title",
  "second_title",
  "third_title",
  "fourth_title",
  "fifth_title",
];


const Maps = () => {
  const { user } = useUser();
  const t = useTranslations("Map");
  const router = useRouter();
  const { status } = useSession();
  
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return null;
  }

  if (status === "unauthenticated") {
    return null;
  }
  
  if (!user) return <Loading />;
  
  const playButtonSound = useCallback(() => {
      try {
        const audio = new Audio("/button-sounds/3.mp3");
        audio
          .play()
          .catch((error) => console.error("Error playing sound:", error));
      } catch (error) {
        console.error("Error initializing sound:", error);
      }
    }, []);

  const destination = stop[user?.POIsCompleted];
  const destinationTitle = stopTitle[user?.POIsCompleted];

  return (
    <div className="pb-5 px-3.5 bg-white min-h-[80vh]">
      <div className="flex justify-center">
        <div className="relative">
          <Image 
            src={Map} 
            alt="Map" 
            className={`w-[192px] h-[192px] mt-[88px] ${user?.POIsCompleted >= stop.length ? 'opacity-70' : ''}`} 
          />
          {user?.POIsCompleted >= stop.length && (
            <div className="absolute inset-0 flex items-center justify-center">
              <FaCheckCircle className="text-green-500 text-6xl mt-20 bg-black rounded-full" />
            </div>
          )}
        </div>
      </div>
      <h1 className="text-2xl font-extrabold text-center text-green mt-[53px] font-karla">
        {t(destination)} {t("title1")}
      </h1>
      <h1 className="text-[36px] font-medium text-center text-blackfont mt-[10px] leading-8 font-roboto">
        {t(destinationTitle)}
      </h1>
      <div className="flex flex-col justify-center items-center mt-[14vh]">
        <CustomButton
          onClick={() => {
            playButtonSound();
            router.push("/mapp");
          }}
        >
          {t("button")}
        </CustomButton>
      </div>
    </div>
  );
};

export default Maps;
