// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const axios = require("axios");
// const fs = require("fs");
// const path = require("path");

// const app = express();
// app.use(cors());
// app.use(express.json());

// const PORT = process.env.PORT || 5000;

// // ✅ MongoDB Connection
// if (!process.env.MONGO_URI) {
//     console.error("❌ MONGO_URI is missing in .env file");
//     process.exit(1);
// }

// mongoose
//     .connect(process.env.MONGO_URI)
//     .then(() => console.log("🔥 MongoDB Connected"))
//     .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// // ✅ Define Schema & Model
// const ReforestationSchema = new mongoose.Schema({
//     name: String,
//     lat: Number,
//     lng: Number,
//     details: String,
// });

// const Reforestation = mongoose.model("Reforestation", ReforestationSchema);

// // ✅ API to Fetch Reforestation Projects from MongoDB
// app.get("/api/projects", async (req, res) => {
//     try {
//         const projects = await Reforestation.find();
//         res.json(projects);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// // ✅ API to Fetch Reforestation Projects from `data.json`
// app.get("/api/json-projects", (req, res) => {
//     const dataFilePath = path.join(__dirname, "data.json");

//     fs.readFile(dataFilePath, "utf8", (err, data) => {
//         if (err) {
//             return res.status(500).json({ error: "Failed to load JSON data" });
//         }
//         res.json(JSON.parse(data));
//     });
// });

// // ✅ API to Fetch Real-Time Forest Data
// app.get("/api/forest-data", async (req, res) => {
//     try {
//         const { lat, lng } = req.query;

//         if (!lat || !lng) {
//             return res.status(400).json({ error: "Latitude and Longitude are required" });
//         }

//         const API_URL = `https://api.globalforestwatch.org/forest-data?lat=${lat}&lng=${lng}`;
//         const response = await axios.get(API_URL);

//         const forestData = {
//             treeCoverLoss: response.data.treeCoverLoss || "Data not available",
//             treeCoverGain: response.data.treeCoverGain || "Data not available",
//             deforestationRate: response.data.deforestationRate || "Data not available",
//         };

//         res.json(forestData);
//     } catch (err) {
//         console.error("❌ API Fetch Error:", err);
//         res.status(500).json({ error: "Failed to fetch data" });
//     }
// });

// // ✅ Start the Server
// app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));



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

// ✅ Define Schema & Model
const ReforestationSchema = new mongoose.Schema({
    name: String,
    lat: Number,
    lng: Number,
    details: String,
});

const Reforestation = mongoose.model("Reforestation", ReforestationSchema);

// ✅ API to Fetch Reforestation Projects from MongoDB
app.get("/api/projects", async (req, res) => {
    try {
        const projects = await Reforestation.find();
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ API to Fetch Reforestation Projects from `data.json`
app.get("/api/json-projects", (req, res) => {
    try {
        const dataFilePath = path.join(__dirname, "data.json");
        const data = fs.readFileSync(dataFilePath, "utf8");
        res.json(JSON.parse(data));
    } catch (err) {
        console.error("❌ Failed to read data.json:", err);
        res.status(500).json({ error: "Failed to load JSON data" });
    }
});

// ✅ API to Fetch Real-Time Forest Data
app.get("/api/forest-data", async (req, res) => {
    try {
        const { lat, lng } = req.query;

        if (!lat || !lng) {
            return res.status(400).json({ error: "Latitude and Longitude are required" });
        }

        // ❌ Check if the API actually exists
        const API_URL = `https://api.globalforestwatch.org/v1/forest-data?lat=${lat}&lng=${lng}`;
        const response = await axios.get(API_URL);

        const forestData = {
            treeCoverLoss: response.data.treeCoverLoss || "Data not available",
            treeCoverGain: response.data.treeCoverGain || "Data not available",
            deforestationRate: response.data.deforestationRate || "Data not available",
        };

        res.json(forestData);
    } catch (err) {
        console.error("❌ API Fetch Error:", err);
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

// ✅ Start the Server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
