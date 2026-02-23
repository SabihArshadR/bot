import React, { useCallback, useEffect, useState, useTransition } from "react";
import {
  Navbar,
  NavbarContent,
  NavbarMenuToggle,
  NavbarMenu,
  Link,
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { useLocale, useTranslations } from "next-intl";
import { locales } from "@/i18n/config";
import { useSession } from "next-auth/react";

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

const DropDown = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [selectedLocale, setSelectedLocale] = useState("ca");
  const [ShowMorePopup, setShowMorePopup] = useState(false);
  const [_, startTransition] = useTransition();
  const { status } = useSession();

  const currentLocale = useLocale();
  const t = useTranslations("Links");
  const t2 = useTranslations("Dashboard");

  const languageNames: Record<string, string> = {
    ca: t2("lang1"),
    es: t2("lang2"),
    en: t2("lang3"),
    fr: t2("lang4"),
  };

  useEffect(() => {
    setSelectedLocale(currentLocale);
  }, [currentLocale]);

  const handleLanguageChange = async (locale: string) => {
    // if (locale === selectedLocale) return;

    setSelectedLocale(locale);
    await playButtonSound();
    document.cookie = `NEXT_LOCALE=${locale}; path=/`;

    startTransition(() => { 
      window.location.reload();
    });
  };

  const playButtonSound = useCallback(async () => {
    try {
      const audio = new Audio("/button-sounds/10.mp3");
      await audio.play();
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  }, []);

  return (
    <div>
      <Dropdown>
        <DropdownTrigger>
          <Button variant="flat" className=" border border-skin">
            <div className="flex items-center gap-2">
              {FlagIcons[selectedLocale]()}
              {/* <span>{languageNames[selectedLocale]}</span> */}
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-black"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Language selection"
          className="bg-white border border-skin rounded-md shadow-md p-2 w-full"
        >
          {Object.entries(languageNames).map(([locale, name]) => (
            <DropdownItem
              key={locale}
              onClick={() => handleLanguageChange(locale)}
              className={`px-3 py-2 rounded-md hover:bg-primary hover:text-white cursor-pointer flex items-center gap-2 ${
                selectedLocale === locale
                  ? "bg-green  font-medium text-white"
                  : ""
              }`}
            >
              <div className="flex items-center gap-2">
                {FlagIcons[locale]()}
                <span>{name}</span>
              </div>
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default DropDown;
