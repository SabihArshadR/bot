"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Card1 from "@/assets/card1.svg";
import Card2 from "@/assets/card2.svg";
import Card3 from "@/assets/card3.svg";
import Card4 from "@/assets/card4.svg";
import Card5 from "@/assets/card5.svg";
import Card6 from "@/assets/card6.svg";
import Logo from "@/assets/DashboardLogo.png";
import Card from "../ui/Card";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import SplashPopUp from "./Popup";
// import Welcome from "./Welcome";
import Intro from "./Intro";
import api from "@/lib/axios";
import { useUser } from "@/context/UserContext";
import CompletePopup from "./CompletePopup";
import Notification from "@/assets/notification.png";
import { useCallback } from "react";
import BotCompletion from "./BotCompletion";
import { useAudio } from "@/context/AudioContext";

const Dashboard = () => {
  const { user, refreshUser, loading: userLoading } = useUser();
  const { data: session, status } = useSession();
  const router = useRouter();
  const t = useTranslations("Dashboard");
  const [loading, setLoading] = useState(false);
  const [ShowMorePopup, setShowMorePopup] = useState(false);
  const [ShowCompletePopup, setShowCompletePopup] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [showMapNotification, setShowMapNotification] = useState(false);
  const [showAmicsNotification, setShowAmicsNotification] = useState(false);
  const [showProgressNotification, setShowProgressNotification] = useState(false);
  // const [showBotCompletion, setShowBotCompletion] = useState(false);
  // const { unlockCompletionAudio } = useAudio();

  useEffect(() => {
    refreshUser();
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
    if (!hasSeenWelcome) {
      setLoading(true);
      const timer = setTimeout(() => {
        localStorage.setItem("hasSeenWelcome", "true");
        setLoading(false);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }
  }, []);

  const playCardSound = useCallback(() => {
    try {
      const audio = new Audio("/button-sounds/4.mp3");
      audio
        .play()
        .catch((error) => console.error("Error playing sound:", error));
    } catch (error) {
      console.error("Error initializing sound:", error);
    }
  }, []);

  useEffect(() => {
    if (user && status === "authenticated") {
      const currentPOIs = user.POIsCompleted || 0;

      const lastSeenMapPOIsStr = localStorage.getItem("lastSeenMapPOIs");
      const lastSeenAmicsPOIsStr = localStorage.getItem("lastSeenAmicsPOIs");
      const lastSeenProgressPOIsStr = localStorage.getItem("lastSeenProgressPOIs");

      const lastSeenMapPOIs = lastSeenMapPOIsStr
        ? parseInt(lastSeenMapPOIsStr)
        : null;
      const lastSeenAmicsPOIs = lastSeenAmicsPOIsStr
        ? parseInt(lastSeenAmicsPOIsStr)
        : null;
      const lastSeenProgressPOIs = lastSeenProgressPOIsStr
        ? parseInt(lastSeenProgressPOIsStr)
        : null;

      if (lastSeenMapPOIs === null || currentPOIs > lastSeenMapPOIs) {
        setShowMapNotification(true);
      } else {
        setShowMapNotification(false);
      }

      if (lastSeenAmicsPOIs === null || currentPOIs > lastSeenAmicsPOIs) {
        setShowAmicsNotification(true);
      } else {
        setShowAmicsNotification(false);
      }

      if (lastSeenProgressPOIs === null || currentPOIs > lastSeenProgressPOIs) {
        setShowProgressNotification(true);
      } else {
        setShowProgressNotification(false);
      }
    }
  }, [user, status, userLoading]);

  useEffect(() => {
    const checkIntro = async () => {
      if (user && user.hasSeenPopup === false) {
        setShowIntro(false);
      }
    };
    const checkPOI = async () => {
      if (user && user.POIsCompleted >= 5) {
        setShowCompletePopup(false);
        // setShowBotCompletion(true);
      } else {
        // setShowBotCompletion(false);
      }
    };
    checkIntro();
    checkPOI();
  }, [user, status, userLoading]);

  const updateIntroStatus = async () => {
    try {
      await api.post("/user", {
        hasSeenPopup: true,
      });
    } catch (err: any) {
      console.error("Failed to update:", err.response?.data || err.message);
    }
  };

  const handleMapClick = () => {
    playCardSound();
    // unlockCompletionAudio();
    if (user) {
      localStorage.setItem("lastSeenMapPOIs", user.POIsCompleted.toString());
      setShowMapNotification(false);
    }

    if (user && user.POIsCompleted === 6) {
      setShowCompletePopup(true);
    } else {
      router.push("/mapa");
    }
  };

  const handleAmicsClick = () => {
    playCardSound();
    if (user) {
      localStorage.setItem("lastSeenAmicsPOIs", user.POIsCompleted.toString());
      setShowAmicsNotification(false);
    }
    router.push("/amics");
  };

  const handleProgressClick = () => {
    playCardSound();
    if (user) {
      localStorage.setItem("lastSeenProgressPOIs", user.POIsCompleted.toString());
      setShowProgressNotification(false);
    }
    router.push("/progres");
  };

  // if (loading) return <Welcome />;

  // if (showBotCompletion) {
  //   return <BotCompletion />;
  // }

  return (
    <>
      {ShowMorePopup && (
        <SplashPopUp
          handleClose={() => {
            setShowMorePopup(false);
          }}
        />
      )}
      {ShowCompletePopup && (
        <CompletePopup
          handleClose={() => {
            setShowCompletePopup(false);
          }}
        />
      )}
      {showIntro && (
        <Intro
          handleClose={() => {
            setShowIntro(false);
            updateIntroStatus();
          }}
        />
      )}
      <div className="pb-10 bg-green">
        <div className="">
          <Image
            src={Logo}
            alt="Logo"
            className="object-cover h-[430px] w-full"
          />
        </div>
        <div className="flex justify-between mt-[33px] px-6 gap-4 font-karla">
          <Card onClick={handleMapClick}>
            <Image src={Card1} alt="Map Icon" className="w-[48px] h-[48px]" />
            <h1 className="text-center w-full break-words px-1 text-[15PX] leading-4 font-extrabold text-blackfont">
              {t("card1")}
            </h1>
            {status === "authenticated" && showMapNotification && (
              // <div className="w-[15px] h-[15px] rounded-full bg-red-600 absolute top-2 right-2  animate-pulse"></div>
              <Image
                src={Notification}
                alt="Notification"
                className="absolute top-0 right-0 animate-pulse w-[40px] h-[40px]"
              />
            )}
          </Card>
          <Card onClick={handleProgressClick}>
            <Image
              src={Card2}
              alt="Profile Icon"
              className="w-[48px] h-[48px]"
            />
            <h1 className="text-center w-full break-words px-1 text-[15PX] leading-4 font-extrabold text-blackfont">
              {t("card2")}
            </h1>
            {status === "authenticated" && showProgressNotification && (
              <Image
                src={Notification}
                alt="Notification"
                className="absolute top-0 right-0 animate-pulse w-[40px] h-[40px]"
              />
            )}
          </Card>
          <Card onClick={handleAmicsClick}>
            <Image
              src={Card3}
              alt="Friends Icon"
              className="w-[48px] h-[48px]"
            />
            <h1 className="text-center w-full break-words px-1 text-[15PX] leading-4 font-extrabold text-blackfont">
              {t("card3")}
            </h1>
            {status === "authenticated" && showAmicsNotification && (
              // <div className="w-[15px] h-[15px] rounded-full bg-red-600 absolute top-2 right-2  animate-pulse"></div>
              <Image
                src={Notification}
                alt="Notification"
                className="absolute top-0 right-0 animate-pulse w-[40px] h-[40px]"
              />
            )}
          </Card>
        </div>
        <div className="flex justify-between mt-[25px] px-6 gap-4 font-karla">
          <Card
            onClick={() => {
              playCardSound();
              setShowMorePopup(true);
            }}
          >
            <Image
              src={Card4}
              alt="Know More Icon"
              className="w-[48px] h-[48px]"
            />
            <h1 className="text-center w-full break-words px-1 text-[15PX] leading-4 font-extrabold text-blackfont">
              {t("card4")}
            </h1>
          </Card>
          <Card
            onClick={() => {
              playCardSound();
              router.push("/faqs");
            }}
          >
            <Image src={Card5} alt="FAQs Icon" className="w-[48px] h-[48px]" />
            <h1 className="text-center w-full break-words px-1 text-[15PX] leading-4 font-extrabold text-blackfont">
              {t("card5")}
            </h1>
          </Card>
          <Card
            onClick={() => {
              // window.open("https://www.canyelles.cat", "_blank");
               window.open("/Recomanem/Recomanem.pdf", "_blank");
            }}
          >
            <Image
              src={Card6}
              alt="Recommendations Icon"
              className="w-[48px] h-[48px]"
            />
            <h1 className="text-center w-full break-words text-[14px] leading-4 font-extrabold text-blackfont">
              {t("card6")}
            </h1>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
