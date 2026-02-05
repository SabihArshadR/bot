"use client";
import Image from "next/image";
import Logo from "@/assets/logo_EACB.png";
import React, { useCallback } from "react";
import CustomButton from "../ui/Button";
import CustomInput from "../ui/Input";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import axios from "axios";
import { toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { FaMicrosoft } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useUser } from "@/context/UserContext";

const ManualLogin = () => {
  const router = useRouter();
  const t = useTranslations("Login");
  const t1 = useTranslations("Register");
  const t2 = useTranslations("Auth");

  const { refreshUser } = useUser();
  const { data: session, update } = useSession();

  // const [email, setEmail] = React.useState("");
  const [username, setUsername] = React.useState("");
  // const [password, setPassword] = React.useState("");
  // const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
   const locale = useLocale();

  // const handleLogin = async () => {
  //   if (!username) {
  //     toast.error(t("username required"));
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     // const response = await axios.post("/api/auth/login", { email, password });
  //     const response = await axios.post("/api/auth/login", { username });
  //     const data = response.data;
  //     if (response.data.success) {
  //       // if (!response.data.isVerified) {
  //       //   toast.error(t("email_not_verified"));
  //       //   router.push(`/verify-email?userId=${response.data.userId}`);
  //       //   return;
  //       // }
  //       await refreshUser();

  //       // const result = await signIn("credentials", {
  //       //   redirect: false,
  //       //   email,
  //       //   password,
  //       // });

  //       // if (result?.error) {
  //       //   toast.error(t("login_failed"));
  //       // } else {
  //       //   toast.success(t("login_success"));
  //       //   setTimeout(() => {
  //       //     router.push("/");
  //       //   }, 3000);
  //       // }
  //       toast.success(t("login_success"));
  //       setTimeout(() => {
  //         router.push("/");
  //       }, 3000);

  //     } else {
  //       toast.error(response.data.error || t("login_failed"));
  //     }
  //   } catch (err: any) {
  //     toast.error(err.response?.data?.error || t("something_wrong"));
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const playButtonSound = useCallback(() => {
    try {
      const audio = new Audio("/button-sounds/3.mp3");
      audio
        .play()
        .catch((error) => console.error("Error playing sound:", error));
    } catch (error) {
      console.error("Error initializing sound:", error);
    }
  }, []);

  const handleLogin = async () => {
    playButtonSound();
    if (!username) {
      toast.error(t("username_required"));
      return;
    }

    try {
      setLoading(true);

      // Sign in using NextAuth's signIn with credentials
      const result = await signIn("credentials", {
        redirect: false,
        username,
        callbackUrl: "/",
      });

      if (result?.error) {
        // If the user does not exist yet, attempt to create and log them in.
        await handleNewLogin();
      } else {
        await refreshUser();
        toast.success(t("login_success"));
        router.push("/dashboard");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || t("something_wrong"));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Attempts to register the current username and, on success, logs the user in.
   * This is used as a fallback when a sign-in attempt fails because the user does
   * not exist yet.
   */
  const handleNewLogin = async () => {
    if (!username) {
      toast.error(t("username_required"));
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Create the user with the provided username
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-locale": locale,
        },
        body: JSON.stringify({ username }),
      });

      const data = await res.json().catch(() => ({} as any));
      if (!res.ok) {
        const message = (data && (data.error || data.message)) || `Request failed (${res.status})`;
        toast.error(message);
        return;
      }

      // Registration succeeded ✅
      // toast.success(t1("registerSuccess"));

      // 2️⃣ Immediately sign in the newly-created user
      const result = await signIn("credentials", {
        redirect: false,
        username,
        callbackUrl: "/",
      });

      if (result?.error) {
        toast.error(t("login_failed"));
        return;
      }

      await refreshUser();
      toast.success(t("login_success"));
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || t("something_wrong"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center py-5 px-4 h-[80vh] bg-white">
      <div className="desktop:max-w-[400px] tablet:max-w-[400px] mobile:w-full mt-10">
        <div className="flex flex-col gap-[22px]">
          <div>
            <h1 className="mb-2 text-green">{t1("field1")}*</h1>
            <CustomInput
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              // placeholder={t1("field3")}
            />
          </div>

          {/* <div>
            <h1 className="mb-2 text-green">{t1("field4")}*</h1>
            <div className="relative">
              <CustomInput
                value={password}
                type={showPassword ? "text" : "password"}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t1("field4")}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 cursor-pointer text-green"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div> */}
        </div>
        <div className="mt-3">
          {/* <a href="/forgot-password" className="  mt-6">
            {t2("ForgotPassword")}
          </a> */}
          {/* <span>
            {t2("NoAccount")}{" "}
            <a href="/register" className=" !pt-6 mt-6 font-bold">
              {t2("CreateAccount")}
            </a>
          </span> */}
        </div>
        <div className="flex flex-col gap-4 mt-[45px]">
          <CustomButton onClick={handleLogin} disabled={loading}>
            {loading ? t("loading") : t("button1")}
          </CustomButton>

          {/* <div className="mt-3">
            <span>
              {t2("NoAccount")}{" "}
              <a href="/register" className=" !pt-6 mt-6 font-bold">
                {t2("CreateAccount")}
              </a>
            </span>
          </div> */}
          {/* <div className="flex items-center ">
            <div className="flex-1 border-t border-black"></div>

            <span className="poppins-medium font-medium text-black text-[17px] leading-none !mx-4">
              {t("or")}
            </span>

            <div className="flex-1 border-t border-black"></div>
          </div> */}
          {/* <CustomButton
            onClick={() => {
              playButtonSound();
              signIn("google", { callbackUrl: "/dashboard" });
            }}
            className="flex w-full items-center justify-center gap-2 mt-[16px]"
          >
            <FcGoogle size={20} /> {t("continue_google")}
          </CustomButton> */}
          {/* <CustomButton
            onClick={() => {
              playButtonSound();

              signIn("azure-ad", { callbackUrl: "/dashboard" });
            }}
            className="flex w-full items-center justify-center gap-2 mt-[12px]"
          >
            <FaMicrosoft size={20} /> {t("continue_microsoft")}
          </CustomButton> */}
        </div>
      </div>
    </div>
  );
};

export default ManualLogin;
