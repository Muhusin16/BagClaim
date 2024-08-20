const jwt = require("jsonwebtoken");
const { PrismaClient, Prisma } = require("@prisma/client"); // Ensure Prisma is imported correctly
const prisma = new PrismaClient();
require("dotenv").config();

exports.reportLostBag = async (req, res) => {
  try {
    const {
      color,
      type,
      contents,
      last_seen_location,
      date_time_lost,
      contact_info,
      id_proof,
      image_url,
    } = req.body;

    // Validate token presence
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token is missing" });
    }

    // Decode and verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Convert date_time_lost to proper ISO-8601 format
    const formattedDateTimeLost = new Date(date_time_lost).toISOString();

    // Create lost bag entry in the database
    const lostBag = await prisma.lostBag.create({
      data: {
        color,
        type,
        contents,
        last_seen_location,
        date_time_lost: formattedDateTimeLost,
        contact_info,
        id_proof,
        image_url,
        reported_by: decoded.id,
      },
    });

    res.status(201).json(lostBag);
  } catch (error) {
    console.error("Error in reportLostBag:", error);

    // Handle Prisma-specific errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({ message: `Database error: ${error.message}` });
    }

    // Handle JWT-related errors
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Token verification failed" });
    }

    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get Lost Bags Endpoint
exports.getLostBags = async (req, res) => {
  try {
    const { color, type, last_seen_location } = req.query;

    const lostBags = await prisma.lostBag.findMany({
      where: {
        ...(color && { color }), // Filter only if the parameter is present
        ...(type && { type }),
        ...(last_seen_location && { last_seen_location }),
      },
    });

    res.json(lostBags);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
