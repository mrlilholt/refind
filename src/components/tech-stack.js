import React from "react";
import Box from "@mui/material/Box";

// Import logos (adjust the paths as necessary)
import reactLogo from "../assets/react-logo.svg";
import firebaseLogo from "../assets/firebase-logo.png";
import muiLogo from "../assets/mui-logo.png";
import googleMapsLogo from "../assets/google-maps-logo.svg";

const TechStack = () => {
  return (
    <Box sx={{ padding: "16px" }}>
      <h1>Tech Stack</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
          <img
            src={reactLogo}
            alt="React Logo"
            style={{ width: "40px", marginRight: "8px" }}
          />
          React
        </li>
        <li style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
          <img
            src={firebaseLogo}
            alt="Firebase Logo"
            style={{ width: "40px", marginRight: "8px" }}
          />
          Firebase (Authentication, Firestore)
        </li>
        <li style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
          <img
            src={muiLogo}
            alt="Material UI Logo"
            style={{ width: "40px", marginRight: "8px" }}
          />
          Material UI
        </li>
        <li style={{ display: "flex", alignItems: "center" }}>
          <img
            src={googleMapsLogo}
            alt="Google Maps API Logo"
            style={{ width: "40px", marginRight: "8px" }}
          />
          Google Maps API
        </li>
      </ul>
    </Box>
  );
};

export default TechStack;