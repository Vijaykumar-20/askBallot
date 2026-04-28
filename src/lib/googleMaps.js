import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

let isOptionsSet = false;

export const initGoogleMaps = async () => {
  if (typeof window === 'undefined') return null;

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  // If no real API key is provided, don't even try to load the SDK to avoid console errors
  if (!apiKey || apiKey.includes('MockMapsKey')) {
    console.info("Using Interactive Map Simulator (No valid API key provided).");
    return null;
  }

  if (!isOptionsSet) {
    setOptions({
      apiKey: apiKey,
      version: "weekly",
    });
    isOptionsSet = true;
  }

  // Use the new functional importLibrary API
  const { Map } = await importLibrary("maps");
  const { AdvancedMarkerElement } = await importLibrary("marker");
  
  return { Map, AdvancedMarkerElement };
};
