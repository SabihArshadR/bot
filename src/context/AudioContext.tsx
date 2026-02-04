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
import { usePathname } from 'next/navigation';

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
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPopupActive, setIsPopupActive] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const audioSources = [
    "/button-sounds/background1.mp3",
    "/button-sounds/background2.mp3",
    "/button-sounds/background3.mp3"
  ];

  const pathname = usePathname();

  // Handle route changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (pathname === '/' || pathname?.includes('/login') || pathname?.includes('/ruta-introduction') || pathname?.includes('/game-select') || pathname?.includes('/description') || pathname?.includes('/poiIntro') || pathname?.includes('/ar')) {
      audioRefs.current?.forEach(audio => audio.pause());
      setIsPlaying(false);
    } else if (isPlaying) {
      audioRefs.current[currentTrack]?.play().catch(console.error);
    }
  }, [pathname, isPlaying]);

  // Function to play the next track
  const playNextTrack = useCallback(() => {
    setCurrentTrack(prev => (prev + 1) % audioSources.length);
  }, [audioSources.length]);

  // Initialize audio elements
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Create audio elements for all sources
      audioRefs.current = audioSources.map((src, index) => {
        const audio = new Audio(src);
        audio.volume = 0.1;
        audio.load();
        
        // Set up event listener for when a track ends
        audio.addEventListener('ended', () => {
          // Pause current track
          audio.pause();
          // Play next track
          playNextTrack();
        });
        
        return audio;
      });

      // Try to play on user interaction
      const handleFirstInteraction = () => {
        if (!isPlaying && !['/', '/login', '/ruta-introduction', '/game-select', '/description', '/poiIntro', '/ar'].some(route => pathname?.includes(route))) {
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
          audioRefs.current.forEach(audio => audio.pause());
        } else if (isPlaying && !['/', '/login', '/ruta-introduction', '/game-select', '/description', '/poiIntro', '/ar'].some(route => pathname?.includes(route))) {
          // Resume playing the current track
          audioRefs.current[currentTrack]?.play().catch(console.error);
        }
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);

      // Initial play if not in a restricted route
      if (
        !['/', '/login', '/ruta-introduction', '/game-select', '/description', '/poiIntro', '/ar'].some(route => window.location.pathname.includes(route))
      ) {
        audioRefs.current[0]?.play().catch(console.error);
        setIsPlaying(true);
      }

      return () => {
        document.removeEventListener("click", handleFirstInteraction);
        document.removeEventListener("touchstart", handleFirstInteraction);
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
        audioRefs.current?.forEach(audio => audio.pause());
        audioRefs.current = [];
      };
    }
  }, []);

  const setPopupActive = (isActive: boolean) => {
    setIsPopupActive(isActive);
    if (isActive && isPlaying) {
      audioRefs.current?.forEach(audio => audio.pause());
    } else if (!isActive && isPlaying) {
      audioRefs.current[currentTrack]?.play().catch(console.error);
    }
  };

  // Effect to handle track changes
  useEffect(() => {
    if (!isPlaying) return;
    
    // Pause all tracks
    audioRefs.current.forEach(audio => audio.pause());
    
    // Play the current track
    audioRefs.current[currentTrack]?.play().catch(console.error);
    
  }, [currentTrack, isPlaying]);

  const toggleAudio = useCallback(() => {
    if (isPlaying) {
      // Pause all tracks
      audioRefs.current.forEach(audio => audio.pause());
    } else {
      // Resume playing the current track
      audioRefs.current[currentTrack]?.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, currentTrack]);

  const setVolume = (volume: number) => {
    audioRefs.current.forEach(audio => {
      if (audio) {
        audio.volume = volume;
      }
    });
  };

  return (
    <AudioContext.Provider value={{ isPlaying: isPlaying && !isPopupActive, toggleAudio, setVolume, isPopupActive, setPopupActive }}>
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
