
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const PostRoutes = require('./routers/postRoutes.js');
const authRoutes = require('./routers/authRoutes.js');
const User = require('../Models/UserModel.js');

const {errorHandler} = require('./middleware/errorMiddleware.js');
require('dotenv').config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use('/api/posts', postRoutes);
app.use('/api/auth', authRoutes);
//app.use(errorHandler);

mongoose.connect(process.env.Database_uri)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch(err => console.log("❌ Error connecting to MongoDB:", err));

app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});