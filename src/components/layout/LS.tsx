"use client";
import { useTranslations } from "next-intl";
import React, { useCallback, useState } from "react";
import { GrLanguage } from "react-icons/gr";

const FlagIcons: any = {
  ca: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="15"
      id="flag-icons-es-ct"
      viewBox="0 0 640 480"
    >
      <path fill="#fcdd09" d="M0 0h640v480H0z" />
      <path
        stroke="#da121a"
        stroke-width="60"
        d="M0 90h810m0 120H0m0 120h810m0 120H0"
        transform="scale(.79012 .88889)"
      />
    </svg>
  ),
  en: () => (
    <svg width="20" height="15" viewBox="0 0 20 15" fill="none">
      <rect width="20" height="15" fill="#012169" />
      <path d="M0 0L20 15M20 0L0 15" stroke="white" strokeWidth="3" />
      <path d="M0 0L20 15M20 0L0 15" stroke="#C8102E" strokeWidth="2" />
      <path d="M8 0H12V6H20V9H12V15H8V9H0V6H8V0Z" fill="#C8102E" />
    </svg>
  ),
  es: () => (
    <svg width="20" height="15" viewBox="0 0 20 15" fill="none">
      <rect width="20" height="5" fill="#AA151B" />
      <rect y="5" width="20" height="5" fill="#F1BF00" />
      <rect y="10" width="20" height="5" fill="#AA151B" />
    </svg>
  ),
  fr: () => (
    <svg width="20" height="15" viewBox="0 0 20 15" fill="none">
      <rect width="6.66667" height="15" fill="#0055A4" />
      <rect x="6.66667" width="6.66667" height="15" fill="#FFFFFF" />
      <rect x="13.3333" width="6.66667" height="15" fill="#EF4135" />
    </svg>
  ),
};

const locales = ["ca", "es", "en", "fr"];

interface LanguageSelectionProps {
  onContinue: () => void;
}

const LanguageSelection = ({ onContinue }: LanguageSelectionProps) => {
  const [selectedLocale, setSelectedLocale] = useState<string>("en");
  const t2 = useTranslations("Dashboard");

  const languageNames: Record<string, string> = {
    ca: t2("lang1"),
    en: t2("lang3"),
    es: t2("lang2"),
    fr: t2("lang4"),
  };
  const handleContinue = () => {
    document.cookie = `NEXT_LOCALE=${selectedLocale}; path=/`;
    localStorage.setItem("languageSelected", "true");
    window.location.reload();
  };

  const playButtonSound = useCallback(async () => {
    try {
      const audio = new Audio("/button-sounds/10.mp3");
      await audio.play();
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  }, []);

  const playButtonSound2 = useCallback(async () => {
    try {
      const audio = new Audio("/button-sounds/3.mp3");
      audio.load();
      await audio.play();
      return new Promise<void>((resolve) => {
        audio.addEventListener("ended", () => resolve());
      });
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  }, []);

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-white">
      <div className="w-full max-w-[400px] mx-auto p-6">
        <div className="">
          <div className="flex justify-center items-center">
            <GrLanguage size={50} />
          </div>
          <h1 className="text-center text-2xl font-bold mb-6 mt-2">
            {t2("select")}
          </h1>
        </div>
        <div className="space-y-4">
          {locales.map((locale) => (
            <button
              key={locale}
              onClick={() => {
                setSelectedLocale(locale);
                playButtonSound();
              }}
              className={`w-full py-3 px-4 rounded-lg text-lg font-medium transition-colors flex items-center gap-3 ${
                selectedLocale === locale
                  ? "bg-green text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {FlagIcons[locale]()}
              {languageNames[locale]}
            </button>
          ))}
        </div>
        <button
          onClick={async () => {
            await playButtonSound2();
            handleContinue();
          }}
          className="w-full mt-6 py-3 px-4 bg-[#A82B00] text-white rounded-lg text-lg font-bold hover:bg-[#8a2400] transition-colors"
        >
          {t2("continue")}
        </button>
      </div>
    </div>
  );
};

export default LanguageSelection;
