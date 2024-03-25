const express = require('express');
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const { type } = require('os');
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

// Image Storage Engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });

// Creating Upload Endpoint for images
app.use('/images', express.static('upload/images'));
app.post('/upload', upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:${PORT}/images/${req.file.filename}`
    });
});

// Schema for Creating Products
const Product = mongoose.model("Product", {
    id: {
        type: Number,
        require: true
    },
    name: {
        type: String,
        require: true,
    },
    image: {
        type: String,
        require: true,
    },
    category: {
        type: String,
        require: true,
    },
    new_price: {
        type: Number,
        require: true
    },
    old_price: {
        type: Number,
        require: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    available: {
        type: Boolean,
        default: true
    },
});

app.post('/addproduct', async (req, res) => {
    let products = await Product.find({});
    let id;
    if (products.length > 0) {
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id + 1;
    } else {
        id = 1;
    }
    const { name, image, category, new_price, old_price } = req.body;
    const product = new Product({
        id,
        name,
        image,
        category,
        new_price,
        old_price,
    });

    console.log(product);
    try {
        await product.save();
        console.log("Saved");
        res.json({
            success: true,
            name
        });
    } catch (error) {
        console.error('Error: ', error);
    }
});

// Creating API For deleting Products
app.delete('/removeproduct', async (req, res) => {
    const { id, name } = req.body;
    try {
        await Product.findOneAndDelete({ id });
        console.log('Removed');
        res.json({
            success: true,
            name
        });
    } catch (error) {
        console.error('Error: ', error);
    }
});

// Creating API for getting all products
app.get('/allproducts', async (req, res) => {
    try {
        let products = await Product.find({});
        console.log('All Products Fetched');
        res.send(products);
    } catch (error) {
        console.log('Error: ', error);
    }
});

// Schema creating for User model
const Users = mongoose.model('Users', {
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    cartData: {
        type: Object,
    },
    date: {
        type: Date,
        default: Date.now,
    }
});

// Creating Endpoint for registering the user
app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    let check = await Users.findOne({ email });

    if (check) {
        return res.status(400).json({
            success: false,
            error: 'existing user found with same email address'
        });
    }
    let cart = {};
    for (let i = 0; i < 300; i++) {
        cart[i] = 0;
    }
    const user = new Users({
        name: username,
        email,
        password,
        cartData: cart,
    });

    await user.save();

    const data = {
        user: {
            id: user.id
        }
    }

    const token = jwt.sign(data, 'secret_ecom');
    res.json({
        success: true,
        token
    });
});

// Creating endpoint for user login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    let user = await Users.findOne({ email });
    if (user) {
        const passCompare = password === user.password;

        if (passCompare) {
            const data = {
                user: {
                    id: user.id
                }
            }
            const token = jwt.sign(data, 'secret_ecom');
            res.json({
                success: true,
                token
            });
        } else {
            res.json({
                success: false,
                error: "Wrong Password"
            });
        }

    } else {
        res.json({
            success: false,
            error: "Wrong Email Id"
        });
    }
});

app.listen(PORT, error => {
    if (!error) {
        console.log(`Server running on port ${PORT}`);
    } else {
        console.error(`Error ${error}`);
    }
});