const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
require("dotenv").config();

// Reclaim Bag Endpoint
exports.reclaimBag = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token is missing" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the bag has already been claimed
    const existingRequest = await prisma.reclaimRequest.findFirst({
      where: { bag_id: parseInt(req.params.id), requested_by: decoded.id },
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "You have already requested to reclaim this item." });
    }

    // Create a new reclaim request
    const reclaimRequest = await prisma.reclaimRequest.create({
      data: {
        bag_id: parseInt(req.params.id),
        requested_by: decoded.id,
      },
    });

    // Notify the finder about the new reclaim request
    // This could be implemented with a notification system or by updating the reclaim request status

    res.json(reclaimRequest);
  } catch (error) {
    console.error(error);
    res
      .status(401)
      .json({ message: "Invalid token or token verification error" });
  }
};

// Finder's Endpoint to Request More Information
exports.requestAdditionalInfo = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verify that the finder is the one who found the bag
    const bag = await prisma.bag.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (bag.found_by !== decoded.id) {
      return res
        .status(403)
        .json({
          message:
            "You are not authorized to request information for this item.",
        });
    }

    // Request additional information from the claimant
    const { additional_info_request } = req.body;
    const reclaimRequest = await prisma.reclaimRequest.update({
      where: { id: parseInt(req.params.reclaimId) },
      data: { additional_info_request },
    });

    res.json(reclaimRequest);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error requesting additional information" });
  }
};

// Finder's Endpoint to Verify or Reject Reclaim Request
exports.verifyReclaim = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verify that the finder is the one who found the bag
    const bag = await prisma.bag.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (bag.found_by !== decoded.id) {
      return res
        .status(403)
        .json({
          message: "You are not authorized to verify this reclaim request.",
        });
    }

    const { verified } = req.body;

    // Update the reclaim request status
    const reclaimRequest = await prisma.reclaimRequest.update({
      where: { id: parseInt(req.params.reclaimId) },
      data: { verified },
    });

    res.json(reclaimRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating reclaim request" });
  }
};
