"use client"
import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
function PropertyMap({ properties }: { properties: any[] }) {
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | null>(null);
    const [currentBounds, setCurrentBounds] = useState<google.maps.LatLngBounds | null>(null);
    // const [marker, setMarker] = useState<google.maps.Marker | null>(null);
    // const [circle, setCircle] = useState<google.maps.Circle | null>(null);
    // const [selectedLocation, setSelectedLocation] = useState<google.maps.LatLng | null>(null);
    const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);
    const mapRef = useRef<HTMLDivElement>(null);

    // Function to format the price
    const formatPrice = (price: number) => {
        if (price >= 1000000) {
            return (price / 1000000).toFixed(1) + 'M';
        } else if (price >= 1000) {
            return (price / 1000).toFixed(1) + 'K';
        }
        return price.toString();
    };

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
            const infoWindow = new google.maps.InfoWindow();
            properties.forEach(property => {
                const position = new google.maps.LatLng(property.latitude, property.longitude);
                const price = formatPrice(property?.units && property?.units.length > 0
                    ? property?.units[0]?.price
                    : property.price || 0);

                // Create a custom SVG marker with a pin shape
                const svgMarker = `
                   <svg width="100" height="60" viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg">
                    <!-- Rounded bubble -->
                    <rect x="10" y="0" rx="20" ry="20" width="80" height="40" fill="#6A35D5"/>
                    <!-- Pointer triangle (rotated 180 degrees) -->
                    <polygon points="50,55 40,40 60,40" fill="#6A35D5"/>
                    <!-- Text inside the bubble -->
                    <text x="50" y="27" font-size="18" fill="white" font-family="Arial" font-weight="bold" text-anchor="middle">${price}</text>
                    </svg>
                `;

                const marker = new google.maps.Marker({
                    position,
                    map,
                    icon: {
                        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svgMarker),
                        scaledSize: new google.maps.Size(50, 50),
                    },
                });

                // Add click event to zoom into the property
                marker.addListener('click', () => {
                    map.setZoom(15);
                    map.setCenter(marker.getPosition() as google.maps.LatLng);
                });

                // Add mouseover and mouseout events to show/hide info window
                marker.addListener('click', (e: google.maps.PolyMouseEvent) => {
                    // Reset styling of previously clicked polygon if any


                    const content = `
                    <div class="max-w-sm bg-white rounded-lg shadow-sm">              
                      <img src="${property?.imgSrc}" alt="Property Image" style="width: 100%; height: 100px; object-fit: cover; border-radius: 10px; margin-bottom: 3px;">
                                <div style="display: flex; justify-content: space-between;">
                                    <div>
                                        <h2 style="font-size: 1.125rem; font-weight: bold; margin-bottom:2px">$${price}</h2>
                                        <p style="font-size: 0.875rem; color: #4b5563; margin-bottom:2px">
                                            ${property?.bedrooms} bds | ${property?.bathrooms} ba
                                        </p>
                                    </div>
                                    <div style="background-color: #6A35D5; text-align: center; color: white; border: none; height: 25px; padding: 2px 8px; border-radius: 4px; cursor: pointer;">
                                        <a href="https://zillow.com${property?.detailUrl}" target="_blank" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; text-decoration: none; color: white;">View Details</a>
                                    </div>
                                </div>
                                <p style="font-size: 0.875rem; color: #6b7280;">${property?.address || '5212 S Kildare Ave, Chicago, IL 60632'}</p>
                                </div>
                    </div>
                  `;
            
                    infoWindow.setContent(content);
                    infoWindow.setPosition(e.latLng);
                    infoWindow.open(map);
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
            <div className="min-h-[200px] w-full h-full relative">
                {/* Initialize the map centered on the USA */}
                <h1 className="text-sm font-semibold mb-1 absolute top-2 left-1 z-10 bg-white p-1 rounded-md">Property Map</h1>
                <div ref={mapRef} className="w-full border-t-2 rounded-xl border-green-500 h-full" />
            </div>
        );
    }

    export default PropertyMap;
