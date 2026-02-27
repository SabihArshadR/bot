"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type User = {
  username: string;
  email: string;
  points: number;
  currentLevel: number;
  POIsCompleted: number;
  hasSeenPopup?: boolean;
};

type UserContextType = {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  updateUserProgress: (poiCompleted: number) => Promise<void>;
  resetUserProgress: () => Promise<void>;
};

// const UserContext = createContext<UserContextType>({
//   user: null,
//   loading: true,
//   refreshUser: async () => {},
//   updateUserProgress: async () => {},
//   resetUserProgress: async () => {},
// });

// Local storage utility functions
const getUserFromStorage = (): User | null => {
  if (typeof window === "undefined") return null;

  try {
    const userData = localStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error reading user data from localStorage:", error);
    return null;
  }
};

const saveUserToStorage = (user: User): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem("userData", JSON.stringify(user));
  } catch (error) {
    console.error("Error saving user data to localStorage:", error);
  }
};

const initializeUser = (session: any): User => {
  const username = (session.user as any)?.username || session.user?.email?.split('@')[0] || 'User';
  return {
    username,
    email: session.user.email || '',
    points: 0,
    currentLevel: 1,
    POIsCompleted: 0,
    hasSeenPopup: false,
  };
};

const UserContext = createContext<UserContextType>({
  user: null,
  loading: false,
  refreshUser: async () => {},
  updateUserProgress: async () => {},
  resetUserProgress: async () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();

  const fetchUser = async () => {
    try {
      setLoading(true);

      if (status === "unauthenticated" || !session) {
        setUser(null);
        return;
      }

      // Try to get user from localStorage first
      let userData = getUserFromStorage();

      // If no user data in storage, initialize with session data
      if (!userData) {
        userData = initializeUser(session);
        saveUserToStorage(userData);
      }

      setUser(userData);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const updateUserProgress = async (poiCompleted: number) => {
    if (!user) return;

    try {
      let newPOIsCompleted = poiCompleted;
      let newPoints = user.points || 0;
      let newLevel = user.currentLevel || 1;

      const milestones = [2, 4];
      const maxLevel = 3;

      milestones.forEach((milestone, idx) => {
        if (newPOIsCompleted >= milestone && newLevel < idx + 2) {
          newLevel = Math.min(idx + 2, maxLevel);
        }
      });

      const updatedUser = {
        ...user,
        POIsCompleted: newPOIsCompleted,
        currentLevel: newLevel,
        points: newPoints,
      };

      saveUserToStorage(updatedUser);
      setUser(updatedUser);
    } catch (error) {
      console.error("Failed to update user progress:", error);
    }
  };

  const resetUserProgress = async () => {
    if (!user) return;

    try {
      const resetUser = {
        ...user,
        points: 0,
        currentLevel: 1,
        POIsCompleted: 0,
        hasSeenPopup: false,
      };

      saveUserToStorage(resetUser);
      setUser(resetUser);
    } catch (error) {
      console.error("Failed to reset user progress:", error);
    }
  };

  useEffect(() => {
    if (status !== "loading") {
      fetchUser();
    }
  }, [status, session]);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        refreshUser: fetchUser,
        updateUserProgress,
        resetUserProgress,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
