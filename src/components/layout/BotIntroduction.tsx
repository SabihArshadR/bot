"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Logo from "@/assets/mobileHlogo.svg";
import Avatar from "@/assets/THREEJS_avatar.png";
import line from "@/assets/BALLOON_LINE.svg";
import icon from "@/assets/AR icon.svg";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { useRouter } from "next/navigation";
// import LogoT from "@/assets/headertext.svg";
import Header from "./Header";
// import icons from "@/assets/arrowwhite.svg";
import { useLocale, useTranslations } from "next-intl";
import { Typewriter } from "../ui/Typewriter";
import InlineModelViewer from "./inlineModelViewer";
import Logoo from "@/assets/headerlogo.svg";

const BotIntroduction = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [showAudioPrompt, setShowAudioPrompt] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState<boolean | null>(null);
  const [startTypewriter, setStartTypewriter] = useState(false);
  const router = useRouter();
  const t = useTranslations("intro");
  // const t2 = useTranslations("Caminslogin");
  const locale = useLocale();
  // const locale = useLocale() as string;

  useEffect(() => {
  const hasVisited = localStorage.getItem("botIntroVisited");

  if (!hasVisited) {
    // First visit
    localStorage.setItem("botIntroVisited", "true");

    const timer = setTimeout(() => {
      setStartTypewriter(true);

      if (audioRef.current) {
        audioRef.current.volume = 0.8;
        audioRef.current.muted = true; // start muted
        audioRef.current.play().catch((error) => {
          console.error("Auto play failed:", error);
        });
      }
    }, 7000);

    return () => clearTimeout(timer);
  } else {
    // Returning visit → start immediately
    setStartTypewriter(true);

    if (audioRef.current) {
      audioRef.current.volume = 0.8;
      audioRef.current.muted = true;
      audioRef.current.play().catch((error) => {
        console.error("Auto play failed:", error);
      });
    }
  }

  return () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };
}, []);

  useEffect(() => {
    // Play or pause audio based on user's choice
    if (audioRef.current) {
      if (audioEnabled === true) {
        audioRef.current.muted = false;
      } else if (audioEnabled === false) {
        audioRef.current.pause();
      }
    }
  }, [audioEnabled]);

  const handleAudioChoice = (choice: boolean) => {
    setAudioEnabled(choice);
    setShowAudioPrompt(false);
    setStartTypewriter(true);
  };

  const playButtonSound = useCallback(() => {
    try {
      const audio = new Audio("/button-sounds/5.mp3");
      audio
        .play()
        .catch((error) => console.error("Error playing sound:", error));
    } catch (error) {
      console.error("Error initializing sound:", error);
    }
  }, []);

  const playButtonSound2 = useCallback(() => {
    try {
      const audio = new Audio("/button-sounds/3.mp3");
      audio
        .play()
        .catch((error) => console.error("Error playing sound:", error));
    } catch (error) {
      console.error("Error initializing sound:", error);
    }
  }, []);

  return (
    <div className="desktop:flex tablet:flex mobile:block flex-col justify-center items-center min-h-[85vh] relative bg-white">
      <div className="desktop:max-w-[400px] tablet:max-w-[400px] mobile:w-full">
        {showAudioPrompt && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-200">
            <div className="bg-white rounded-xl shadow-2xl p-4 min-w-[280px] max-w-[320px] border border-gray-100">
              <p className="text-sm text-gray-700 mb-3 text-center font-medium">
                {t("audio")}
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => handleAudioChoice(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#A82B00] text-white rounded-lg 
                            text-sm hover:bg-[#8a2400] transition-colors font-medium transition-all duration-400 ease-in-out hover:brightness-150 active:brightness-150 active:-translate-y-[5px]"
                >
                  <FaVolumeUp className="text-xs" /> {t("option1")}
                </button>
                <button
                  onClick={() => handleAudioChoice(false)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm
                             hover:bg-gray-200 transition-colors font-medium transition-all duration-400 ease-in-out hover:brightness-150 active:brightness-150 active:-translate-y-[5px]"
                >
                  <FaVolumeMute className="text-xs" /> {t("option2")}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center items-center w-full px-[14px] h-[183px] bg-green object-cover">
          <div>
            <div>
              <Image
                src={Logoo}
                alt="Logo"
                width={220}
                height={88}
                onClick={() => router.push("/")}
              />
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-center pt-5">
            <p className="text-base text-[#160500] leading-[24px] italic max-w-[384px] text-center min-h-[120px]">
              {startTypewriter && (
              <Typewriter
                // text={t("text")}
                text="Hola a tothom. Soc el Gegant de les muntanyes de Bot i fa molts anys que dormo dalt del cim, on sempre m’arriba l’eco del poble quan és festa. Cada any, la Dansada m’acompanya fins i tot mentre dormo. Però avui… no ha sonat res. Cap gralla, cap timbal, cap ball. El silenci m’ha despertat de cop: un silenci estrany, pesant, com si el poble s’hagués apagat. I amb aquest silenci he notat la fam i la foscor que planen pels carrers. Per això he baixat al poble a saber què està passant, perquè si la Dansada no torna a sonar, jo no puc tornar a descansar. I aquí és on entreu vosaltres. A cada indret de la ruta descobrireu un fragment d’aquesta història. Per avançar i ajudar-me a recuperar la Dansada, haureu de recollir aliments amb realitat augmentada: pa, oli, ametlles, raïm i salsitxes. Són més que menjar: simbolitzen l’esforç, la solidaritat i la supervivència de la gent d’aquells anys. A més, a cada parada haureu de respondre una pregunta. Si l’encerteu, guanyareu els instruments de la Dansada i elements propis d’aquesta tradició. Quan hàgiu recuperat tots els elements, jo podré tornar a dormir… i la música, l’esperança i l’alegria tornaran a omplir els carrers del poble. Us espero al primer punt de la ruta. Trobareu el mapa a la pàgina principal del joc. Fins aviat!"
                speed={57}
                wordsPerPage={30}
                pauseAfterPage={0}
                loop={true}
                className="text-lg leading-relaxed"
              />
              )}
              <audio
                ref={audioRef}
                // src={`/audios/${locale === "ca" ? "rutaintrocatalan" : locale === "es" ? "rutaintrospanish" : locale === "fr" ? "rutaintrofrench" : "rutaintroenglish"}.mp3`}
                src="/audios/botintroduction.mp3"
                preload="metadata"
                style={{ display: "none" }}
              />
            </p>
          </div>
          <div className="relative">
            <div className="flex flex-col items-center justify-center">
              <div className="flex justify-center mt-1 ">
                <Image
                  src={line}
                  alt="line"
                  className="max-w-[350px] mx-auto mt-[-40px] translate-y-[40px] z-10"
                />
              </div>
              <div className="flex justify-center mt-5">
                <InlineModelViewer
                  modelPath="/models/ANIMACION_OK.glb"
                  // width="500px"
                  // height="300px"
                  audioEnabled={audioEnabled === true}
                />
              </div>
              <div className="absolute top-[420px] flex justify-center z-10">
                <div 
                  style={{
                    animation: 'heartbeat 1.5s ease-in-out infinite',
                    transformOrigin: 'center center'
                  }}
                >
                  <Image
                    src={icon}
                    alt="AR icon"
                    onClick={() => router.push("/ar-bot")}
                    className="hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <style jsx global>{`
                  @keyframes heartbeat {
                    0% { transform: scale(1); }
                    14% { transform: scale(1.1); }
                    28% { transform: scale(1); }
                    42% { transform: scale(1.1); }
                    70% { transform: scale(1); }
                  }
                `}</style>
              </div>
            </div>
          </div>
          <div>
            <div className="mt-24 mx-5 pb-5">
              <h1 className=" text-center text-[20px] text-[#160500] font-bold ">
                {t("ar")}
              </h1>
              <button
                onClick={() => {
                  playButtonSound2();
                  router.push("/dashboard");
                }}
                className="bg-[#A82B00] rounded-[8px] text-[20px] text-white 
              font-bold py-2 max-w-[399px] w-full hover:cursor-pointer px-2 mt-5 
              transition-all duration-400 ease-in-out hover:brightness-150 
              active:brightness-150 active:-translate-y-[5px]"
              >
                {t("button")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BotIntroduction;
