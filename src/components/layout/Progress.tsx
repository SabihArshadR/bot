"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Element1 from "@/assets/element1.svg";
import Element2 from "@/assets/element2.svg";
import Element3 from "@/assets/element3.svg";
import Element4 from "@/assets/element4.svg";
import Element5 from "@/assets/element5.svg";
import Element6 from "@/assets/element6.svg";

import CheckIcon from "@/assets/check.svg";
import CustomButton from "../ui/Button";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Loading from "./Loading";
import { useUser } from "@/context/UserContext";
import { useSession } from "next-auth/react";
import api from "@/lib/axios";

const Progress = () => {
  const { user, refreshUser } = useUser();
  const [activeTab, setActiveTab] = useState<"progress" | "nivell">("progress");
  const [showPopup, setShowPopup] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);
  const t = useTranslations("Progress");
  const t2 = useTranslations("Level");
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

  const totalPOIs = 5; // Increased to 5 as per requirement

  const calculateCompleted = () => {
    const totalCompleted = user?.POIsCompleted || 0;
    const currentLevel = user?.currentLevel || 1;

    // Calculate POIs completed for current level only
    const poisForPreviousLevels = (currentLevel - 1) * totalPOIs;
    const currentLevelCompleted = totalCompleted - poisForPreviousLevels;

    // Ensure it doesn't exceed total POIs for current level
    return Math.max(0, Math.min(currentLevelCompleted, totalPOIs));
  };

  const completed = calculateCompleted();
  const percentage = Math.max(0, Math.min((completed / totalPOIs) * 100, 100));

  const getLevelCompleted = (level: number) => {
    const totalCompleted = user?.POIsCompleted || 0;
    return totalCompleted >= level * totalPOIs;
  };

  const shouldShowOpacity = (level: number) => {
    const levelsToUnlock = level - 1;
    const poisRequiredToUnlock = levelsToUnlock * totalPOIs;
    return (user?.POIsCompleted || 0) >= poisRequiredToUnlock;
  };

  const getLevelName = () => {
    if (user?.currentLevel === 1) return t2("row2");
    if (user?.currentLevel === 2) return t2("row3");
    return t2("row1");
  };

  // const getLevelIcon = () => {
  //   if (user?.currentLevel === 1) return Magma;
  //   if (user?.currentLevel === 2) return Stone;
  //   return Volcano;
  // };

  const getProgressElement = () => {
    const completedPOIs = user?.POIsCompleted || 0;

    switch (completedPOIs) {
      case 0:
        return <Image src={Element1} alt="Progress Level 1" />;
      case 1:
        return <Image src={Element2} alt="Progress Level 2" />;
      case 2:
        return <Image src={Element3} alt="Progress Level 3" />;
      case 3:
        return <Image src={Element4} alt="Progress Level 4" />;
      case 4:
        return <Image src={Element5} alt="Progress Level 5" />;
      default:
        return <Image src={Element6} alt="Progress Complete" />;
    }
  };

  const renderProgressText = () => {
    const completedPOIs = user?.POIsCompleted || 0;

    if (completedPOIs === 0) {
      return (
        <>
          <h1 className="text-[32px] font-extrabold text-blackfont text-center leading-[35px] px-5">
            {t("text1a")}
          </h1>
          <div className="mt-11">
            <h1 className="text-[24px] font-semibold text-green text-center leading-[24px] px-5">
              {t("text1b")}
            </h1>
          </div>
        </>
      );
    } else if (completedPOIs >= 1 && completedPOIs <= 5) {
      const textKey = `text${completedPOIs + 1}`;
      return (
        <div className="text-center">
          <h1 className="text-[32px] font-extrabold text-blackfont">
            {t(`${textKey}a`)}
          </h1>
          <p className="text-[32px] font-extrabold text-blackfont">
            {t(`${textKey}b`)}
          </p>
          <p className="text-[32px] font-extrabold text-green">
            {t(`${textKey}c`)}
          </p>
          <p className="text-[24px] font-semibold text-blackfont mt-[37px] px-5">
            {t(`${textKey}d`)}
          </p>
        </div>
      );
    } else {
      // For more than 5 POIs completed, show the final message
      return (
        <div className="text-center">
          <h1 className="text-[32px] font-extrabold text-blackfont leading-[35px] mb-4">
            {t("text6a")}
          </h1>
          <p className="text-[24px] font-semibold text-green">{t("text6b")}</p>
          <p className="text-[24px] font-semibold text-green">{t("text6c")}</p>
          <p className="text-[24px] font-semibold text-green mt-4">
            {t("text6d")}
          </p>
        </div>
      );
    }
  };

  const handleResetProgress = async () => {
    try {
      setLoadingReset(true);
      try {
        await api.patch("/user/restart");
        await refreshUser();
        await setShowPopup(false);
        router.push("/dashboard");
      } catch (err: any) {
        console.error(
          "Error resetting progress:",
          err.response?.data || err.message,
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingReset(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white">
      <h1 className="text-[22px] font-semibold text-blackfont mt-10">
        {t("title1")} User 
        {/* {user?.username || ""} */}
      </h1> 

      <div className="mt-20">{getProgressElement()}</div>

      <div className="mt-[53px]">{renderProgressText()}</div>

      <div className="bg-white w-full flex flex-col items-center justify-center pb-10">
        <div className="mt-[61px] w-full px-4 pb-5">
          <CustomButton
            onClick={() => router.push("/amics")}
            className="w-full"
          >
            {t("button2")}
          </CustomButton>
        </div>
        <div className="w-full mb-4 px-4">
          <CustomButton
            className="w-full !bg-red-700"
            onClick={() => setShowPopup(true)}
          >
            {t("button3")}
          </CustomButton>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 p-2 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-[#F5F3ED] rounded-2xl shadow-2xl p-6 w-95">
            <p className="text-lg text-center mb-6">{t("confirmMessage")}</p>
            <div className="flex gap-4">
              <CustomButton
                className="w-full"
                onClick={() => setShowPopup(false)}
              >
                {t("cancel")}
              </CustomButton>
              <CustomButton
                className="w-full !bg-red-700"
                onClick={handleResetProgress}
                disabled={loadingReset}
              >
                {t("confirm")}
              </CustomButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Progress;
