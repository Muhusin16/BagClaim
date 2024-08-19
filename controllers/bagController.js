const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config();

exports.uploadBag = async (req, res) => {
  try {
    const { color, type, contents, id_proof, image_url, found_location } = req.body;
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token is missing' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
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
    res.status(401).json({ message: 'Invalid token or token verification error' });
  }
};


// Search Bags Endpoint
exports.searchBags = async (req, res) => {
  const { color, type, found_location } = req.query;
  const bags = await prisma.bag.findMany({
    where: { color, type, found_location },
  });
  res.json(bags);
};
