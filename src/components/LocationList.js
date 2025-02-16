import React, { useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  getDocs
} from "firebase/firestore";
import {
  TextField,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from "@mui/material";

const LocationList = ({ currentPosition, onSelectLocation }) => {
  const [mushroomName, setMushroomName] = useState("");
  const [date, setDate] = useState("");
  const [distance, setDistance] = useState("");
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState("");

  // Helper: convert degrees to radians
  const toRad = (value) => (value * Math.PI) / 180;
  
  // Helper: calculate distance (km) between two lat/lng points using the Haversine formula  
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleSearch = async () => {
    // Check that exactly one criterion is provided
    const criteriaCount = [mushroomName, date, distance].filter(val => val && val.trim() !== "").length;
    if (criteriaCount !== 1) {
      setError("Please fill exactly one search criterion.");
      setLocations([]);
      return;
    }
    setError("");
    try {
      const locationsCollection = collection(db, "locations");
      const q = query(locationsCollection);
      const snapshot = await getDocs(q);
      let allLocations = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      // Filter by mushroom name if that criterion is provided
      if (mushroomName) {
        allLocations = allLocations.filter((loc) =>
          loc.mushroomName.toLowerCase().includes(mushroomName.toLowerCase())
        );
      } else if (date) {
        const selectedDate = new Date(date).toDateString();
        allLocations = allLocations.filter((loc) => {
          const locDate = loc.createdAt.toDate().toDateString();
          return locDate === selectedDate;
        });
      } else if (distance) {
        allLocations = allLocations.filter((loc) => {
          const d = getDistance(
            currentPosition.lat,
            currentPosition.lng,
            loc.coordinates.lat,
            loc.coordinates.lng
          );
          return d <= Number(distance);
        });
      }

      setLocations(allLocations);
    } catch (err) {
      console.error("Error searching locations:", err);
      setError("Error searching locations.");
    }
  };

  return (
    <Box
      sx={{
        p: 2,
        border: "1px solid #ccc",
        borderRadius: "4px",
        my: 2
      }}
    >
      <h2>Search Past Locations</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          mb: 2
        }}
      >
        <TextField
          label="Mushroom Name"
          value={mushroomName}
          onChange={(e) => setMushroomName(e.target.value)}
        />
        <TextField
          label="Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <TextField
          label="Distance (km)"
          type="number"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
        />
        <Button onClick={handleSearch} variant="contained" color="primary">
          Search
        </Button>
      </Box>
      <List>
        {locations.map((location) => (
          <ListItem key={location.id}>
            <ListItemText
              primary={location.mushroomName}
              secondary={new Date(location.createdAt.seconds * 1000).toLocaleDateString()}
            />
            <ListItemSecondaryAction>
              <Button
                variant="outlined"
                onClick={() => onSelectLocation(location)}
              >
                Map It
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default LocationList;