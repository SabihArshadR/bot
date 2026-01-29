// "use client";

// import { useEffect, useState } from "react";

// interface TypewriterProps {
//   text: string;
//   speed?: number;
//   className?: string;
// }

// export function Typewriter({ text, speed = 30, className = "" }: TypewriterProps) {
//   const [displayText, setDisplayText] = useState("");
//   const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {
//     if (currentIndex < text.length) {
//       const timeout = setTimeout(() => {
//         setDisplayText(prevText => prevText + text[currentIndex]);
//         setCurrentIndex(prevIndex => prevIndex + 1);
//       }, speed);

//       return () => clearTimeout(timeout);
//     }
//   }, [currentIndex, text, speed]);

//   return <span className={className}>{displayText}</span>;
// }

"use client";

import { useEffect, useState } from "react";

interface TypewriterProps {
  text: string;
  speed?: number;
  className?: string;
  wordsPerPage?: number;
  pauseAfterPage?: number;
  loop?: boolean;
}

export function Typewriter({
  text,
  speed = 30,
  className = "",
  wordsPerPage = 100,
  pauseAfterPage = 1000,
  loop = false,
}: TypewriterProps) {
  const words = text.split(" ");
  const pages: string[] = [];

  for (let i = 0; i < words.length; i += wordsPerPage) {
    pages.push(words.slice(i, i + wordsPerPage).join(" "));
  }

  const [pageIndex, setPageIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    if (pageIndex >= pages.length) {
      if (loop) {
        // Reset to the first page if looping is enabled
        setPageIndex(0);
        setCharIndex(0);
        setDisplayText("");
      }
      return;
    }

    const currentText = pages[pageIndex];

    if (charIndex < currentText.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + currentText[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else {
      // Finished this page → pause → clear → next page
      const timeout = setTimeout(() => {
        setDisplayText("");
        setCharIndex(0);
        setPageIndex((prev) => {
          // If we're on the last page and loop is enabled, reset to 0
          if (loop && prev === pages.length - 1) {
            return 0;
          }
          return prev + 1;
        });
      }, pauseAfterPage);

      return () => clearTimeout(timeout);
    }
  }, [charIndex, pageIndex, pages, speed, pauseAfterPage]);

  return <span className={className}>{displayText}</span>;
}
