"use client";

import React, { useEffect } from "react";
import { useUser } from "@/context/UserContext";
import Loading from "@/components/layout/Loading";
import { useLocale } from "next-intl";
import ARView from "@/components/layout/ARView";
import { useRouter, useSearchParams } from "next/navigation";

const Page = () => {
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();

  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const poiId = searchParams.get("poiId");

  if (!user && !locale) return <Loading />;
  const audioFile = poiId || (user?.POIsCompleted + 1).toString();

  return (
        // <div style={{ width: "100%", height: "100vh", position: "relative" }}>
        //   <ARView setShowARView={() => { console.log("enter"); }} handleClose={() => { router.push(`/ar?lat=${lat}&lng=${lng}`); }} audioUrl={`/audios/${["en", "fr", "es", "ca"].includes(locale) ? locale : "en"}/${user?.POIsCompleted + 1}.mp3`} linkLoad={true} from="POI" />
        // </div>
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <ARView setShowARView={() => { console.log("enter"); }} handleClose={() => { const destination = poiId ? `/ar?lat=${lat}&lng=${lng}&poiId=${poiId}` : `/ar?lat=${lat}&lng=${lng}`; router.push(destination); }} audioUrl={ `/audios/${["en", "fr", "es", "ca"].includes(locale) ? locale : "en"}/${audioFile}.mp3`} linkLoad={true}from={Number(audioFile)} />
    </div>
  );
};

export default Page;