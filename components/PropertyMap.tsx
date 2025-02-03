"use client"
import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

function PropertyMap({ properties }: { properties: any[] }) {
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | null>(null);
    const [currentBounds, setCurrentBounds] = useState<google.maps.LatLngBounds | null>(null);
    const [marker, setMarker] = useState<google.maps.Marker | null>(null);
    const [circle, setCircle] = useState<google.maps.Circle | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<google.maps.LatLng | null>(null);
    const mapRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const initMap = async () => {
            try {
                const loader = new Loader({
                    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
                    version: "weekly",
                    libraries: ["places", "geometry"]
                });

                const google = await loader.load();
                console.log('Google Maps loaded');

                const mapInstance = new google.maps.Map(mapRef.current as HTMLElement, {
                    center: { lat: 39.8283, lng: -98.5795 },
                    zoom: 4,
                    mapTypeId: google.maps.MapTypeId.HYBRID,
                    fullscreenControl: false,
                    streetViewControl: false,
                    zoomControl: true,
                    mapTypeControl: true,
                    zoomControlOptions: {
                        position: google.maps.ControlPosition.TOP_RIGHT,
                    },
                    mapTypeControlOptions: {
                        position: google.maps.ControlPosition.TOP_RIGHT,
                        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                    },
                    controlSize: 28,
                });

                setMap(mapInstance);
                const placesServiceInstance = new google.maps.places.PlacesService(mapInstance);
                setPlacesService(placesServiceInstance);
                console.log('Places service initialized');

                mapInstance.addListener('bounds_changed', () => {
                    const bounds = mapInstance.getBounds();
                    if (bounds) {
                        setCurrentBounds(bounds);
                    }
                });

            } catch (error) {
                console.error('Error initializing map:', error);
            }
        };

        initMap();
    }, []);
    
    // New method to add markers and adjust bounds
    const updateMapWithProperties = () => {
        if (map && properties.length > 0) {
            const bounds = new google.maps.LatLngBounds();
            properties.forEach(property => {
                const position = new google.maps.LatLng(property.latitude, property.longitude);
                new google.maps.Marker({
                    position,
                    map,
                });
                bounds.extend(position);
            });
            map.fitBounds(bounds);
        }
    };

    // New useEffect to handle properties update
    useEffect(() => {
        updateMapWithProperties();
    }, [map, properties]);

    return (
        <div className="w-full h-full relative">
            {/* Initialize the map centered on the USA */}
            <h1 className="text-md font-normal mb-1 absolute top-2 left-1 z-10 bg-white p-1 rounded-md">Property Map</h1>
            <div ref={mapRef} className="w-full h-full" />
        </div>
    );
}

export default PropertyMap;
