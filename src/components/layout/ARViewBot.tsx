"use client";

import React, { useEffect, useState, useRef } from "react";
import Loading from "@/components/layout/Loading";
import CustomButton from "../ui/Button";
import { useTranslations } from "next-intl";

const AScene = (props: any) => React.createElement("a-scene", props);
const ACamera = (props: any) => React.createElement("a-camera", props);
const AEntity = (props: any) => React.createElement("a-entity", props);
const ACircle = (props: any) => React.createElement("a-circle", props);
const ARing = (props: any) => React.createElement("a-ring", props);

const subtitle = [
  {
    time: 0,
    text: "Hola a tothom. Soc el Gegant de les muntanyes de Bot i fa molts anys que dormo dalt del cim,",
  },
  {
    time: 6,
    text: "on sempre m’arriba l’eco del poble quan és festa. Cada any, la Dansada m’acompanya inclús quan dormo.",
  },
  {
    time: 12,
    text: "Però avui… no ha sonat res. Cap gralla, cap timbal, cap ball. El silenci m’ha despertat de cop: un silenci estrany, pesant, com si el poble s’hagués apagat.",
  },
  {
    time: 22,
    text: "I amb aquest silenci he notat la fam i la foscor que planen pels carrers.",
  },
  {
    time: 27,
    text: "Per això he baixat al poble a saber què està passant, perquè si la Dansada no torna a sonar, jo no puc tornar a descansar.",
  },
  {
    time: 34,
    text: "I aquí és on entreu vosaltres.",
  },
  {
    time: 36,
    text: "A cada indret de la ruta descobrireu un fragment d’aquesta història. Per avançar i ajudar-me a recuperar la Dansada,",
  },
  {
    time: 41,
    text: "haureu de recollir aliments amb realitat augmentada: pa, oli, ametlles, raïm i salsitxes.",
  },
  {
    time: 49,
    text: "Són més que menjar: simbolitzen l’esforç, la solidaritat i la supervivència de la gent d’aquells anys.",
  },
  {
    time: 55,
    text: "A més, a cada parada haureu de respondre una pregunta. Si l’encerteu, guanyareu els instruments de la Dansada i elements propis d’aquesta tradició.",
  },
  {
    time: 65,
    text: "Quan hàgiu recuperat tots els elements, jo podré tornar a dormir… i la música, l’esperança i l’alegria tornaran a omplir els carrers del poble.",
  },
  {
    time: 72,
    text: "Us espero al primer punt de la ruta. Trobareu el mapa a la pàgina principal del joc.",
  },
  {
    time: 77,
    text: "Fins a la pròxima!",
  },
];

const Marker = React.forwardRef((_, ref: any) => (
  <AEntity ref={ref} position="0 -0.9 -2">
    <ARing
      radius-inner="0.3"
      radius-outer="0.4"
      color="#4F46E5"
      opacity="0.8"
      rotation="-90 0 0"
    />
    <ACircle radius="0.3" color="#10B981" opacity="0.5" rotation="-90 0 0" />
  </AEntity>
));
Marker.displayName = "Marker";

interface AvatarProps {
  position: { x: number; y: number; z: number };
  isPlaying: boolean;
  deviceOrientation: { alpha: number; beta: number; gamma: number };
  userRotationY?: number;
  userScale?: number;
}

