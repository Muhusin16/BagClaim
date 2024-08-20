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

exports.updateBag = async (req, res) => {
  try {
    const { id } = req.params;
    const { color, type, contents, id_proof, found_location } = req.body;

    // Check if the bag exists
    const existingBag = await prisma.bag.findUnique({
      where: { id: Number(id) },
    });

    if (!existingBag) {
      return res.status(404).json({ message: "Bag not found" });
    }

    const updatedBag = await prisma.bag.update({
      where: { id: Number(id) },
      data: {
        color: color || existingBag.color,
        type: type || existingBag.type,
        contents: contents || existingBag.contents,
        id_proof: id_proof || existingBag.id_proof,
        found_location: found_location || existingBag.found_location,
      },
    });

    res.json(updatedBag);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteBag = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the bag exists
    const existingBag = await prisma.bag.findUnique({
      where: { id: Number(id) },
    });

    if (!existingBag) {
      return res.status(404).json({ message: "Bag not found" });
    }

    // Delete the bag
    await prisma.bag.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Bag deleted successfully" });
  } catch (error) {
    console.error(error);
    if (error.code === 'P2003') {
      // Handle foreign key constraint violation (e.g., if there are related ReclaimRequest entries)
      res.status(409).json({ message: "Cannot delete bag due to related data" });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
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
