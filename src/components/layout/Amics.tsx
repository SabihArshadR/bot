"use client";
import Image, { StaticImageData } from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useUser } from "@/context/UserContext";
import ModelViewer from "./ModelViewer";

import finding1 from "@/assets/finding1.png";
import finding2 from "@/assets/finding2.png";
import finding3 from "@/assets/finding3.png";
import finding4 from "@/assets/finding4.png";
import finding5 from "@/assets/finding5.png";
import finding6 from "@/assets/finding6.png";
import finding from "@/assets/ITEM01.svg";
import { FaLock } from "react-icons/fa";

interface Finding {
  img: StaticImageData;
  model: string;
  altKey: string;
  zoom: "moreless" | "less" | "normal" | "large";
}

const Amics = () => {
  const t = useTranslations("Amics");
  const router = useRouter();
  const { status } = useSession();
  const { user } = useUser();
  const [unlockedCount, setUnlockedCount] = useState(0);
  const [activeModel, setActiveModel] = useState<string | null>(null);
  const [activeModelZoom, setActiveModelZoom] = useState<string | null>(
    "normal",
  );
  const [isLoading, setIsLoading] = useState(true);

  const getBaseUrl = () => {
    if (typeof window !== "undefined") {
      return window.location.origin;
    }
    return process.env.NEXTAUTH_URL || "http://localhost:3000";
  };

  const HOST = getBaseUrl();

  const openSound = useCallback(() => {
      try {
        const audio = new Audio("/button-sounds/15.mp3");
        audio
          .play()
          .catch((error) => console.error("Error playing sound:", error));
      } catch (error) {
        console.error("Error initializing sound:", error);
      }
    }, []);

  const findings: Finding[] = [
    {
      img: finding,
      model: `${HOST}/models/1.glb`,
      altKey: "finding1",
      zoom: "moreless",
    },
    {
      img: finding,
      model: `${HOST}/models/2.glb`,
      altKey: "finding2",
      zoom: "moreless",
    },
    {
      img: finding,
      model: `${HOST}/models/3.glb`,
      altKey: "finding3",
      zoom: "moreless",
    },
    {
      img: finding,
      model: `${HOST}/models/4.glb`,
      altKey: "finding4",
      zoom: "moreless",
    },
    {
      img: finding,
      model: `${HOST}/models/5.glb`,
      altKey: "finding5",
      zoom: "moreless",
    },
  ];

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      setIsLoading(false);
    }
  }, [status]);

  useEffect(() => {
    if (user) {
      setUnlockedCount(user.POIsCompleted);
    }
  }, [user]);

  const handleClick = (index: number) => {
    if (index < unlockedCount) {
      setActiveModel(findings[index].model);
      setActiveModelZoom(findings[index].zoom);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lightgreen"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="flex flex-col items-center bg-white pb-10 md:pb-32">
      <div className="bg-lightbrown w-full flex h-24 md:h-28 items-center justify-center font-karla">
        <h1 className="text-2xl md:text-3xl font-extrabold text-blackfont text-center">
          {t("title")}
        </h1>
      </div>

      <div className="mt-8 w-full max-w-4xl pb-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 md:gap-6 w-full px-5 md:px-0 justify-items-center">
          {findings.map((item, index) => {
            const isUnlocked = index < unlockedCount;
            return (
              <div
                className="w-[170px] h-[170px] rounded-[12px]"
                style={{
                  backgroundImage: "url(/bg.svg)",
                  backgroundSize: "cover",
                }}
              >
                <div
                  key={index}
                  className={`relative aspect-square transition-all duration-300 ${
                    !isUnlocked
                      ? "opacity-50"
                      : "hover:scale-105 cursor-pointer"
                  }`}
                >
                  <button
                    onClick={() => {handleClick(index), openSound()}}
                    disabled={!isUnlocked}
                    className="w-full h-full"
                  >
                    <Image
                      src={item.img}
                      alt="img"
                      className="object-cover w-[152px] h-[152px] mx-auto"
                    />
                    {!isUnlocked && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        {/* <svg
                          className="w-8 h-8 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                            clipRule="evenodd"
                          />
                        </svg> */}
                        <FaLock className="w-8 h-8 " />
                      </div>
                    )}
                    {isUnlocked && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="bg-lightgreen rounded-full p-2">
                          <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <ModelViewer
        modelPath={activeModel || ""}
        isOpen={!!activeModel}
        onClose={() => setActiveModel(null)}
        zoomMode={
          (activeModelZoom as "normal" | "moreless" | "less" | "large") ??
          "normal"
        }
      />
    </div>
  );
};

export default Amics;
