

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const postRoutes = require('./routers/postRoutes.js');
const authRoutes = require('./routers/authRoutes.js');
const { errorHandler } = require('./middleware/errorHandler.js');

require('dotenv').config();

const app = express();

/* ===== Middleware ===== */
app.use(cors());
app.use(express.json());

/* ===== Routes ===== */
app.use('/api/posts', postRoutes);
app.use('/api/auth', authRoutes);

/* ===== Error Middleware ===== */
app.use(errorHandler);

/* ===== MongoDB Connection ===== */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch(err => console.log("❌ MongoDB connection error:", err));

/* ===== Server Start ===== */
const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});