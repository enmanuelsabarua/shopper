const express = require('express');
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
require('dotenv').config();
const PORT = process.env.PORT || 4000;
const secretKey = process.env.SECRET_KEY;

app.use(express.json());
app.use(cors());

// Database Connection With MongoDB
mongoose.connect(process.env.MONGODB_URI);

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

    const token = jwt.sign(data, secretKey);
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
            const token = jwt.sign(data, secretKey);
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

// Creating endpoint for newcollection data
app.get('/newcollections', async (req, res) => {
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("NewCollection Fetched");
    res.send(newcollection);
});

// Creating endpoint for popular in women section
app.get('/popularinwomen', async (req, res) => {
    let products = await Product.find({ category: "women" });
    let popular_in_women = products.slice(0, 4);
    console.log('Popular in women fetched');
    res.send(popular_in_women);
});

// Creating middleware to fetch user
const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({
            error: 'Please authenticate using a valid token'
        });
    } else {
        try {
            const data = jwt.verify(token, secretKey);
            req.user = data.user;
            next();
        } catch (error) {
            res.status(401).send({
                error: 'Please authenticate using a valid token'
            });
        }
    }
}

// Creating endpoint for adding products in cartdata
app.post('/addtocart', fetchUser, async (req, res) => {
    console.log('Added', req.body.itemId);
    let userData = await Users.findOne({ _id: req.user.id });
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
    res.send('Added');
});

// Creating endpoint to remove product from cartdata
app.delete('/removefromcart', fetchUser, async (req, res) => {
    console.log('Removed', req.body.itemId);
    let userData = await Users.findOne({ _id: req.user.id });
    if (userData.cartData[req.body.itemId] > 0) {
        userData.cartData[req.body.itemId] -= 1;
        await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
        res.send('remove');
    }
});

// Creating endpoint to get cardata
app.post('/getcart', fetchUser, async (req, res) => {
    console.log('Get cart');
    let userData = await Users.findOne({ _id: req.user.id });
    res.json(userData.cartData);
});

app.listen(PORT, error => {
    if (!error) {
        console.log(`Server running on port ${PORT}`);
    } else {
        console.error(`Error ${error}`);
    }
});