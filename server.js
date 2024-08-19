const express = require("express");
const authRoutes = require('./routes/authRoutes');
const bagRoutes = require('./routes/bagRoutes');
const lostBagRoutes = require('./routes/lostBagRoutes');
const reclaimRoutes = require('./routes/reclaimRoutes');
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', bagRoutes);
app.use('/api', lostBagRoutes);
app.use('/api', reclaimRoutes);

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
    process.exit(1); // Exit process with failure
  }
};

startServer();
