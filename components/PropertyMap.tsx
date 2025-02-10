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
    const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);
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
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
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

    // Updated method to add markers, adjust bounds, and add event listeners
    const updateMapWithProperties = () => {
        if (map && properties.length > 0) {
            const bounds = new google.maps.LatLngBounds();
            properties.forEach(property => {
                const position = new google.maps.LatLng(property.latitude, property.longitude);
                const marker = new google.maps.Marker({
                    position,
                    map,
                });

                // Add click event to zoom into the property
                marker.addListener('click', () => {
                    map.setZoom(15);
                    map.setCenter(marker.getPosition() as google.maps.LatLng);
                });

                // Add mouseover and mouseout events to show/hide info window
                marker.addListener('click', () => {
                    console.log('Mouseover event triggered');
                    // Close the existing info window if it exists
                    if (infoWindow) {
                        infoWindow.close();
                    }
                    const newInfoWindow = new google.maps.InfoWindow({
                        content: `
                            <div style="width: 200px; height: 200px; display: flex; flex-direction: column; justify-content: space-between; text-align: center; border-radius: 8px; overflow: hidden;">
                                <img src="${property.imgSrc}" alt="${property.address}" style="width: 100%; object-fit: cover;" />
                                <div style="padding: 2px; background-color: white;">
                                    ${property.address}<br>
                                    <a href="https://zillow.com${property.detailUrl}" style="margin-top: 10px; width: 100%; padding: 5px 5px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">
                                        View Details
                                    </a>
                                </div>
                            </div>
                        `,
                    });
                    setInfoWindow(newInfoWindow);
                    newInfoWindow.open(map, marker);

                    // marker.addListener('mouseout', () => {
                    //     newInfoWindow.close();
                    // });
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
            <div ref={mapRef} className="w-full border-t-2 rounded-xl border-green-500 h-full" />
        </div>
    );
}

export default PropertyMap;
