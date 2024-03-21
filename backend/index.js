const express = require('express');
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
require('dotenv').config();
const PORT = 4000;

app.use(express.json());
app.use(cors());

// Database Connection With MongoDB
mongoose.connect(process.env.MONGODBURL);

// API Creation

app.get('/', (req, res) => {
    res.send('Express app is running');
});

app.listen(PORT, error => {
    if (!error) {
        console.log(`Server running on port ${PORT}`);
    } else {
        console.error(`Error ${error}`);
    }
});