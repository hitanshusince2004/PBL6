require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// ✅ MongoDB Connection
if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI is missing in .env file");
    process.exit(1);
}

mongoose.set("strictQuery", false);
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("🔥 MongoDB Connected"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Schema & Model
const ReforestationSchema = new mongoose.Schema({
    name: String,
    lat: Number,
    lng: Number,
    region: String,
    plantedTrees: Number,
    year: Number,
    details: String,
});

const Reforestation = mongoose.model("Reforestation", ReforestationSchema);

// ✅ Get All Projects
app.get("/api/projects", async (req, res) => {
    try {
        const projects = await Reforestation.find();
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch projects" });
    }
});

// ✅ Add New Project
app.post("/api/projects", async (req, res) => {
    try {
        const { name, lat, lng, region, plantedTrees, year, details } = req.body;
        const newProject = new Reforestation({ name, lat, lng, region, plantedTrees, year, details });
        await newProject.save();
        res.status(201).json(newProject);
    } catch (err) {
        res.status(500).json({ error: "Failed to add project" });
    }
});

// ✅ Delete a Project
app.delete("/api/projects/:id", async (req, res) => {
    try {
        await Reforestation.findByIdAndDelete(req.params.id);
        res.json({ message: "Project deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete project" });
    }
});

// ✅ Fetch Real-Time Forest Data (Replace with actual API URL)
app.get("/api/forest-data", async (req, res) => {
    try {

       

        const API_URL = `https://localhost:5000/api/forest-data?lat=${lat}&lng=${lng}`;
        const response = await axios.get(API_URL);

        res.json(response.data);
    } catch (err) {
        console.error("❌ API Fetch Error:", err.message);
        res.status(500).json({ error: "Failed to fetch forest data" });
    }
});

app.post("/api/forest-data", (req, res) => {
    try {
        const { lat, lng } = req.body;

        if (!lat || !lng) {
            return res.status(400).json({ error: "Latitude and Longitude are required" });
        }

        // Log the received data in the terminal
        console.log(`Received Data - Latitude: ${lat}, Longitude: ${lng}`);

        // Send a success response to the client
        res.status(200).json({ message: "Data received successfully!" });
    } catch (error) {
        console.error("Error receiving forest data:", error.message);
        res.status(500).json({ error: "Failed to process forest data" });
    }
});


// ✅ Start the Server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));