const Avatar = React.forwardRef((props: AvatarProps, forwardedRef: any) => {
  const localRef = useRef<any>(null);
  const avatarRef = forwardedRef || localRef;
  const {
    position,
    isPlaying,
    deviceOrientation,
    userRotationY = 0,
    userScale = 0.5,
  } = props;

  useEffect(() => {
    if (avatarRef.current) {
      const entity = avatarRef.current;
      const mesh = entity.getObject3D("mesh");

      const disableFrustumCulling = (m: any) => {
        m.traverse((obj: any) => {
          obj.frustumCulled = false;
        });
      };

      if (mesh) {
        disableFrustumCulling(mesh);
      } else {
        entity.addEventListener("model-loaded", (evt: any) => {
          disableFrustumCulling(evt.detail.model);
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AEntity
      ref={avatarRef}
      position={`${position.x} ${position.y} ${position.z}`}
      // rotation={`-10 ${deviceOrientation.alpha + userRotationY} 0`}
      rotation={`-10 ${userRotationY} 0`}
      scale={`${userScale} ${userScale} ${userScale}`}
    >
      <AEntity
        light="type: point; color: #ffffff; intensity: 0; distance: 5; decay: 2"
        position="0 1 0"
      />
      <AEntity
        gltf-model="url(/models/ANIMACION_OK.glb)"
        animation-mixer={
          isPlaying
            ? // ? `clip: rig.001Action|CircleAction|eye.leftAction|eye.rightAction|eyelid_left_downAction|eyelid_left_upAction|eyelid_right_downAction|eyelid_right_upAction|tongueAction; useRegExp: true; loop: repeat; timeScale: 1`
              // : `clip: rig.001Action|CircleAction|eye.leftAction|eye.rightAction|eyelid_left_downAction|eyelid_left_upAction|eyelid_right_downAction|eyelid_right_upAction|tongueAction; useRegExp: true; loop: repeat; timeScale: 0`
              "clip: *; loop: repeat; timeScale: 1"
            : "clip: *; loop: repeat; timeScale: 0"
        }
      />
    </AEntity>
  );
});
Avatar.displayName = "Avatar";

const Page = ({
  setShowARView,
  handleClose,
  audioUrl,
  linkLoad,
  from,
}: any) => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [activeSubtitle, setActiveSubtitle] = useState("");
  const [showSubtitleButton, setShowSubtitleButton] = useState(false);
  const t = useTranslations("gameText");
  const t2 = useTranslations("intro");
  const [showMovementInstructions, setShowMovementInstructions] =
    useState(false);

  const [avatarPos, setAvatarPos] = useState<{
    x: number;
    y: number;
    z: number;
  } | null>(null);
  const [isPlayingState, setIsPlayingState] = useState(false);
  const [showAudioPopup, setShowAudioPopup] = useState(false);
  const [audioCompleted, setAudioCompleted] = useState(false);
  const [deviceOrientation, setDeviceOrientation] = useState({
    alpha: 0,
    beta: 0,
    gamma: 0,
  });
  const [userRotationY, setUserRotationY] = useState(0);
  const [userScale, setUserScale] = useState(0.5);

  const isPlayingRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const markerRef = useRef<any>(null);
  const avatarRef = useRef<any>(null);
  const gestureState = useRef<any>({});
  const orientationHandlerRef = useRef<any>(null);
  const dracoInitializedRef = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        stream.getTracks().forEach((track) => track.stop());
        setPermissionGranted(true);

        if (
          typeof DeviceOrientationEvent !== "undefined" &&
          // @ts-ignore
          typeof DeviceOrientationEvent.requestPermission === "function"
        ) {
          try {
            // @ts-ignore
            const permission = await DeviceOrientationEvent.requestPermission();
            if (permission === "granted") startOrientationTracking();
          } catch {
            /* ignore */
          }
        } else {
          startOrientationTracking();
        }
      } catch {
        setPermissionGranted(false);
      }
    })();

    return () => {
      if (orientationHandlerRef.current)
        window.removeEventListener(
          "deviceorientation",
          orientationHandlerRef.current,
        );
    };
  }, []);

  const startOrientationTracking = () => {
    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      setDeviceOrientation({
        alpha: event.alpha || 0,
        beta: event.beta || 0,
        gamma: event.gamma || 0,
      });
    };
    orientationHandlerRef.current = handleDeviceOrientation;
    window.addEventListener("deviceorientation", handleDeviceOrientation);
  };

  const isIOS = () =>
    typeof navigator !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    !(window as any).MSStream;

  const updateSubtitle = (currentTime: number) => {
    if (!showSubtitles) {
      setActiveSubtitle("");
      return;
    }

    // Find the last subtitle that should be shown at the current time
    const currentSubtitle = [...subtitle]
      .reverse()
      .find((s) => currentTime >= s.time);
    setActiveSubtitle(currentSubtitle?.text || "");
  };

  const toggleSubtitles = () => {
    setShowSubtitles(!showSubtitles);
    if (!showSubtitles && audioRef.current) {
      updateSubtitle(audioRef.current.currentTime);
    } else {
      setActiveSubtitle("");
    }
  };

  const startAnimationAndAudio = async () => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(audioUrl);
        audioRef.current.preload = "auto";
        audioRef.current.ontimeupdate = () => {
          if (audioRef.current) {
            updateSubtitle(audioRef.current.currentTime);
          }
        };
        audioRef.current.onplay = () => {
          setShowSubtitleButton(true);
          if (showSubtitles) {
            updateSubtitle(audioRef.current?.currentTime || 0);
          }
        };
        audioRef.current.onended = () => {
          stopAnimationAndAudio();
          setAudioCompleted(true);
          setActiveSubtitle("");
          setTimeout(() => handleBackFromAR(), 100);
        };
      }
      await audioRef.current.play();
      isPlayingRef.current = true;
      setIsPlayingState(true);
    } catch (err) {
      console.log("Playback failed:", err);
      setShowAudioPopup(true);
    }
  };

  const stopAnimationAndAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = "";
    }
    isPlayingRef.current = false;
    setIsPlayingState(false);
    setActiveSubtitle("");
    setShowSubtitleButton(false);
  };

  const handleBackFromAR = () => {
    stopAnimationAndAudio();
    setShowARView(false);
    handleClose();
  };

  const handleAllowAudio = () => {
    setShowAudioPopup(false);
    startAnimationAndAudio();
  };

  const placeAvatar = () => {
    if (markerRef.current) {
      const worldPos = new (window as any).THREE.Vector3();
      markerRef.current.object3D.getWorldPosition(worldPos);
      setAvatarPos({ x: worldPos.x, y: worldPos.y + 0.3, z: worldPos.z });
      startAnimationAndAudio();
      setShowMovementInstructions(true);
    }
  };

  const getTouchDistance = (t0: any, t1: any) => {
    const dx = t0.clientX - t1.clientX;
    const dy = t0.clientY - t1.clientY;
    return Math.hypot(dx, dy);
  };

  const getTouchMidpoint = (t0: any, t1: any) => ({
    x: (t0.clientX + t1.clientX) / 2,
    y: (t0.clientY + t1.clientY) / 2,
  });

  const onTouchStart = (e: React.TouchEvent) => {
    if (!avatarPos) return;
    e.stopPropagation();

    if (showMovementInstructions) {
      setShowMovementInstructions(false);
    }


    const touches = e.touches;
    gestureState.current.start = true;
    if (touches.length === 1) {
      gestureState.current.mode = "rotate";
      gestureState.current.startX = touches[0].clientX;
      gestureState.current.startRotationY = userRotationY;
    } else if (touches.length === 2) {
      gestureState.current.mode = "pinch";
      gestureState.current.startDist = getTouchDistance(touches[0], touches[1]);
      gestureState.current.startScale = userScale;
      gestureState.current.startMid = getTouchMidpoint(touches[0], touches[1]);
      gestureState.current.startPos = { ...avatarPos };
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!gestureState.current.start) return;
    e.preventDefault();
    const touches = e.touches;
    if (gestureState.current.mode === "rotate" && touches.length === 1) {
      const dx = touches[0].clientX - gestureState.current.startX;
      const deltaY = dx * 0.2;
      setUserRotationY(gestureState.current.startRotationY + deltaY);
    } else if (touches.length === 2) {
      const dist = getTouchDistance(touches[0], touches[1]);
      const scaleFactor = dist / gestureState.current.startDist;
      const newScale = Math.min(
        Math.max(gestureState.current.startScale * scaleFactor, 0.2),
        2,
      );
      setUserScale(newScale);

      const mid = getTouchMidpoint(touches[0], touches[1]);
      const dy = mid.y - gestureState.current.startMid.y;
      const dx = mid.x - gestureState.current.startMid.x;
      const panFactor = 0.0025 * (1 / Math.max(newScale, 0.2));

      setAvatarPos((p) =>
        p
          ? {
              x: gestureState.current.startPos.x - dx * panFactor,
              y: gestureState.current.startPos.y - dy * panFactor,
              z: gestureState.current.startPos.z,
            }
          : p,
      );
    }
  };

  const onTouchEnd = () => {
    gestureState.current.start = false;
    gestureState.current.mode = null;
  };

  // Cleanup function to stop audio and clean up resources
  useEffect(() => {
    return () => {
      // Stop and clean up audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.src = "";
        audioRef.current = null;
      }

      // Clean up device orientation listener
      if (orientationHandlerRef.current) {
        window.removeEventListener(
          "deviceorientation",
          orientationHandlerRef.current,
        );
      }

      // Reset animation state
      isPlayingRef.current = false;
      setIsPlayingState(false);
    };
  }, []);

  useEffect(() => {
    if (!permissionGranted) return;
    if (!linkLoad) {
      setScriptsLoaded(true);
      return;
    }

    const scriptClass = "poi-page-script";
    const addedScripts: HTMLScriptElement[] = [];

    const loadScript = (src: string) =>
      new Promise<void>((resolve, reject) => {
        if ((window as any)._loadedScripts?.[src]) return resolve();
        const existing = document.querySelector(`script[src="${src}"]`);
        if (existing) return resolve();

        const s = document.createElement("script");
        s.src = src;
        s.async = false;
        s.classList.add(scriptClass);
        s.dataset.pageScript = scriptClass;
        s.onload = () => {
          (window as any)._loadedScripts = {
            ...(window as any)._loadedScripts,
            [src]: true,
          };
          resolve();
        };
        s.onerror = () => reject();
        document.head.appendChild(s);
        addedScripts.push(s);
      });

    const setupDracoLoader = () => {
      if (
        !(window as any).AFRAME ||
        !(window as any).THREE ||
        dracoInitializedRef.current
      )
        return;
      const AFRAME = (window as any).AFRAME;
      const THREE = (window as any).THREE;
      try {
        const dracoLoader = new THREE.DRACOLoader();
        dracoLoader.setDecoderPath(
          "https://www.gstatic.com/draco/versioned/decoders/1.5.6/",
        );
        dracoLoader.preload();
        if (AFRAME.components["gltf-model"]) {
          const originalUpdate =
            AFRAME.components["gltf-model"].Component.prototype.update;
          AFRAME.components["gltf-model"].Component.prototype.update =
            function (oldData: any) {
              if (!this.loader) this.loader = new THREE.GLTFLoader();
              if (!this.loader.dracoLoader)
                this.loader.setDRACOLoader(dracoLoader);
              if (originalUpdate) return originalUpdate.call(this, oldData);
            };
        }
        dracoInitializedRef.current = true;
      } catch {
        /* ignore */
      }
    };

    const loadAll = async () => {
      try {
        if (!(window as any).AFRAME) {
          await loadScript("https://aframe.io/releases/1.3.0/aframe.min.js");
        }
        await new Promise((resolve) => {
          const check = () =>
            (window as any).AFRAME ? resolve(true) : setTimeout(check, 50);
          check();
        });

        if (isIOS()) {
          await loadScript(
            "https://cdn.jsdelivr.net/gh/AR-js-org/AR.js@3.4.5/aframe/build/aframe-ar.js",
          );
        } else {
          await loadScript(
            "https://cdn.jsdelivr.net/gh/AR-js-org/AR.js@3.4.5/aframe/build/aframe-ar-nft.min.js",
          );
        }

        await loadScript(
          "https://cdn.jsdelivr.net/npm/aframe-extras@7.6.0/dist/aframe-extras.min.js",
        );
        if (!(window as any).THREE) {
          await loadScript(
            "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js",
          );
        }
        await loadScript(
          "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/DRACOLoader.js",
        );
        setupDracoLoader();
        setScriptsLoaded(true);
      } catch {
        setScriptsLoaded(false);
      }
    };

    loadAll();
  }, [permissionGranted, linkLoad]);

  if (!permissionGranted) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-white w-full">
        <p>⚠️ {t("cameraPermission")}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {t("try_again")}
        </button>
      </div>
    );
  }

  if (!scriptsLoaded || !(window as any).AFRAME) return <Loading />;

  return (
    <div className="w-full h-screen relative">
      <AScene
        vr-mode-ui="enabled: false"
        embedded
        arjs="sourceType: webcam; videoTexture: true; facingMode: environment; debugUIEnabled: false"
        renderer="alpha: true; logarithmicDepthBuffer: true; precision: mediump; colorManagement: true; toneMapping: Linear" // colorManagement: true; toneMapping: Linear;
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <AEntity light="type: ambient; color: #ffffff; intensity: 1.5" />
        <AEntity
          light="type: directional; color: #ffffff; intensity: 1.5"
          position="1 1 1"
        />

        <ACamera position="0 0 0" look-controls="touchEnabled: false">
          {!avatarPos && <Marker ref={markerRef} />}
        </ACamera>

        {avatarPos && (
          <Avatar
            ref={avatarRef}
            position={avatarPos}
            isPlaying={isPlayingState}
            deviceOrientation={deviceOrientation}
            userRotationY={userRotationY}
            userScale={userScale}
          />
        )}
      </AScene>
      {avatarPos && (
        <div
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onTouchCancel={onTouchEnd}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2147483648,
            touchAction: "none",
            background: "transparent",
          }}
        />
      )}
      {!avatarPos && (
        <div
          className={`fixed bottom-10 w-full flex justify-center ${from == "intro" ? "left-0" : ""}`}
          style={{ zIndex: 2147483646 }}
        >
          <CustomButton
            onClick={placeAvatar}
            className="px-6 py-3 !w-[300px] text-white shadow-lg"
          >
            {t("place")}
          </CustomButton>
        </div>
      )}
      {showAudioPopup && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70"
          style={{ zIndex: 2147483647 }}
        >
          <div className="bg-white p-6 rounded-xl shadow-xl flex flex-col items-center gap-4">
            <p className="text-lg font-semibold text-center">
              🔊 {t("audioPermission")}
            </p>
            <CustomButton
              onClick={handleAllowAudio}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {t("audioAllow")}
            </CustomButton>
            <CustomButton
              onClick={() => setShowAudioPopup(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded"
            >
              {t("Cancel")}
            </CustomButton>
          </div>
        </div>
      )}
      {showSubtitleButton && (
        <div className="fixed top-6 right-4 z-[2147483647]">
          <button
            onClick={toggleSubtitles}
            className="px-3 py-2 text-[11px] bg-black/70 text-white rounded-lg transition-all duration-400 ease-in-out hover:brightness-150 active:brightness-150 active:-translate-y-[5px]"
          >
            {t2(showSubtitles ? "sub1" : "sub2")}
          </button>
        </div>
      )}
      {showSubtitles && activeSubtitle && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%]">
          <div className="bg-black/70 text-white text-center px-4 py-5 rounded-lg text-[13px] leading-relaxed shadow-lg">
            {activeSubtitle}
          </div>
        </div>
      )}
      {showMovementInstructions && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[2147483647] w-[90%] max-w-md">
          <div className="bg-black/80 text-white text-center px-6 py-4 rounded-xl shadow-2xl border border-white/20">
            <p className="text-base font-medium mb-2">💡 {t2("info1")}</p>
            <p className="text-sm opacity-90">
              {t2("info2")} <br></br> {t2("info3")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
