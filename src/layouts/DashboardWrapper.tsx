"use client";
import Header from "@/components/layout/Header";
import React, { useState, useEffect } from "react";
import CustomButton from "../components/ui/Button";
import { useAudio } from "@/context/AudioContext";

interface DashboardWrapperProps {
  children: React.ReactNode;
}

const DashboardWrapper = ({ children }: DashboardWrapperProps) => {
  const [showCookies, setShowCookies] = useState(false);
  const { isPlaying, toggleAudio } = useAudio();

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
    <div className="desktop:flex tablet:flex mobile:block flex-col justify-center items-center min-h-[85vh] relative">
      <div
        className="desktop:max-w-[400px] tablet:max-w-[400px] mobile:w-full"
      >
        <Header />
        {children}
      </div>

      <button
        onClick={toggleAudio}
        style={{
          position: "fixed",
          bottom: "20px",
          left: "20px",
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          border: "2px solid #fff",
          color: "#fff",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          fontSize: "18px",
        }}
        aria-label={isPlaying ? "Mute sound" : "Unmute sound"}
      >
        {isPlaying ? "🔊" : "🔇"}
      </button>

      {showCookies && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white px-4 py-3 flex items-center justify-between shadow-md z-50">
          <p className="text-sm">
            We use cookies to improve your experience. By using our site, you
            agree to our cookie policy.
          </p>
          <div className="flex flex-col gap-2">
            <CustomButton className="!text-xs !px-8" onClick={handleAccept}>
              Accept
            </CustomButton>
            <CustomButton
              className="!text-xs bg-red-600 !px-8"
              onClick={handleAccept}
            >
              Decline
            </CustomButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardWrapper;
