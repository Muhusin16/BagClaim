const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config();

// Report Lost Bag Endpoint
exports.reportLostBag = async (req, res) => {
  try {
    const { color, type, contents, last_seen_location, date_time_lost, contact_info, id_proof, image_url } = req.body;
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token is missing' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const lostBag = await prisma.lostBag.create({
      data: {
        color,
        type,
        contents,
        last_seen_location,
        date_time_lost,
        contact_info,
        id_proof,
        image_url,
        reported_by: decoded.id,
      },
    });
    res.json(lostBag);
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid token or token verification error'});
  }
};

// Get Lost Bags Endpoint
exports.getLostBags = async (req, res) => {
  const { color, type, last_seen_location } = req.query;
  const lostBags = await prisma.lostBag.findMany({
    where: { color, type, last_seen_location },
  });
  res.json(lostBags);
};
