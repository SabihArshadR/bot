import { useEffect, useState, useRef } from "react";
import mapboxgl, { Map, Marker } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { haversineDistance } from "@/utils/utils";
import { useRouter } from "next/navigation";
import CustomButton from "../ui/Button";
import { TbFocusCentered } from "react-icons/tb";
import { useTranslations } from "next-intl";

interface Coordinates {
  lat: number;
  lng: number;
}

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

interface CoinMapProps {
  destination?: Coordinates | null;
}

const drawRoute = async (map: Map, start: Coordinates, end: Coordinates) => {
  try {
    const query = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/walking/${start.lng},${start.lat};${end.lng},${end.lat}?geometries=geojson&overview=full&access_token=${mapboxgl.accessToken}`
    );
    const data = await query.json();
    const route = data.routes[0].geometry;

    const geojson: GeoJSON.FeatureCollection<GeoJSON.LineString> = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: route,
          properties: {},
        },
      ],
    };

    const source = map.getSource("route") as mapboxgl.GeoJSONSource | undefined;

    if (source) {
      source.setData(geojson);
    } else {
      map.addSource("route", { type: "geojson", data: geojson });
      map.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#1052ff",
          "line-width": 6,
          "line-blur": 2,
          "line-opacity": 0.9,
        },
      });
    }
  } catch (err) {
    console.error("Route error:", err);
  }
};

export default function CoinMap({ destination }: CoinMapProps) {
  const router = useRouter();
  const t = useTranslations("CoinMap");
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<Map | null>(null);
  const userMarker = useRef<Marker | null>(null);
  const destinationMarker = useRef<Marker | null>(null);
  const [showEnterAR, setShowEnterAR] = useState(false);

  // Inject styles only once
  useEffect(() => {
    if (document.getElementById("user-beam-styles")) return;

    const style = document.createElement("style");
    style.id = "user-beam-styles";
    style.innerHTML = `
      .user-location-marker {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background-color: #4285F4;
        border: 3px solid white;
        box-shadow: 0 0 6px rgba(0,0,0,0.4);
        position: relative;
      }

      .user-beam {
        position: absolute;
        top: -45px;                    /* above the dot */
        left: 50%;
        width: 0;
        height: 0;
        border-left: 18px solid transparent;
        border-right: 18px solid transparent;
        border-bottom: 50px solid rgba(66, 133, 244, 0.45);
        transform-origin: 50% 100%;    /* rotate from bottom center */
        transform: translate(-50%, 0%) rotate(0deg);
        z-index: -1;
        pointer-events: none;
      }

      .user-location-marker::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: rgba(66, 133, 244, 0.35);
        animation: pulse 2.2s infinite ease-out;
        z-index: -2;
      }

      @keyframes pulse {
        0%   { transform: translate(-50%, -50%) scale(1);   opacity: 0.7; }
        100% { transform: translate(-50%, -50%) scale(3.2); opacity: 0;   }
      }
    `;
    document.head.appendChild(style);
  }, []);

  // Map initialization
  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [0, 0],
      zoom: 18,
      pitch: 60,
      bearing: 0,
      antialias: true,
      attributionControl: false,
    });

    map.current.on("style.load", () => {
      map.current?.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512,
        maxzoom: 14,
      });
      map.current?.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });

      map.current?.setFog({
        range: [0.5, 10],
        color: "white",
        "horizon-blend": 0.1,
      });
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-left");

    return () => {
      map.current?.remove();
    };
  }, []);

  // Destination marker
  useEffect(() => {
    if (!map.current || !destination) return;

    if (destinationMarker.current) {
      destinationMarker.current.remove();
    }

    const volcanoEl = document.createElement("div");
    volcanoEl.className = "destination-marker";
    volcanoEl.innerHTML = '<img src="/intro.gif" alt="Treasure" />';

    volcanoEl.style.cssText = `
      width: 100px;
      height: 100px;
      cursor: pointer;
    `;

    volcanoEl.querySelector("img")!.style.cssText = `
      height: 100%;
      max-width: 200px;
      filter: brightness(1.5) drop-shadow(0 0 10px white);
      object-fit: contain;
    `;

    destinationMarker.current = new mapboxgl.Marker({
      element: volcanoEl,
      anchor: "bottom",
    })
      .setLngLat([destination.lng, destination.lat])
      .addTo(map.current);

    return () => {
      destinationMarker.current?.remove();
    };
  }, [destination]);

  // User location + route
  useEffect(() => {
    if (!map.current) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const newLoc = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setUserLocation(newLoc);

        if (!userMarker.current) {
          const userEl = document.createElement("div");
          userEl.className = "user-location-marker";

          const beam = document.createElement("div");
          beam.className = "user-beam";
          userEl.appendChild(beam);

          userMarker.current = new mapboxgl.Marker({
            element: userEl,
            anchor: "center",
          })
            .setLngLat([newLoc.lng, newLoc.lat])
            .addTo(map.current!);

          map.current!.flyTo({
            center: [newLoc.lng, newLoc.lat],
            zoom: 18,
            pitch: 65,
            duration: 4000,
            essential: true,
          });
        } else {
          userMarker.current.setLngLat([newLoc.lng, newLoc.lat]);
        }

        if (destination && map.current) {
          drawRoute(map.current, newLoc, destination);
        }
      },
      (err) => console.error("Geolocation error:", err),
      { enableHighAccuracy: true, maximumAge: 8000, timeout: 6000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [destination]);

  // Show AR button when close
  useEffect(() => {
    if (userLocation && destination) {
      const dist = haversineDistance(userLocation, destination);
      setShowEnterAR(dist <= 0.005); // ~5 meters
    }
  }, [userLocation, destination]);

  // Device orientation → beam rotation
  useEffect(() => {
    let beamEl: HTMLElement | null = null;

    const updateBeam = () => {
      beamEl = document.querySelector(".user-beam") as HTMLElement;
    };

    // Initial lookup + retry in case marker mounts late
    updateBeam();
    const interval = setInterval(updateBeam, 800);

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (!beamEl) return;

      // iOS gives webkitCompassHeading (0 = North, clockwise)
      // Android usually gives alpha (0 = North when absolute)
      const heading =
        (event as any).webkitCompassHeading ?? event.alpha ?? null;

      if (heading != null && !isNaN(heading)) {
        // Most common: rotate clockwise as heading increases
        // If beam points the wrong way → try 360 - heading
        beamEl.style.transform = `translate(-50%, 0%) rotate(${heading}deg)`;
        // console.log("Heading applied:", heading.toFixed(0));
      }
    };

    const requestOrientationAccess = async () => {
      if (typeof (DeviceOrientationEvent as any).requestPermission === "function") {
        // iOS 13+
        try {
          const permission = await (DeviceOrientationEvent as any).requestPermission();
          console.log("DeviceOrientation permission:", permission);
          if (permission === "granted") {
            window.addEventListener("deviceorientation", handleOrientation);
          } else {
            console.warn("Orientation access denied by user");
          }
        } catch (err) {
          console.error("Permission request error:", err);
        }
      } else {
        // Android / others
        window.addEventListener("deviceorientation", handleOrientation);
      }
    };

    requestOrientationAccess();

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="relative min-h-[70vh] w-full">
      <div ref={mapContainer} className="w-full h-[770px] relative" />

      {destination && userLocation && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm text-black px-4 py-2 rounded-full shadow-lg z-50 text-sm font-semibold flex items-center gap-2 border border-gray-200">
          <span className="text-blue-600 font-bold">
            {haversineDistance(userLocation, destination).toFixed(2)} km
          </span>
        </div>
      )}

      <CustomButton
        onClick={() => {
          if (map.current && userLocation) {
            map.current.flyTo({
              center: [userLocation.lng, userLocation.lat],
              zoom: 18,
              pitch: 65,
              duration: 1500,
            });
          }
        }}
        className="absolute bottom-12 right-5 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-xl z-50 w-14 h-14 flex items-center justify-center"
      >
        <TbFocusCentered size={28} />
      </CustomButton>

      {showEnterAR && (
        <div className="fixed inset-0 p-5 flex items-center justify-center bg-black/70 z-50">
          <div className="w-full max-w-md bg-[#F9F7F2] rounded-3xl shadow-2xl p-6 border border-gray-100">
            <div className="text-center space-y-5">
              <h2 className="text-3xl font-bold text-primary">
                {t("congratulation")}
              </h2>
              <p className="text-gray-700 text-lg">{t("text")}</p>

              <CustomButton
                onClick={() =>
                  router.push(
                    `/poiIntro?lat=${destination?.lat}&lng=${destination?.lng}`
                  )
                }
                className="w-full text-lg py-4 rounded-2xl"
              >
                {t("button")}
              </CustomButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}