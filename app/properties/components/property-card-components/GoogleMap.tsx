"use client";

import { useEffect, useRef } from "react";
import { loadGoogleMaps } from "@/app/utils/googleMapsLoader";

const GoogleMap = ({ property }: { property: any }) => {
    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initMap = async () => {
            try {
                const google = await loadGoogleMaps();
                const mapInstance = new google.maps.Map(mapRef.current as HTMLElement, {
                    center: { lat: property.latitude, lng: property.longitude },
                    zoom: 13,
                });

                new google.maps.Marker({
                    position: { lat: property.latitude, lng: property.longitude },
                    map: mapInstance,
                });
            } catch (error) {
                console.error('Error initializing map:', error);
            }
        };

        initMap();
    }, [property]);

    return <div ref={mapRef} className="w-full h-64 rounded-lg" />;
};

export default GoogleMap;