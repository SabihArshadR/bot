"use client";
import { useState, useEffect } from "react";
import BotFinal from "@/components/layout/BotFinal";
import Dashboard from "@/components/layout/Dashboard";
import DashboardWrapper from "@/layouts/DashboardWrapper";
import { useUser } from "@/context/UserContext";

export default function Home() {
  const [showBotFinal, setShowBotFinal] = useState(false);
  const { user } = useUser();
  const TOTAL_POIS = 5;
  const isGameCompleted = user?.POIsCompleted === TOTAL_POIS;

  useEffect(() => {
    // Check if game is completed and BotFinal hasn't been shown yet
    if (isGameCompleted) {
      const hasSeenBotFinal = localStorage.getItem('hasSeenBotFinal');
      if (!hasSeenBotFinal) {
        setShowBotFinal(true);
      }
    }
  }, [isGameCompleted]);

  const handleContinue = () => {
    // Mark BotFinal as seen and hide it
    localStorage.setItem('hasSeenBotFinal', 'true');
    setShowBotFinal(false);
  };

  return (
    <>
      <DashboardWrapper>
        <Dashboard />
        {showBotFinal && <BotFinal onContinue={handleContinue} />}
      </DashboardWrapper>
    </>
  );
}
