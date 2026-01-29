"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, useProgress } from "@react-three/drei";
import {
  Suspense,
  useEffect,
  useRef,
  useState,
  Component,
  ReactNode,
} from "react";
import * as THREE from "three";
import { GLTFLoader } from "three-stdlib";
import { DRACOLoader } from "three-stdlib";

function Loading() {
  const { progress } = useProgress();
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-transparent z-10">
      <div className="w-8 h-8 border-2 border-[#A82B00] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

function ErrorDisplay({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-transparent z-10 flex-col gap-3">
      <div className="text-red-500 text-4xl">⚠️</div>
      <p className="text-gray-700 font-semibold text-sm">
        Failed to load 3D model
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-[#A82B00] text-white rounded-lg text-sm hover:bg-[#8a2400] transition-colors transition-all duration-400 ease-in-out hover:brightness-150 active:brightness-150 active:-translate-y-[5px]"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

class ModelErrorBoundary extends Component<
  { children: ReactNode; onRetry?: () => void; autoRetry?: boolean },
  { hasError: boolean; error?: Error }
> {
  private retryTimeout: NodeJS.Timeout | null = null;

  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("❌ InlineModelViewer Error:", error, errorInfo);

    // Auto-retry if enabled
    if (this.props.autoRetry) {
      if (this.retryTimeout) {
        clearTimeout(this.retryTimeout);
      }
      this.retryTimeout = setTimeout(() => {
        this.setState({ hasError: false, error: undefined });
        this.props.onRetry?.();
      }, 1500);
    }
  }

  componentWillUnmount() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
  }

  render() {
    if (this.state.hasError) {
      // If auto-retry is enabled, don't show error, just retry
      if (this.props.autoRetry) {
        return (
          <div className="absolute inset-0 flex items-center justify-center bg-transparent z-10 flex-col gap-3">
            <div className="w-8 h-8 border-2 border-[#A82B00] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 text-xs">Retrying...</p>
          </div>
        );
      }
      return (
        <ErrorDisplay
          onRetry={() => {
            this.setState({ hasError: false, error: undefined });
            this.props.onRetry?.();
          }}
        />
      );
    }
    return this.props.children;
  }
}

interface ModelProps {
  modelPath: string;
  onError?: (error: Error) => void;
  onSuccess?: () => void;
  audioEnabled?: boolean;
}

function Model({ modelPath, onError, onSuccess, audioEnabled = false }: ModelProps) {
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [scene, setScene] = useState<THREE.Group | null>(null);
  const [animations, setAnimations] = useState<THREE.AnimationClip[]>([]);
  const loaderRef = useRef<GLTFLoader | null>(null);
  const hasNotifiedSuccess = useRef(false);
  const hasNotifiedError = useRef(false);
  const sceneLoadedRef = useRef(false);
  const currentSceneRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    console.log("🔄 Model useEffect triggered for:", modelPath);

    // Reset flags when modelPath changes (retry)
    hasNotifiedSuccess.current = false;
    hasNotifiedError.current = false;
    sceneLoadedRef.current = false;
    setScene(null);
    setAnimations([]);
    currentSceneRef.current = null;

    let isMounted = true;
    let loaderInstance: GLTFLoader | null = null;
    let loadTimeout: NodeJS.Timeout | null = null;

    // Validate modelPath first
    if (!modelPath || modelPath.trim() === "") {
      const error = new Error(`Invalid model path: ${modelPath}`);
      console.error("❌", error.message);
      if (!hasNotifiedError.current) {
        hasNotifiedError.current = true;
        onError?.(error);
      }
      return;
    }

    try {
      loaderInstance = new GLTFLoader();
      loaderRef.current = loaderInstance;

      // Attach DRACOLoader (safe even if the model isn't compressed)
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath(
        "https://www.gstatic.com/draco/versioned/decoders/1.5.6/"
      );
      loaderInstance.setDRACOLoader(dracoLoader);

      console.log("📦 Starting to load model:", modelPath);

      // Set a timeout to detect if loading takes too long or fails silently
      loadTimeout = setTimeout(() => {
        if (isMounted && !sceneLoadedRef.current && !hasNotifiedError.current) {
          console.error("❌ Model load timeout after 15 seconds");
          hasNotifiedError.current = true;
          onError?.(new Error(`Model load timeout: ${modelPath}`));
        }
      }, 15000); // 15 second timeout

      loaderInstance.load(
        modelPath,
        (gltf) => {
          if (loadTimeout) clearTimeout(loadTimeout);
          if (!isMounted) {
            console.log("⚠️ Component unmounted, ignoring load result");
            return;
          }
          try {
            if (!hasNotifiedSuccess.current && gltf && gltf.scene) {
              console.log("✅ Model loaded successfully, processing...");
              sceneLoadedRef.current = true;
              currentSceneRef.current = gltf.scene;
              setScene(gltf.scene);
              setAnimations(gltf.animations || []);
              hasNotifiedSuccess.current = true;
              onSuccess?.(); // Notify success
            }
          } catch (err) {
            if (loadTimeout) clearTimeout(loadTimeout);
            const error =
              err instanceof Error
                ? err
                : new Error("Failed to process loaded model");
            console.error("❌ Error processing model:", error);
            if (!hasNotifiedError.current) {
              hasNotifiedError.current = true;
              onError?.(error);
            }
          }
        },
        (progress) => {
          // Progress callback - can be used for loading indicator
          if (progress.total > 0) {
            const percent = (progress.loaded / progress.total) * 100;
            console.log(`📊 Loading progress: ${percent.toFixed(1)}%`);
          }
        },
        (err) => {
          if (loadTimeout) clearTimeout(loadTimeout);
          console.error("❌ GLTFLoader failed:", err);
          const error =
            err instanceof Error
              ? err
              : new Error(`Failed to load model: ${modelPath}`);
          if (isMounted && !hasNotifiedError.current) {
            hasNotifiedError.current = true;
            onError?.(error);
          }
        }
      );
    } catch (err) {
      if (loadTimeout) clearTimeout(loadTimeout);
      const error =
        err instanceof Error
          ? err
          : new Error(`Failed to initialize loader for: ${modelPath}`);
      console.error("❌ Loader initialization failed:", error);
      if (!hasNotifiedError.current) {
        hasNotifiedError.current = true;
        onError?.(error);
      }
    }

    return () => {
      isMounted = false;
      if (loadTimeout) {
        clearTimeout(loadTimeout);
      }
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
        mixerRef.current = null;
      }
      const sceneToDispose = currentSceneRef.current;
      if (sceneToDispose) {
        sceneToDispose.traverse((child: any) => {
          if (child.isMesh) {
            child.geometry?.dispose();
            if (Array.isArray(child.material)) {
              child.material.forEach((m: THREE.Material) => m.dispose());
            } else {
              child.material?.dispose();
            }
          }
        });
        currentSceneRef.current = null;
      }
    };
  }, [modelPath, onError, onSuccess]);

  // Center the model
  useEffect(() => {
    if (scene) {
      try {
        const box = new THREE.Box3().setFromObject(scene);
        const center = box.getCenter(new THREE.Vector3());

        // Center the model without scaling
        scene.position.sub(center);
      } catch (err) {
        console.error("Error centering model:", err);
      }
    }
  }, [scene]);

  // Set up animation mixer - always play all animation clips
  useEffect(() => {
    if (animations && animations.length > 0 && scene) {
      try {
        mixerRef.current = new THREE.AnimationMixer(scene);

        // Play all animation clips
        animations.forEach((clip) => {
          const action = mixerRef.current!.clipAction(clip);
          action.play();
        });
      } catch (err) {
        console.error("Error setting up animation:", err);
      }
    }

    return () => {
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
        mixerRef.current = null;
      }
    };
  }, [animations, scene, audioEnabled]);

  // useEffect(() => {
  //   if (animations && animations.length > 0 && scene) {
  //     try {
  //       mixerRef.current = new THREE.AnimationMixer(scene);


  //       if (audioEnabled) {
  //         // Play all animation clips when audio is enabled
  //         animations.forEach((clip) => {
  //           const action = mixerRef.current!.clipAction(clip);
  //           action.play();
  //         });
  //       } else {
  //         // Play only "rigAction.001" by default
  //         const targetClip = animations.find(
  //           (clip) => clip.name === "rigAction.001"
  //         );
  //         if (targetClip) {
  //           const action = mixerRef.current.clipAction(targetClip);
  //           action.play();
  //         }
  //       }
  //     } catch (err) {
  //       console.error("Error setting up animation:", err);
  //     }
  //   }


  //   return () => {
  //     if (mixerRef.current) {
  //       mixerRef.current.stopAllAction();
  //       mixerRef.current = null;
  //     }
  //   };
  // }, [animations, scene, audioEnabled]);

  // Update animation mixer on each frame
  useFrame((state, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }
  });

  if (!scene) return null;

  return <primitive ref={groupRef} object={scene} />;
}

