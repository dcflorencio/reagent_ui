import { Loader } from "@googlemaps/js-api-loader";

const loader = new Loader({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    version: "weekly",
    libraries: ["places", "geometry"], // Include all necessary libraries here
});

export const loadGoogleMaps = async () => {
    try {
        return await loader.load();
    } catch (error) {
        console.error('Error loading Google Maps:', error);
        throw error;
    }
};