const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");

require("./db");

const app = express();

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

app.use(
    cors({
        origin: CLIENT_URL,
        credentials: true
    })
);

app.use(express.json());

app.get("/api/health", (req, res) => {
    res.status(200).json({
        message: "Red Devils Fan Store API is running"
    });
});

app.use("/api/auth", authRoutes);

app.use((req, res) => {
    res.status(404).json({
        message: "API endpoint not found"
    });
});

app.use((error, req, res, next) => {
    console.error(error.stack);

    res.status(error.status || 500).json({
        message: error.message || "Internal server error"
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});