interface InlineModelViewerProps {
  modelPath: string;
  className?: string;
  width?: string;
  height?: string;
  audioEnabled?: boolean;
}

export default function InlineModelViewer({
  modelPath,
  className = "",
  width = "400px",
  height = "400px",
  audioEnabled = false,
}: InlineModelViewerProps) {
  const actualHeight = height === "auto" ? width : height;
  const [retryKey, setRetryKey] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const errorCountRef = useRef(0);
  const lastErrorTimeRef = useRef<number>(0);

  const handleRetry = () => {
    console.log("🔄 Retrying model load, attempt:", errorCountRef.current + 1);
    setHasError(false);
    setIsRetrying(true);
    setIsLoading(true);
    setRetryKey((prev) => prev + 1);
  };

  const handleError = (error: Error) => {
    const now = Date.now();
    // Prevent duplicate error calls within 100ms
    if (now - lastErrorTimeRef.current < 100) {
      return;
    }
    lastErrorTimeRef.current = now;

    errorCountRef.current += 1;
    console.error(
      `❌ Model loading error (attempt ${errorCountRef.current}):`,
      error
    );

    setHasError(true);
    setIsRetrying(true);
    setIsLoading(true);

    // Clear any existing timeout
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }

    // Retry after a delay (exponential backoff: 1s, 2s, 3s, max 5s)
    const delay = Math.min(1000 + (errorCountRef.current - 1) * 1000, 5000);
    console.log(`⏳ Will retry in ${delay}ms...`);
    retryTimeoutRef.current = setTimeout(() => {
      handleRetry();
    }, delay);
  };

  const handleSuccess = () => {
    console.log("✅ Model loaded successfully!");
    errorCountRef.current = 0;
    setHasError(false);
    setIsRetrying(false);
    setIsLoading(false);
    setModelLoaded(true);
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
  };

  // Reset error count when modelPath changes
  useEffect(() => {
    console.log("🔄 Model path changed, resetting:", modelPath);
    errorCountRef.current = 0;
    setIsLoading(true);
    setHasError(false);
    setIsRetrying(false);
    setModelLoaded(false);
  }, [modelPath]);

  // Monitor for stuck loading state - if loading for too long without success/error, trigger retry
  useEffect(() => {
    if (isLoading && !hasError) {
      const stuckTimeout = setTimeout(() => {
        if (isLoading && !hasError) {
          console.warn("⚠️ Model loading seems stuck, triggering retry");
          handleError(new Error("Model loading timeout - no response"));
        }
      }, 15000); // 15 seconds

      return () => clearTimeout(stuckTimeout);
    }
  }, [isLoading, hasError]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className={`relative ${className}`}
      style={{
        width,
        height: actualHeight,
        display: "block",
        margin: 0,
        padding: 0,
        overflow: "hidden",
        lineHeight: 0,
        fontSize: 0,
      }}
    >
      {(isRetrying || isLoading) && !modelLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-transparent z-10 flex-col gap-3">
          <div className="w-8 h-8 border-2 border-[#A82B00] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 text-xs">
            {isRetrying ? "Loading model..." : "Loading model..."}
          </p>
        </div>
      )}
      <ModelErrorBoundary
        key={modelLoaded ? "loaded" : "loading"}
        onRetry={handleRetry}
        autoRetry={true}
      >
        <Suspense fallback={null}>
          <div
            style={{
              width: "100%",
              height: "100%",
              margin: 0,
              padding: 0,
              display: "block",
              lineHeight: 0,
            }}
          >
            <Canvas
              key={retryKey}
              camera={{ position: [0, 0, 3], fov: 75 }} 
              gl={{ powerPreference: "high-performance", alpha: true }}
              dpr={0.9}
              style={{
                width: "100%",
                height: "100%",
                display: "block",
                margin: 0,
                padding: 0,
                verticalAlign: "top",
                backgroundColor: "transparent",
                pointerEvents: 'none'
              }}
            >
              {/* <color attach="background" args={["transparent"]} /> */}
              <ambientLight intensity={0.6} />
              <directionalLight position={[5, 5, 5]} intensity={0.5} />
              <Model
                key={`${retryKey}-${modelPath}`}
                modelPath={modelPath}
                onError={handleError}
                onSuccess={handleSuccess}
                audioEnabled={audioEnabled}
              />
              <Environment preset="apartment" />
              <OrbitControls
                // autoRotate
                autoRotateSpeed={1.0}
                // enableZoom={true}
                enableZoom={false}
                enableRotate={true}
                minDistance={2.4}
                maxDistance={2.4}
                minPolarAngle={Math.PI / 2}
                maxPolarAngle={Math.PI / 2}
              />
            </Canvas>
          </div>
        </Suspense>
      </ModelErrorBoundary>
    </div>
  );
}
