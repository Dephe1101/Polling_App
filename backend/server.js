require("dotenv").config();
const express = require("express")
const cors = require("cors")
const path = require("path")
const authRoutes = require('./routes/authRoutes')
const pollRoutes = require('./routes/pollRoutes')


const connectDB = require("./config/db");

const app = express();


//! Middleware to handle CROSS

app.use(
    cors({
        origin: process.env.CORS_ORIGIN || "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
)

app.use(express.json());

connectDB()

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/poll", pollRoutes)


//! Server uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Sever running on port ${PORT}`))
