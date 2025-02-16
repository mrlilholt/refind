import React, { useState } from "react";
import { auth, db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { TextField, Button, Box, Alert } from "@mui/material";

const AddLocation = ({ currentPosition, onSave }) => {
  const [mushroomName, setMushroomName] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
      setError("User not authenticated.");
      return;
    }
    try {
      await addDoc(collection(db, "locations"), {
        userId: auth.currentUser.uid,
        mushroomName,
        notes,
        coordinates: currentPosition,
        createdAt: Timestamp.now(),
      });
      setMushroomName("");
      setNotes("");
      setError(null);
      if (onSave) onSave();
    } catch (err) {
      console.error("Error adding location:", err);
      setError("Failed to add location. Please try again.");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: 2,
        border: "1px solid #ccc",
        borderRadius: "4px",
      }}
    >
      {error && <Alert severity="error">{error}</Alert>}
      <TextField
        label="Mushroom Name"
        value={mushroomName}
        onChange={(e) => setMushroomName(e.target.value)}
        required
      />
      <TextField
        label="Field Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        multiline
        rows={4}
      />
      <Button type="submit" variant="contained" color="primary">
        Save Location
      </Button>
    </Box>
  );
};

export default AddLocation;