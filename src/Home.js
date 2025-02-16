import React, { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "./firebase";
import { collection, onSnapshot } from "firebase/firestore";
import Map from "./components/Map";
import AddLocation from "./components/AddLocation";
import LocationList from "./components/LocationList";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import refindLogo from "./assets/refind-logo.png";

// Import modal content components
import About from "./components/About";
import TechStack from "./components/tech-stack";
import Suggestions from "./components/Suggestions";

const Home = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [alertsOn, setAlertsOn] = useState(false);
  const [currentPosition, setCurrentPosition] = useState({
    lat: 37.7749,
    lng: -122.4194,
  });
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [directions, setDirections] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null); // For menu
  const [openModal, setOpenModal] = useState(null); // "About", "Tech Stack", "Suggestions"
  const [savedLocations, setSavedLocations] = useState([]);

  // Subscribe to saved locations from Firestore
  useEffect(() => {
    const locationsRef = collection(db, "locations"); // replace "locations" with your collection name
    const unsubscribe = onSnapshot(locationsRef, (snapshot) => {
      const locationsData = [];
      snapshot.forEach((doc) => {
        locationsData.push({ ...doc.data(), id: doc.id });
      });
      setSavedLocations(locationsData);
    });
    return () => unsubscribe();
  }, []);

  // Helper functions for distance computing using haversine formula
  const deg2rad = (deg) => deg * (Math.PI / 180);
  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Get nearby locations within 5 km
  const nearbyLocations = savedLocations.filter((loc) =>
    getDistanceFromLatLonInKm(
      currentPosition.lat,
      currentPosition.lng,
      loc.coordinates.lat,
      loc.coordinates.lng
    ) <= 5
  );

  // Get the user's current geolocation on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) =>
          setCurrentPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }),
        (err) => {
          console.error("Error fetching location:", err);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  const user = auth.currentUser;

  // Fetch directions using Google Maps DirectionsService (using WALKING mode)
  const getDirections = (origin, destination) => {
    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: new window.google.maps.LatLng(origin.lat, origin.lng),
        destination: new window.google.maps.LatLng(
          destination.lat,
          destination.lng
        ),
        travelMode: window.google.maps.TravelMode.WALKING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  };

  // Called when a location is selected from the list
  const handleSelectLocation = (location) => {
    setSelectedLocation(location);
    getDirections(currentPosition, location.coordinates);
  };

  // Determine map center (if a location is selected, center there)
  const mapCenter = selectedLocation
    ? selectedLocation.coordinates
    : currentPosition;

  // Setup markers for current location and selected location with distinct colors.
  const mapMarkers = [
    { position: currentPosition, color: "blue" },
    ...(selectedLocation
      ? [
          {
            position: selectedLocation.coordinates,
            color: "red",
            title: selectedLocation.mushroomName,
          },
        ]
      : []),
  ];

  // Handlers for user icon menu
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Instead of using navigate, open the corresponding modal
  const handleMenuItemClick = (page) => {
    setOpenModal(page);
    handleMenuClose();
  };

  // Render modal content based on which modal is open
  const renderModalContent = () => {
    switch (openModal) {
      case "About":
        return <About />;
      case "Tech Stack":
        return <TechStack />;
      case "Suggestions":
        return <Suggestions />;
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "0 10px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Re-Find Logo at top */}
      <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
        <img src={refindLogo} alt="Re-Find Logo" style={{ width: "150px" }} />
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 20px",
          borderBottom: "1px solid #ccc",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {user && user.photoURL ? (
            <IconButton onClick={handleMenuOpen}>
              <img
                src={user.photoURL}
                alt="Profile"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  marginRight: "10px",
                }}
              />
            </IconButton>
          ) : (
            <span>No Profile</span>
          )}
          <span>{user ? user.displayName || user.email : "Guest"}</span>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => handleMenuItemClick("About")}>
              About
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick("Tech Stack")}>
              Tech Stack
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick("Suggestions")}>
              Suggestions
            </MenuItem>
          </Menu>
        </Box>
        <Button onClick={handleLogout} variant="contained" color="error">
          Logout
        </Button>
      </Box>

      <h1>Re-Find Map</h1>
      <Map
        center={mapCenter}
        zoom={selectedLocation ? 14 : 12}
        markers={mapMarkers}
        directions={directions}
      />

      {directions && (
        <Box sx={{ my: 2, p: 2, border: "1px solid #ccc", borderRadius: "4px" }}>
          <h2>Hiking Directions</h2>
          {directions.routes[0].legs[0].steps.map((step, idx) => (
            <div key={idx} dangerouslySetInnerHTML={{ __html: step.instructions }} />
          ))}
        </Box>
      )}

      {alertsOn && (
        <Box sx={{ my: 2, p: 2, border: "1px solid #ccc", borderRadius: "4px" }}>
          <h2>Nearby Saved Locations (within 5 km)</h2>
          {nearbyLocations.length > 0 ? (
            nearbyLocations.map((loc) => (
              <div key={loc.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                <div>
                  <strong>{loc.mushroomName}</strong> –{" "}
                  {getDistanceFromLatLonInKm(
                    currentPosition.lat,
                    currentPosition.lng,
                    loc.coordinates.lat,
                    loc.coordinates.lng
                  ).toFixed(2)}{" "}
                  km away
                </div>
                <Button variant="contained" size="small" onClick={() => handleSelectLocation(loc)}>
                  Map it
                </Button>
              </div>
            ))
          ) : (
            <p>No nearby saved locations found.</p>
          )}
        </Box>
      )}

      <Box sx={{ my: 2, display: "flex", justifyContent: "center" }}>
        <Button
          onClick={() => {
            setShowAddForm(!showAddForm);
            setSelectedLocation(null);
            setDirections(null);
          }}
          variant="outlined"
          color="primary"
        >
          {showAddForm ? "Cancel" : "Add New Location"}
        </Button>
      </Box>
      {showAddForm && <AddLocation currentPosition={currentPosition} />}

      <Box sx={{ my: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={alertsOn}
              onChange={(e) => setAlertsOn(e.target.checked)}
              color="primary"
            />
          }
          label="Turn on Alerts for Nearby Spots"
        />
      </Box>

      <LocationList
        currentPosition={currentPosition}
        onSelectLocation={handleSelectLocation}
      />

      <Dialog open={Boolean(openModal)} onClose={() => setOpenModal(null)}>
        <DialogContent>{renderModalContent()}</DialogContent>
      </Dialog>
    </Box>
  );
};

export default Home;