const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config();

exports.reclaimBag = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token is missing' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = req.params;
    const { message } = req.body;

    // Check if the bag exists
    const bag = await prisma.bag.findUnique({ where: { id: parseInt(id) } });
    if (!bag) {
      return res.status(404).json({ message: 'Bag not found' });
    }

    // Create a reclaim request
    const reclaimRequest = await prisma.reclaimRequest.create({
      data: {
        bag_id: parseInt(id),
        requested_by: decoded.id,
        additional_info_request: message || '',
      },
    });

    res.json(reclaimRequest);
  } catch (error) {
    console.error('Error creating reclaim request:', error);
    res.status(500).json({ message: 'Error creating reclaim request' });
  }
};

exports.requestAdditionalInfo = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token is missing' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id, reclaimId } = req.params;

    // Check if the bag exists
    const bag = await prisma.bag.findUnique({ where: { id: parseInt(id) } });
    if (!bag) {
      return res.status(404).json({ message: 'Bag not found' });
    }

    // Check authorization
    if (bag.found_by !== decoded.id) {
      return res.status(403).json({ message: 'Unauthorized to request information for this item' });
    }

    // Update the reclaim request
    const { additional_info_request } = req.body;
    const reclaimRequest = await prisma.reclaimRequest.update({
      where: { id: parseInt(reclaimId) },
      data: { additional_info_request },
    });

    res.json(reclaimRequest);
  } catch (error) {
    console.error('Error requesting additional information:', error);
    res.status(500).json({ message: 'Error requesting additional information' });
  }
};

exports.verifyReclaim = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token is missing' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id, reclaimId } = req.params;

    // Check if the bag exists
    const bag = await prisma.bag.findUnique({ where: { id: parseInt(id) } });
    if (!bag) {
      return res.status(404).json({ message: 'Bag not found' });
    }

    // Check authorization
    if (bag.found_by !== decoded.id) {
      return res.status(403).json({ message: 'Unauthorized to verify this reclaim request' });
    }

    // Update the reclaim request
    const { verified } = req.body;
    const reclaimRequest = await prisma.reclaimRequest.update({
      where: { id: parseInt(reclaimId) },
      data: { verified },
    });

    res.json(reclaimRequest);
  } catch (error) {
    console.error('Error verifying reclaim request:', error);
    res.status(500).json({ message: 'Error updating reclaim request' });
  }
};
