"use client";
import { useTranslations } from "next-intl";
import React, { useEffect, useMemo, useState } from "react";
import CustomButton from "../ui/Button";
import { useParams, useRouter } from "next/navigation";
import finding_1 from "@/assets/finding1.png";
import finding_2 from "@/assets/finding2.png";
import finding_3 from "@/assets/finding3.png";
import finding_4 from "@/assets/finding4.png";
import finding_5 from "@/assets/finding5.png";
import api from "@/lib/axios";
import { useUser } from "@/context/UserContext";

const Quiz = () => {
  const { user, refreshUser } = useUser();
  const t = useTranslations();
  const t1 = useTranslations("QuizPage");
  const router = useRouter();
  const { id } = useParams();
  const volcanoId = Number(id);
  const findingImages = [
    finding_1,
    finding_2,
    finding_3,
    finding_4,
    finding_5,
  ];

  const findingNames = [
    t1("finding_1"),
    t1("finding_2"),
    t1("finding_3"),
    t1("finding_4"),
    t1("finding_5"),
  ];

  useEffect(() => {
    if (!user) return;
    const POICompleted = parseInt(user?.POIsCompleted ?? 0);
    if (POICompleted >= volcanoId) {
      router.push("/dashboard");
    }
  }, [volcanoId, router, user]);

  const volcanoQuestions = useMemo(
    () => ({
      1: [
        {
          title: t("Volcano1Quiz1.title"),
          options: [
            t("Volcano1Quiz1.option1"),
            t("Volcano1Quiz1.option2"),
            t("Volcano1Quiz1.option3"),
            t("Volcano1Quiz1.option4"),
          ],
          correct: t("Volcano1Quiz1.option1"),
        },
        {
          title: t("Volcano1Quiz2.title"),
          options: [
            t("Volcano1Quiz2.option1"),
            t("Volcano1Quiz2.option2"),
            t("Volcano1Quiz2.option3"),
            t("Volcano1Quiz2.option4"),
          ],
          correct: t("Volcano1Quiz2.option1"),
        },
        {
          title: t("Volcano1Quiz3.title"),
          options: [
            t("Volcano1Quiz3.option1"),
            t("Volcano1Quiz3.option2"),
            t("Volcano1Quiz3.option3"),
            t("Volcano1Quiz3.option4"),
          ],
          correct: t("Volcano1Quiz3.option1"),
        },
      ],
      2: [
        {
          title: t("Volcano2Quiz1.title"),
          options: [
            t("Volcano2Quiz1.option1"),
            t("Volcano2Quiz1.option2"),
            t("Volcano2Quiz1.option3"),
            t("Volcano2Quiz1.option4"),
          ],
          correct: t("Volcano2Quiz1.option1"),
        },
        {
          title: t("Volcano2Quiz2.title"),
          options: [
            t("Volcano2Quiz2.option1"),
            t("Volcano2Quiz2.option2"),
            t("Volcano2Quiz2.option3"),
            t("Volcano2Quiz2.option4"),
          ],
          correct: t("Volcano2Quiz2.option1"),
        },
        {
          title: t("Volcano2Quiz3.title"),
          options: [
            t("Volcano2Quiz3.option1"),
            t("Volcano2Quiz3.option2"),
            t("Volcano2Quiz3.option3"),
            t("Volcano2Quiz3.option4"),
          ],
          correct: t("Volcano2Quiz3.option1"),
        },
      ],
      3: [
        {
          title: t("Volcano3Quiz1.title"),
          options: [
            t("Volcano3Quiz1.option1"),
            t("Volcano3Quiz1.option2"),
            t("Volcano3Quiz1.option3"),
            t("Volcano3Quiz1.option4"),
          ],
          correct: t("Volcano3Quiz1.option1"),
        },
        {
          title: t("Volcano3Quiz2.title"),
          options: [
            t("Volcano3Quiz2.option1"),
            t("Volcano3Quiz2.option2"),
            t("Volcano3Quiz2.option3"),
            t("Volcano3Quiz2.option4"),
          ],
          correct: t("Volcano3Quiz2.option1"),
        },
        {
          title: t("Volcano3Quiz3.title"),
          options: [
            t("Volcano3Quiz3.option1"),
            t("Volcano3Quiz3.option2"),
            t("Volcano3Quiz3.option3"),
            t("Volcano3Quiz3.option4"),
          ],
          correct: t("Volcano3Quiz3.option1"),
        },
      ],
      4: [
        {
          title: t("Volcano4Quiz1.title"),
          options: [
            t("Volcano4Quiz1.option1"),
            t("Volcano4Quiz1.option2"),
            t("Volcano4Quiz1.option3"),
            t("Volcano4Quiz1.option4"),
          ],
          correct: t("Volcano4Quiz1.option1"),
        },
        {
          title: t("Volcano4Quiz2.title"),
          options: [
            t("Volcano4Quiz2.option1"),
            t("Volcano4Quiz2.option2"),
            t("Volcano4Quiz2.option3"),
            t("Volcano4Quiz2.option4"),
          ],
          correct: t("Volcano4Quiz2.option1"),
        },
        {
          title: t("Volcano4Quiz3.title"),
          options: [
            t("Volcano4Quiz3.option1"),
            t("Volcano4Quiz3.option2"),
            t("Volcano4Quiz3.option3"),
            t("Volcano4Quiz3.option4"),
          ],
          correct: t("Volcano4Quiz3.option1"),
        },
      ],
      5: [
        {
          title: t("Volcano5Quiz1.title"),
          options: [
            t("Volcano5Quiz1.option1"),
            t("Volcano5Quiz1.option2"),
            t("Volcano5Quiz1.option3"),
            t("Volcano5Quiz1.option4"),
          ],
          correct: t("Volcano5Quiz1.option1"),
        },
        {
          title: t("Volcano5Quiz2.title"),
          options: [
            t("Volcano5Quiz2.option1"),
            t("Volcano5Quiz2.option2"),
            t("Volcano5Quiz2.option3"),
            t("Volcano5Quiz2.option4"),
          ],
          correct: t("Volcano5Quiz2.option1"),
        },
        {
          title: t("Volcano5Quiz3.title"),
          options: [
            t("Volcano5Quiz3.option1"),
            t("Volcano5Quiz3.option2"),
            t("Volcano5Quiz3.option3"),
            t("Volcano5Quiz3.option4"),
          ],
          correct: t("Volcano5Quiz3.option1"),
        },
      ],
    }),
    [t]
  );

  const allQuestions =
    volcanoQuestions[volcanoId as keyof typeof volcanoQuestions] || [];

  const labels = ["A", "B", "C", "D"];
  const [texts, setTexts] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [showPlayAgain, setShowPlayAgain] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<any | null>(null);

  function shuffleArray(array: any[]) {
    return [...array].sort(() => Math.random() - 0.5);
  }

  const handleSelect = (optionText: string) => {
    setSelected(optionText);

    if (optionText === selectedQuestion.correct) {
      setTimeout(() => {
        setQuizCompleted(true);
      }, 800);
    } else {
      setTimeout(() => {
        setShowPlayAgain(true);
      }, 1000);
    }
  };

  const handlePlayAgain = () => {
    if (selectedQuestion) {
      setTexts(shuffleArray(selectedQuestion.options));
    }
    setSelected(null);
    setShowPlayAgain(false);
  };

  const getOptionClass = (optionText: string) => {
    if (!selected)
      return "bg-white border-[#c9c9c9] text-blackfont font-semibold";

    if (
      selected === selectedQuestion.correct &&
      optionText === selectedQuestion.correct
    ) {
      return "bg-lightgreen border-lightgreen text-white font-semibold";
    }

    if (selected !== selectedQuestion.correct) {
      if (optionText === selected)
        return "bg-red border-red text-white font-semibold";
      if (optionText === selectedQuestion.correct)
        return "bg-lightgreen border-lightgreen text-white font-semibold";
    }

    return "bg-white border-[#c9c9c9] text-blackfont font-semibold";
  };

  useEffect(() => {
    if (allQuestions.length > 0) {
      const randomQ =
        allQuestions[Math.floor(Math.random() * allQuestions.length)];
      setSelectedQuestion(randomQ);
      setTexts(shuffleArray(randomQ.options));
    }
  }, [allQuestions]);

  useEffect(() => {
    if (quizCompleted) {
      const storeQuizStatus = async () => {
        try {
          await api.post("/poi-completed", {
            poiCompleted: volcanoId,
          });
        } catch (err: any) {
          console.error("Failed to update:", err.response?.data || err.message);
        }
      };
      storeQuizStatus();
    }
  }, [quizCompleted, volcanoId]);

  if (quizCompleted) {
    return (
      <div className="flex flex-col justify-center px-5 h-[85vh] items-center bg-lightbrown">
        {findingImages[volcanoId - 1] && (
          <div
            className="rounded-2xl h-[362px] w-[362px] mb-4 flex justify-center items-center"
            style={{
              backgroundImage: "url(/bg.svg)",
              backgroundSize: "cover",
            }}
          >
            <img
              src={findingImages[volcanoId - 1].src}
              alt={`Finding for Volcano ${volcanoId}`}
              className="w-[65%]"
            />
          </div>
        )}
        <h1 className="text-xl font-bold text-blackfont mb-12 text-center">
          {findingNames[volcanoId - 1]}
        </h1>
        {/* <h1 className="text-lg text-primary mb-6 text-center">
          {t1("description")}
        </h1> */}
        <CustomButton
          onClick={() => {
            refreshUser();
            router.push("/dashboard");
          }}
        >
          {t1("button")}
        </CustomButton>
      </div>
    );
  }

  if (allQuestions.length === 0) {
    return <p className="text-center mt-10">No quiz found for this volcano.</p>;
  }

  return (
    <div className="flex flex-col justify-center items-center pb-[95px] bg-lightbrown ">
      <div className="bg-white w-full flex h-[350px] items-center justify-center">
        <h1 className="text-4xl font-extrabold text-blackfont text-center px-[38px] font-karla">
          {selectedQuestion?.title}
        </h1>
      </div>
      <div className="flex flex-col gap-4 mt-[79px] px-4 w-full">
        {labels.map((label, index) => (
          <div
            key={index}
            onClick={() => !selected && handleSelect(texts[index])}
            className={`min-h-[56px] rounded-4xl border-2 px-4 py-3 flex items-center gap-4 cursor-pointer transition-colors duration-300 ${getOptionClass(
              texts[index]
            )}`}
          >
            <div
              className={`font-bold flex items-center justify-center
    ${
      !selected
        ? "text-green"
        : selected === selectedQuestion.correct
        ? texts[index] === selected
          ? "text-white"
          : "text-green"
        : texts[index] === selected || texts[index] === selectedQuestion.correct
        ? "text-white"
        : "text-green"
    }
  `}
            >
              {label}
            </div>
            <h1 className="text-sm">{texts[index]}</h1>
          </div>
        ))}
      </div>
      <div className="px-5 w-full">
        {showPlayAgain && (
          <CustomButton onClick={handlePlayAgain} className="mt-6 w-full">
            {t1("try_again")}
          </CustomButton>
        )}
      </div>
    </div>
  );
};

export default Quiz;
