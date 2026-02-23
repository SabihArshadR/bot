"use client"
import BotIntroduction from "@/components/layout/BotIntroduction";
import BotPopup from "@/components/layout/BotPopup";
import Dashboard from "@/components/layout/Dashboard";
import LanguageSelection from "@/components/layout/LS";
import CustomButton from "@/components/ui/Button";
import DashboardWrapper from "@/layouts/DashboardWrapper";
import { useTranslations } from "next-intl";
import { useEffect , useState } from "react";
export default function Home() {
  const [showCookies, setShowCookies] = useState(false);
  const [showBotPopup, setShowBotPopup] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [afterPopup, setAfterPopup] = useState(false);
  const [hasSelectedLanguage, setHasSelectedLanguage] = useState(false);
  const t = useTranslations("Login");

  useEffect(() => {
    const hasSeen = localStorage.getItem("hasSeenRutaPopup");
    if (!hasSeen) {
      setIsFirstVisit(true);
      setShowBotPopup(true);
      localStorage.setItem("hasSeenRutaPopup", "true");

      const timer = setTimeout(() => {
        setShowBotPopup(false);
        setAfterPopup(true);
      }, 7000);

      return () => clearTimeout(timer);
    } else {
      setAfterPopup(true);
    }
  }, []);

  useEffect(() => {
    const accepted = localStorage.getItem("cookiesAccepted");
    if (!accepted) {
      setShowCookies(true);
    }
  }, []);

  useEffect(() => {
    const selected = localStorage.getItem("languageSelected");
    if (selected === "true") {
      setHasSelectedLanguage(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setShowCookies(false);
  };

  return (
    <>
      <div>
        {afterPopup && (isFirstVisit && !hasSelectedLanguage ? <LanguageSelection onContinue={() => setHasSelectedLanguage(true)} /> : <BotIntroduction />)}
        {showBotPopup && <BotPopup onClose={() => setShowBotPopup(false)} />}
      </div>
      {showCookies && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white px-4 py-3 flex items-center justify-between shadow-md z-50">
          <p className="text-sm">
            {t("cookie")}
          </p>
          <div className="flex flex-col gap-2">
            <CustomButton className="!text-xs !px-8" onClick={handleAccept}>
              {t("accept")}
            </CustomButton>
            <CustomButton
              className="!text-xs bg-red-600 !px-8"
              onClick={handleAccept}
            >
              {t("decline")}
            </CustomButton>
          </div>
        </div>
      )}
    </>
  );
}
