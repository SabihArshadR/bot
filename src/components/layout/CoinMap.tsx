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

mapboxgl.accessToken = 
process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

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

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      // Use Satellite-Streets for an immersive "real world" feel
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [0, 0],
      zoom: 18, // Start closer for immersion
      pitch: 60, // Tilt the camera
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

  useEffect(() => {
    if (!map.current || !destination) return;

    if (destinationMarker.current) {
      destinationMarker.current.remove();
    }

    // Create a more stable marker element
    const volcanoEl = document.createElement("div");
    volcanoEl.className = "destination-marker";
    volcanoEl.innerHTML = '<img src="/intro.gif" alt="Treasure" />';

    // Add CSS styles for better positioning
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
      if (destinationMarker.current) {
        destinationMarker.current.remove();
      }
    };
  }, [destination]);

  useEffect(() => {
  if (!map.current) return;

  const geolocate = new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true,
    },
    trackUserLocation: true, // keeps map centered on user
    showUserHeading: true,   // shows cone / shadow for orientation
  });

  map.current.addControl(geolocate, "top-left");

  // Automatically trigger the geolocation when map loads
  geolocate.on('geolocate', (event) => {
    const newLoc = {
      lat: event.coords.latitude,
      lng: event.coords.longitude,
    };
    setUserLocation(newLoc);

    if (destination && map.current) {
      drawRoute(map.current, newLoc, destination);
    }
  });

  // Optional: trigger once when map loads
  geolocate.trigger();

}, [destination]);


  useEffect(() => {
    if (userLocation && destination) {
      const dist = haversineDistance(userLocation, destination);
      setShowEnterAR(dist <= 0.005);

      // Disabled distance check for testing - always show AR button
      // setShowEnterAR(true);
    }
  }, [userLocation, destination]);

  useEffect(() => {
    const beamEl = document.querySelector(".user-beam") as HTMLElement;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      // webkitCompassHeading is for iOS, alpha is for Android
      const heading = (event as any).webkitCompassHeading || event.alpha;

      if (heading && beamEl) {
        // We subtract the heading because the beam needs to rotate
        // relative to the "North" of the map
        beamEl.style.transform = `translate(-50%, -100%) rotate(${heading}deg)`;
      }
    };

    // Request permission for iOS 13+
    if (
      typeof (DeviceOrientationEvent as any).requestPermission === "function"
    ) {
      (DeviceOrientationEvent as any)
        .requestPermission()
        .then((permissionState: string) => {
          if (permissionState === "granted") {
            window.addEventListener("deviceorientation", handleOrientation);
          }
        });
    } else {
      window.addEventListener("deviceorientation", handleOrientation);
    }

    return () =>
      window.removeEventListener("deviceorientation", handleOrientation);
  }, []);

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

      {/* <CustomButton
        onClick={() => {
          if (map.current && userLocation) {
            map.current.flyTo({
              center: [userLocation.lng, userLocation.lat],
              zoom: 18,
            });
          }
        }}
        className="absolute bottom-10 right-4 text-white px-[11px] py-3 rounded-lg shadow-lg z-50 !w-[46px]"
      >
        <TbFocusCentered size={25} />
      </CustomButton> */}
      {showEnterAR && (
        <div className="fixed inset-0 p-4 flex flex-col items-center justify-center bg-black/70 z-50">
          <div className="relative w-[95%] mx-auto max-w-md bg-[#F5F3ED] rounded-2xl shadow-2xl p-3">
            <div className="space-y-4 flex flex-col">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-primary mb-2">
                  {t("congratulation")}
                </h2>
                <p className="text-gray-700 mb-4">{t("text")}</p>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <CustomButton
                  onClick={() =>
                    router.push(
                      `/poiIntro?lat=${destination?.lat}&lng=${destination?.lng}`,
                    )
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