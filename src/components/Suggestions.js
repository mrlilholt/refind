import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import emailjs from "emailjs-com";

const Suggestions = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const fromEmail = formData.get("email");
    const message = formData.get("message");

    const templateParams = {
      from_email: fromEmail,
      message: message,
      // Hard-code the recipient email here.
      to_email: "addison.lilholt@gmail.com",
    };

    emailjs
      .send(
        "refind", // Replace with your EmailJS service ID
        "template_1wmee89", // Replace with your EmailJS template ID
        templateParams,
        "OsBsYfQ47SG2Mjb5h" // Replace with your EmailJS user/public key
      )
      .then(
        (response) => {
          alert("Thank you for your suggestion!");
        },
        (error) => {
          console.error("Failed to send suggestion:", error);
          alert("Failed to send suggestion. Please try again later.");
        }
      );
  };

  return (
    <Box sx={{ padding: "16px" }}>
      <h1>Suggestions</h1>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Your Email"
          name="email"
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Your Message"
          name="message"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          required
        />
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default Suggestions;