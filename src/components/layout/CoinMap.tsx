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
  const beamElement = useRef<HTMLElement | null>(null);
  const [showEnterAR, setShowEnterAR] = useState(false);

  // Initialize map
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
      // Add 3D Terrain
      map.current?.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512,
        maxzoom: 14,
      });
      map.current?.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });

      // Add Realistic Sky/Atmosphere
      map.current?.setFog({
        range: [0.5, 10],
        color: "white",
        "horizon-blend": 0.1,
      });
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-left");
  }, []);

  // Destination marker
  useEffect(() => {
  if (!map.current || !destination) return;

  if (destinationMarker.current) {
    destinationMarker.current.remove();
  }

  const destEl = document.createElement("div");
  destEl.className = "destination-marker";
  destEl.innerHTML = '<img src="/intro.gif" alt="Treasure" />';
  destEl.style.cssText = `
    width: 100px;
    height: 100px;
    cursor: pointer;
  `;
  destEl.querySelector("img")!.style.cssText = `
    width: 100%;
    height: 100%;
  `;

  // Store the marker in the ref
  destinationMarker.current = new mapboxgl.Marker({
    element: destEl,
    offset: [0, -50] // Adjust offset as needed
  })
    .setLngLat([destination.lng, destination.lat])
    .addTo(map.current);

  // Cleanup function - should not return anything
  return () => {
    if (destinationMarker.current) {
      destinationMarker.current.remove();
    }
  };
}, [destination]); // Make sure to include all dependencies

  // User location marker + beam
  useEffect(() => {
    if (!map.current) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const newLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(newLoc);

        if (!userMarker.current) {
          // Create marker element
          const userEl = document.createElement("div");
          userEl.className = "user-location-marker";

          // Beam element
          const beam = document.createElement("div");
          beam.className = "user-beam";
          userEl.appendChild(beam);
          beamElement.current = beam;

          // Inject CSS for blue dot + beam + pulse
          const style = document.createElement("style");
          style.innerHTML = `
            .user-location-marker {
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background-color: #4285F4;
              border: 3px solid white;
              box-shadow: 0 0 5px rgba(0,0,0,0.3);
              position: relative;
            }
            .user-beam {
              position: absolute;
              top: 120%;
              left: 50%;
              width: 0;
              height: 0;
              border-left: 20px solid transparent;
              border-right: 20px solid transparent;
              border-bottom: 40px solid rgba(66, 133, 244, 0.4);
              transform-origin: 50% 100%;
              transform: translate(-50%, -100%) rotate(0deg);
              z-index: -1;
              pointer-events: none;
              transition: transform 0.3s ease-out;
            }
            .user-location-marker::after {
              content: "";
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background-color: rgba(66, 133, 244, 0.4);
              animation: pulse 2s infinite;
              z-index: -1;
            }
            @keyframes pulse {
              0% { width: 20px; height: 20px; opacity: 1; }
              100% { width: 70px; height: 70px; opacity: 0; }
            }
          `;
          document.head.appendChild(style);

          // Create Mapbox marker
          userMarker.current = new mapboxgl.Marker({ element: userEl, anchor: "center" })
            .setLngLat([newLoc.lng, newLoc.lat])
            .addTo(map.current!);

          map.current!.flyTo({ center: [newLoc.lng, newLoc.lat], zoom: 18, pitch: 65, duration: 5000, essential: true });
        } else {
          userMarker.current.setLngLat([newLoc.lng, newLoc.lat]);
        }

        if (map.current && destination) {
          drawRoute(map.current, newLoc, destination);
        }
      },
      (err) => console.error("Location error:", err),
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [destination]);

  // Device orientation (blue cone rotation)
  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (!beamElement.current) return;

      let heading: number | null = null;

      if ((event as any).webkitCompassHeading !== undefined) {
        heading = (event as any).webkitCompassHeading;
      } else if (event.alpha !== null) {
        heading = 360 - event.alpha;
      }

      if (heading !== null) {
        const normalizedHeading = ((heading % 360) + 360) % 360;
        beamElement.current.style.transform = `translate(-50%, -100%) rotate(${normalizedHeading}deg)`;
      }
    };

    const setupOrientation = () => {
      if (typeof (DeviceOrientationEvent as any).requestPermission === "function") {
        (DeviceOrientationEvent as any).requestPermission()
          .then((permissionState: string) => {
            if (permissionState === "granted") {
              window.addEventListener("deviceorientation", handleOrientation);
            }
          })
          .catch(console.error);
      } else {
        window.addEventListener("deviceorientation", handleOrientation);
      }
    };

    const timeoutId = setTimeout(setupOrientation, 1000);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  // Distance check for AR button
  useEffect(() => {
    if (userLocation && destination) {
      const dist = haversineDistance(userLocation, destination);
      setShowEnterAR(dist <= 0.005);
    }
  }, [userLocation, destination]);

  return (
    <div className="relative min-h-[70vh] w-full">
      <div ref={mapContainer} className="w-full h-[770px] relative" />

      {destination && userLocation && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white text-backblack px-4 py-2 rounded shadow z-50 text-sm font-semibold flex items-center gap-2">
          <span className="text-blue-600">
            {haversineDistance(userLocation, destination).toFixed(2)} km
          </span>
        </div>
      )}

      <CustomButton
        onClick={() => {
          if (map.current && userLocation) {
            map.current.flyTo({ center: [userLocation.lng, userLocation.lat], zoom: 18 });
          }
        }}
        className="absolute bottom-10 right-4 text-white px-[11px] py-3 rounded-lg shadow-lg z-50 !w-[46px]"
      >
        <TbFocusCentered size={25} />
      </CustomButton>

      {showEnterAR && (
        <div className="fixed inset-0 p-4 flex flex-col items-center justify-center bg-black/70 z-50">
          <div className="relative w-[95%] mx-auto max-w-md bg-[#F5F3ED] rounded-2xl shadow-2xl p-3">
            <div className="space-y-4 flex flex-col">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-primary mb-2">{t("congratulation")}</h2>
                <p className="text-gray-700 mb-4">{t("text")}</p>
              </div>
              <div className="flex justify-center gap-3 pt-2">
                <CustomButton
                  onClick={() =>
                    router.push(`/poiIntro?lat=${destination?.lat}&lng=${destination?.lng}`)
                  }
                  className="rounded-xl"
                >
                  {t("button")}
                </CustomButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
