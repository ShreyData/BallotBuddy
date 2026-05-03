"use client";

import React, { useEffect, useRef, useState } from "react";
import { Loader as MapsLoader } from "@googlemaps/js-api-loader";

const BoothLocator: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;

    const initMap = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

        if (!apiKey) {
          setError("Google Maps API Key is missing.");
          setLoading(false);
          return;
        }

        const loader = new MapsLoader({
          apiKey: apiKey,
          version: "weekly",
          libraries: ["places"],
        });

        const google = await loader.load();
        
        if (!google || !google.maps || !mapRef.current) {
          throw new Error("Initialization failed: Google Maps or Map Container missing");
        }

        const createMarker = (map: google.maps.Map, place: google.maps.places.PlaceResult) => {
          if (!place.geometry?.location || !google.maps.Marker) return;
          const marker = new google.maps.Marker({
            map,
            position: place.geometry.location,
            title: place.name,
          });
          const infowindow = new google.maps.InfoWindow({
            content: `<div><strong>${place.name}</strong><br>${place.vicinity || ""}</div>`,
          });
          marker.addListener("click", () => infowindow.open(map, marker));
        };

        const searchNearby = (map: google.maps.Map, location: google.maps.LatLngLiteral) => {
          if (!google.maps.places?.PlacesService) return;
          const service = new google.maps.places.PlacesService(map);
          service.nearbySearch(
            { location, radius: 5000, keyword: "polling station election" },
            (results: google.maps.places.PlaceResult[] | null, status: google.maps.places.PlacesServiceStatus) => {
              if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                results.forEach((place) => createMarker(map, place));
              }
            }
          );
        };

        const center = { lat: 20.5937, lng: 78.9629 };
        const newMap = new google.maps.Map(mapRef.current, {
          center,
          zoom: 5,
          mapId: "DEMO_MAP_ID",
        });

        setLoading(false);

        if (navigator?.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const pos = { lat: position.coords.latitude, lng: position.coords.longitude };
              newMap.setCenter(pos);
              newMap.setZoom(14);
              new google.maps.Marker({
                position: pos,
                map: newMap,
                title: "Your Location",
                icon: {
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: 10,
                  fillColor: "#4285F4",
                  fillOpacity: 1,
                  strokeWeight: 2,
                  strokeColor: "white",
                },
              });
              searchNearby(newMap, pos);
            },
            () => searchNearby(newMap, center)
          );
        } else {
          searchNearby(newMap, center);
        }
      } catch (err: unknown) {
        console.error("Map Load Error:", err);
        setError("Failed to initialize map safely.");
        setLoading(false);
      }
    };

    initMap();
  }, [mounted]);

  if (!mounted) return <div className="h-[500px]" />;

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Nearby Polling Booths</h2>
        <p className="text-sm text-gray-500">Showing booths within 5km of your location</p>
      </div>
      
      <div className="relative w-full h-[500px] rounded-2xl border shadow-sm overflow-hidden bg-gray-100">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-50/80">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-red-50 text-red-700 p-4 text-center">
            {error}
          </div>
        )}
        <div ref={mapRef} className="w-full h-full" />
      </div>
    </div>
  );
};

export default BoothLocator;
