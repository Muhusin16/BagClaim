// controllers/bagController.js
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const path = require("path");
const fs = require("fs");
const prisma = new PrismaClient();
require("dotenv").config();

exports.uploadBag = async (req, res) => {
  try {
    const { color, type, contents, id_proof, found_location } = req.body;
    console.log(req.file);
    
    const imageFile = req.file;
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token is missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Construct the image URL from the file path
    const image_url = imageFile ? imageFile.path.replace(/\\/g, "/") : "";
    const bag = await prisma.bag.create({
      data: {
        color,
        type,
        contents,
        id_proof,
        image_url,
        found_location,
        found_by: decoded.id,
      },
    });
    res.json(bag);
  } catch (error) {
    console.error(error);
    res
      .status(401)
      .json({ message: "Invalid token or token verification error" });
  }
};

exports.getAllBags = async (req, res) => {
  try {
    const { color, type, found_location } = req.query;

    const filters = {};
    if (color) filters.color = color;
    if (type) filters.type = type;
    if (found_location) filters.found_location = found_location;

    const bags = await prisma.bag.findMany({
      where: filters,
    });

    res.json(bags);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getBagById = async (req, res) => {
  try {
    const { id } = req.params;

    const bag = await prisma.bag.findUnique({
      where: { id: Number(id) },
    });

    if (bag) {
      res.json(bag);
    } else {
      res.status(404).json({ message: "Bag not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.searchBags = async (req, res) => {
  const { color, type, found_location } = req.query;

  const filters = {};
  if (color) filters.color = color;
  if (type) filters.type = type;
  if (found_location) filters.found_location = found_location;

  const bags = await prisma.bag.findMany({
    where: filters,
  });

  res.json(bags);
};
