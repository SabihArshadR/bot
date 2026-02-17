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
    if (!data.routes[0]) return;
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
          "line-opacity": 0.8, 
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
  }, []);

  // 2. Handle Heading (Compass) and Permissions
  const startTrackingOrientation = () => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      // @ts-ignore - Handle iOS (webkitCompassHeading) and Android (alpha)
      const heading = e.webkitCompassHeading || (e.alpha ? 360 - e.alpha : 0);
      
      if (userMarker.current) {
        const el = userMarker.current.getElement();
        // Rotate the marker element itself
        el.style.transform = `rotate(${heading}deg)`;
      }
      
      // Optional: Auto-rotate the map to follow the phone's direction
      // map.current?.setBearing(heading); 
    };

    if (typeof (DeviceOrientationEvent as any).requestPermission === "function") {
      (DeviceOrientationEvent as any).requestPermission()
        .then((state: string) => {
          if (state === "granted") window.addEventListener("deviceorientation", handleOrientation);
        });
    } else {
      window.addEventListener("deviceorientation", handleOrientation);
    }
  };

  // 3. Handle User Location (GPS)
  useEffect(() => {
    if (!map.current) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const newLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(newLoc);

        if (!userMarker.current) {
          const userEl = document.createElement("div");
          // Custom Arrow Shape for the User Marker
          userEl.style.cssText = `
            width: 0; 
            height: 0; 
            border-left: 10px solid transparent;
            border-right: 10px solid transparent;
            border-bottom: 25px solid #0d52ff;
            filter: drop-shadow(0 0 5px white);
            transition: transform 0.1s linear;
          `;

          userMarker.current = new mapboxgl.Marker({
            element: userEl,
            rotationAlignment: 'map', // Crucial for compass accuracy
          })
            .setLngLat([newLoc.lng, newLoc.lat])
            .addTo(map.current!);

          map.current!.flyTo({ center: [newLoc.lng, newLoc.lat], duration: 3000 });
        } else {
          userMarker.current.setLngLat([newLoc.lng, newLoc.lat]);
        }

        if (destination) drawRoute(map.current!, newLoc, destination);
      },
      (err) => console.error(err),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [destination]);

  // 4. Handle Destination Marker
  useEffect(() => {
    if (!map.current || !destination) return;
    if (destinationMarker.current) destinationMarker.current.remove();

    const volcanoEl = document.createElement("div");
    volcanoEl.className = "destination-marker";
    volcanoEl.innerHTML = '<img src="/intro.gif" alt="Treasure" style="width:120px; height:120px; filter: brightness(1.5) drop-shadow(0 0 10px white); object-fit: contain;" />';

    destinationMarker.current = new mapboxgl.Marker({ element: volcanoEl, anchor: "bottom" })
      .setLngLat([destination.lng, destination.lat])
      .addTo(map.current);
  }, [destination]);

  useEffect(() => {
    if (userLocation && destination) {
      const dist = haversineDistance(userLocation, destination);
      setShowEnterAR(dist <= 0.005);
      
      // Disabled distance check for testing - always show AR button
      // setShowEnterAR(true);
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
          startTrackingOrientation();
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
      </CustomButton>
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
