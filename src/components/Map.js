import React, { useEffect, useRef } from "react";
import { LoadScript } from "@react-google-maps/api";

const Map = ({ center = { lat: 37.7749, lng: -122.4194 }, zoom = 12, markers = [], directions }) => {
  const mapRef = useRef(null);
  const directionsRendererRef = useRef(null);

  useEffect(() => {
    const initializeMap = () => {
      if (window.google) {
        const map = new window.google.maps.Map(mapRef.current, {
          center,
          zoom,
        });

        // Add markers with optional custom color styling
        markers.forEach((marker) => {
          let mapMarker;
          if (marker.color && marker.position) {
            mapMarker = new window.google.maps.Marker({
              position: marker.position,
              map,
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: marker.color,
                fillOpacity: 0.9,
                strokeWeight: 1,
                strokeColor: "white",
              },
            });
          } else {
            // Fall back if marker is just a position
            mapMarker = new window.google.maps.Marker({
              position: marker,
              map,
            });
          }
          // If marker has a title, attach an info window next to the marker
          if (marker.title) {
            const infoWindow = new window.google.maps.InfoWindow({
              content: marker.title,
            });
            infoWindow.open(map, mapMarker);
          }
        });

        // If directions are provided, render them
        if (directions) {
          directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
            suppressMarkers: true, // We use custom markers instead
          });
          directionsRendererRef.current.setMap(map);
          directionsRendererRef.current.setDirections(directions);
        }
      } else {
        console.error("Google Maps JavaScript API not available.");
      }
    };

    // Dynamically load the Google Maps script if it hasn't been loaded yet
    if (!window.google) {
      const script = document.createElement("script");
      // Replace YOUR_API_KEY with your actual key.
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAa4DqwVZy4hFDbrkqsx0e3u6kLYj1ZXd8&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    } else {
      initializeMap();
    }
  }, [center, zoom, markers, directions]);

  return <div ref={mapRef} style={{ width: "100%", height: "400px" }} />;
};

const MapWrapper = (props) => {
  return (
    <LoadScript
      googleMapsApiKey="AIzaSyAa4DqwVZy4hFDbrkqsx0e3u6kLYj1ZXd8"
      libraries={["places", "directions"]}
    >
      <Map {...props} />
    </LoadScript>
  );
};

export default MapWrapper;