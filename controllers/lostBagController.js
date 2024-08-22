const jwt = require("jsonwebtoken");
const { PrismaClient, Prisma } = require("@prisma/client"); 
const prisma = new PrismaClient();
require("dotenv").config();

exports.reportLostBag = async (req, res) => {
  try {
    const {
      primary_color,
      secondary_color,
      category,
      sub_category,  
      brand,
      model,
      serial_number,
      contents,
      last_seen_location,
      date_time_lost,
      contact_info,
      id_proof,
      image_url,
      address,       
      state,         
      city,          
      zipcode        
    } = req.body;

    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const formattedDateTimeLost = new Date(date_time_lost).toISOString();

    const lostBag = await prisma.lostBag.create({
      data: {
        primary_color,
        secondary_color,
        category,
        sub_category,  // Ensure this field is provided
        brand,
        model,
        serial_number,
        contents,
        last_seen_location,
        date_time_lost: formattedDateTimeLost,
        contact_info,
        id_proof,
        image_url,
        address,       
        state,         
        city,          
        zipcode,       
        reported_by: decoded.id,
      },
    });

    res.status(201).json(lostBag);
  } catch (error) {
    console.error("Error in reportLostBag:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// Get Lost Bags Endpoint
exports.getLostBags = async (req, res) => {
  try {
    const { primary_color, category, last_seen_location } = req.query;

    const lostBags = await prisma.lostBag.findMany({
      where: {
        ...(primary_color && { primary_color }), 
        ...(category && { category }),
        ...(last_seen_location && { last_seen_location }),
      },
    });

    res.json(lostBags);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
