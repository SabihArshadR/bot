"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  ReactNode,
  useState,
  useCallback,
} from "react";
import { usePathname } from "next/navigation";
import { useUser } from "./UserContext";

interface AudioContextType {
  isPlaying: boolean;
  toggleAudio: () => void;
  setVolume: (volume: number) => void;
  isPopupActive: boolean;
  setPopupActive: (isActive: boolean) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const audioRefs = useRef<HTMLAudioElement[]>([]);
  const completionSoundRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPopupActive, setIsPopupActive] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [hasPlayedCompletionSound, setHasPlayedCompletionSound] =
    useState(false);
  const { user } = useUser();
  const audioSources = [
    "/button-sounds/background1.mp3",
    "/button-sounds/background2.mp3",
    "/button-sounds/background3.mp3",
  ];
  const TOTAL_POIS = 5; // Total number of POIs in the game
  const isGameCompleted = user?.POIsCompleted === TOTAL_POIS;

  const pathname = usePathname();

  // Handle route changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (
      pathname === "/" ||
      pathname?.includes("/login") ||
      pathname?.includes("/ruta-introduction") ||
      pathname?.includes("/game-select") ||
      pathname?.includes("/description") ||
      pathname?.includes("/poiIntro") ||
      pathname?.includes("/ar")
    ) {
      audioRefs.current?.forEach((audio) => audio.pause());
      setIsPlaying(false);
    } else if (isPlaying) {
      if (!isGameCompleted) {
        audioRefs.current[currentTrack]?.play().catch(console.error);
      }
    }
  }, [pathname, isPlaying, isGameCompleted]);

  // Check for POI completion and play completion sound
  useEffect(() => {
    if (
      user?.POIsCompleted === TOTAL_POIS &&
      completionSoundRef.current &&
      !hasPlayedCompletionSound
    ) {
      // Preserve the previous playback state (needed to restore later)
      const wasPlaying = isPlaying;

      // Always pause any background tracks that might be playing
      audioRefs.current.forEach((audio) => audio.pause());

      /*
       * Force the UI into the "un-muted" state so the user can decide to mute
       * the completion sound if desired. We *only* do this when the music was
       * previously muted so that we do not overwrite the user's current choice.
       */
      if (!wasPlaying) {
        setIsPlaying(true);
      }

      // Play completion sound
      completionSoundRef.current.play().catch(console.error);
      setHasPlayedCompletionSound(true);

      // Handle what happens once the completion sound ends
      completionSoundRef.current.onended = () => {
        if (wasPlaying && !isPopupActive && !isGameCompleted) {
          // Added !isGameCompleted
          audioRefs.current[currentTrack]?.play().catch(console.error);
        } else if (!wasPlaying || isGameCompleted) {
          // Ensure it stops if game is done
          setIsPlaying(false);
        }
      };
    } else if (user?.POIsCompleted < TOTAL_POIS) {
      // Game restarted – allow completion sound to be played again later
      setHasPlayedCompletionSound(false);
    }
    /*
     * We intentionally leave `isPlaying` out of the dependency array to avoid
     * re-running this effect when the user manually toggles audio during the
     * completion sound.
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    user?.POIsCompleted,
    isPopupActive,
    currentTrack,
    hasPlayedCompletionSound,
  ]);

  // Function to play the next track
  const playNextTrack = useCallback(() => {
    setCurrentTrack((prev) => (prev + 1) % audioSources.length);
  }, [audioSources.length]);

  // Initialize audio elements
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Create audio elements for all background tracks
      audioRefs.current = audioSources.map((src, index) => {
        const audio = new Audio(src);
        audio.volume = 0.1;
        audio.load();

        // Set up event listener for when a track ends
        audio.addEventListener("ended", () => {
          // Pause current track
          audio.pause();
          // Play next track
          playNextTrack();
        });

        return audio;
      });

      // Initialize completion sound
      completionSoundRef.current = new Audio("/audios/botcompletion90.mp3");
      completionSoundRef.current.volume = 0.5; // Adjust volume as needed
      completionSoundRef.current.load();

      // Try to play on user interaction
      const handleFirstInteraction = () => {
        if (
          !isPlaying &&
          ![
            "/",
            "/login",
            "/ruta-introduction",
            "/game-select",
            "/description",
            "/poiIntro",
            "/ar",
          ].some((route) => pathname?.includes(route))
        ) {
          // Play the first track
          audioRefs.current[0]?.play().catch((error) => {
            console.error("Error playing background music:", error);
          });
          setIsPlaying(true);
        }
        document.removeEventListener("click", handleFirstInteraction);
        document.removeEventListener("touchstart", handleFirstInteraction);
      };

      // Add event listeners for first interaction
      document.addEventListener("click", handleFirstInteraction);
      document.addEventListener("touchstart", handleFirstInteraction);

      // Handle page visibility changes
      const handleVisibilityChange = () => {
        if (document.hidden) {
          audioRefs.current.forEach((audio) => audio.pause());
        } else if (
          isPlaying &&
          ![
            "/",
            "/login",
            "/ruta-introduction",
            "/game-select",
            "/description",
            "/poiIntro",
            "/ar",
          ].some((route) => pathname?.includes(route))
        ) {
          // Resume playing the current track
          audioRefs.current[currentTrack]?.play().catch(console.error);
        }
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);

      // Initial play if not in a restricted route
      if (
        ![
          "/",
          "/login",
          "/ruta-introduction",
          "/game-select",
          "/description",
          "/poiIntro",
          "/ar",
        ].some((route) => window.location.pathname.includes(route))
      ) {
        audioRefs.current[0]?.play().catch(console.error);
        setIsPlaying(true);
      }

      return () => {
        document.removeEventListener("click", handleFirstInteraction);
        document.removeEventListener("touchstart", handleFirstInteraction);
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange,
        );
        audioRefs.current?.forEach((audio) => audio.pause());
        audioRefs.current = [];
      };
    }
  }, []);

  const setPopupActive = (isActive: boolean) => {
    setIsPopupActive(isActive);
    if (isActive && isPlaying) {
      audioRefs.current?.forEach((audio) => audio.pause());
    } else if (!isActive && isPlaying) {
      audioRefs.current[currentTrack]?.play().catch(console.error);
    }
  };

  // Effect to handle track changes
  useEffect(() => {
    if (!isPlaying || isGameCompleted) return;

    // Pause all tracks
    // audioRefs.current.forEach((audio) => audio.pause());

    audioRefs.current.forEach((audio) => audio.pause());
    audioRefs.current[currentTrack]?.play().catch(console.error);

    // Play the current track
    // audioRefs.current[currentTrack]?.play().catch(console.error);
  }, [currentTrack, isPlaying, isGameCompleted]);

  const toggleAudio = useCallback(() => {
    const isGameCompleted = user?.POIsCompleted === TOTAL_POIS;

    if (isPlaying) {
      // 1. If currently playing, PAUSE EVERYTHING
      audioRefs.current.forEach((audio) => audio.pause());
      if (completionSoundRef.current) {
        completionSoundRef.current.pause();
        // We don't necessarily want to reset to 0 here
        // unless you want the sound to start over every time you unmute
      }
      setIsPlaying(false);
    } else {
      // 2. If currently muted, DECIDE WHAT TO PLAY
      if (isGameCompleted && completionSoundRef.current) {
        // Play completion sound if game is done
        completionSoundRef.current.play().catch(console.error);
      } else {
        // Play regular background music if game is still going
        audioRefs.current[currentTrack]?.play().catch(console.error);
      }
      setIsPlaying(true);
    }
  }, [isPlaying, currentTrack, user?.POIsCompleted]); // Added user dependency

  const setVolume = (volume: number) => {
    audioRefs.current.forEach((audio) => {
      if (audio) {
        audio.volume = volume;
      }
    });
  };

  return (
    <AudioContext.Provider
      value={{
        isPlaying: isPlaying && !isPopupActive,
        toggleAudio,
        setVolume,
        isPopupActive,
        setPopupActive,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
