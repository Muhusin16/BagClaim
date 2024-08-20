const express = require("express");
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const lostBagRoutes = require('./routes/lostBagRoutes');
const reclaimRoutes = require('./routes/reclaimRoutes');
const adminRoutes = require('./routes/adminRoutes')
const { PrismaClient } = require("@prisma/client");
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true,
}));

// Serve static files from 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', lostBagRoutes);
app.use('/api', reclaimRoutes);
app.use('/api/admin', adminRoutes);

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1); 
  }
};

startServer();
