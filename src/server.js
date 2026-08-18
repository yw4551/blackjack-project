import express from "express";
import "dotenv/config";
import connectDB from "./config/database.js";

const PORT = process.env.PORT;

const app = express();

app.use(express.json());

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

app.get("/health", (req, res) => {
    res.json({
        success: true,
        message: "Server is healthy",
    });
});

startServer();
