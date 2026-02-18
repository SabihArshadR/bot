"use client"
import BotIntroduction from "@/components/layout/BotIntroduction";
import BotPopup from "@/components/layout/BotPopup";
import Dashboard from "@/components/layout/Dashboard";
import CustomButton from "@/components/ui/Button";
import DashboardWrapper from "@/layouts/DashboardWrapper";
import { useTranslations } from "next-intl";
import { useEffect , useState } from "react";
export default function Home() {
  const [showCookies, setShowCookies] = useState(false);
  const [showBotPopup, setShowBotPopup] = useState(false);
  const t = useTranslations("Login");

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem("hasSeenRutaPopup");
    if (!hasSeenPopup) {
      setShowBotPopup(true);
      localStorage.setItem("hasSeenRutaPopup", "true");

      const timer = setTimeout(() => {
        setShowBotPopup(false);
      }, 7000);

      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const accepted = localStorage.getItem("cookiesAccepted");
    if (!accepted) {
      setShowCookies(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setShowCookies(false);
  };

  return (
    <>
      <div>
        <BotIntroduction />
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
