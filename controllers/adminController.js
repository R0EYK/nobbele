const bcrypt = require("bcryptjs");
const Admin = require("../models/adminModel");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const Brand = require('../models/brandModel');
const User = require('../models/userModel');
const axios = require('axios');
require('dotenv').config();


// Function to post to Facebook
const postToFacebook = async (product) => {
  const pageAccessToken = process.env.PAGE_ACCESS_TOKEN;
const pageId = process.env.PAGE_ID;

  const message = `
    New Product: ${product.name}
    Brand: ${product.brand}
    Price: $${product.price}
    picture: ${product.image}
    Description: ${product.description}
  `;

  try {
    const response = await axios.post(`https://graph.facebook.com/${pageId}/feed`, {
      message: message,
      access_token: pageAccessToken
    });
    console.log('Successfully posted to Facebook:', response.data.id);
  } catch (error) {
    console.error('Error posting to Facebook:', error.response ? error.response.data : error.message);
  }
};





exports.renderLogin = (req, res) => {
  res.render("admin-login", { errorMessage: null });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.render("admin-login", {
      errorMessage: "Both fields are required.",
    });
  }

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.render("admin-login", {
        errorMessage: "Invalid username or password.",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.render("admin-login", {
        errorMessage: "Invalid username or password.",
      });
    }

    // Set a session for the admin user
    req.session.adminId = admin._id; // Using session
    req.session.adminLoggedIn = true;

    res.redirect("/admin/dashboard"); // Change this to your admin dashboard route
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/admin/login");
  });
};

// Middleware to check if admin logged in
exports.ensureAdminNotLoggedIn = (req, res, next) => {
  if (req.session.adminLoggedIn) {
    return res.redirect("/admin/dashboard"); // Redirect to admin dashboard or main admin page
  }
  next();
};

exports.isAuthenticatedAdmin = (req, res, next) => {
  if (req.session.adminLoggedIn) {
    return next();
  } else {
    res.redirect("/admin/login");
  }
};

exports.getDashboard = (req, res) => {
  res.render("admin-dashboard");
};

exports.getManageOrders = (req, res) => {
  res.render("admin-manage-orders");
};

exports.getManageBrands = (req, res) => {
  res.render("admin-manage-brands");
};

exports.getManageUsers = (req, res) => {
  res.render("admin-manage-users");
};

exports.getOrdersPerCity = async (req, res) => {
  try {
    const ordersPerCity = await Order.aggregate([
      {
        $group: {
          _id: "$shippingAddress.city", // Group by the city field inside shippingAddress
          count: { $sum: 1 }, // Count the number of orders for each city
        },
      },
      {
        $project: {
          _id: 0, // Exclude _id from the result
          city: "$_id", // Rename _id to city
          count: 1, // Include count in the result
        },
      },
    ]);

    res.json(ordersPerCity);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// Get product count per brand
exports.getProductsByBrand = async (req, res) => {
  try {
    const productsByBrand = await Product.aggregate([
      { $group: { _id: "$brand", count: { $sum: 1 } } },
      {
        $lookup: {
          from: "brands",
          localField: "_id",
          foreignField: "_id",
          as: "brand",
        },
      },
      { $unwind: "$brand" },
      { $project: { _id: 0, brand: "$brand.name", count: 1 } },
    ]);
    res.json(productsByBrand);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Function to get number of products per category
exports.getProductsByCategory = async (req, res) => {
  try {
    // Aggregation pipeline to count products per category
    const productsByCategory = await Product.aggregate([
      {
        $group: {
          _id: "$category", // Group by category field
          count: { $sum: 1 }, // Count number of products in each category
        },
      },
    ]);
    res.json(productsByCategory);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getOrdersLocations = async (req, res) => {
  try {
    const orders = await Order.aggregate([
      {
        $match: {
          "shippingAddress.city": { $exists: true },
          "shippingAddress.country": { $exists: true },
          "shippingAddress.street": { $exists: true },
          "shippingAddress.houseNumber": { $exists: true },
          "shippingAddress.zipCode": { $exists: true },
        },
      },
      {
        $project: {
          _id: 0,
          city: "$shippingAddress.city",
          country: "$shippingAddress.country",
          street: "$shippingAddress.street",
          houseNumber: "$shippingAddress.houseNumber",
          zipCode: "$shippingAddress.zipCode",
        },
      },
    ]);

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders locations:", error);
    res.status(500).send("Server Error");
  }
};

exports.getManageProductsPage = async (req, res) => {
  try {
      const products = await Product.find().populate("brand").exec();
      res.render('manage-products', { products });
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
};

exports.deleteProduct = async (req, res) => {
  try {
      await Product.findByIdAndDelete(req.params.id);
      res.json({ success: true });
  } catch (err) {
      console.error(err);
      res.status(500).json({ success: false });
  }
};
exports.getEditProduct = async (req, res) => {
  try {
      const product = await Product.findById(req.params.id).populate('brand');
      res.render('edit-product', { product });
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
};


// Handle edit product form submission
exports.postEditProduct = async (req, res) => {
  try {
      const { name, price, description, image, brand, gender, category, discount } = req.body;
      await Product.findByIdAndUpdate(req.params.id, {
          name,
          price,
          description,
          image: image.split(',').map(img => img.trim()), // Convert comma-separated string to array
          brand,
          gender,
          category,
          discount: discount || 0
      });
      res.redirect('/admin/manage-products');
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
};

// Get manage users page
exports.getManageUsers = async (req, res) => {
  try {
      // Fetch all users excluding password field
      const users = await User.find({}, '-password');
      res.render('admin-manage-users', { users });
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
};

// Get manage brands page
exports.getManageBrands = async (req, res) => {
  try {
      const brands = await Brand.find();
      res.render('admin-manage-brands', { brands });
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
};

// Get edit brand page
exports.getEditBrand = async (req, res) => {
  try {
      const brand = await Brand.findById(req.params.id);
      if (!brand) {
          return res.status(404).send('Brand not found');
      }
      res.render('edit-brand', { brand });
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
};

// Post updated brand information
exports.postEditBrand = async (req, res) => {
  try {
      const { name } = req.body;
      await Brand.findByIdAndUpdate(req.params.id, { name });
      res.redirect('/admin/manage-brands');
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
};

// Delete brand
exports.deleteBrand = async (req, res) => {
  try {
      await Brand.findByIdAndDelete(req.params.id);
      res.redirect('/admin/manage-brands');
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
};

exports.renderAddProductPage = async (req, res) => {
  try {
      const brands = await Brand.find();
      res.render('add-product', { brands });
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
};


exports.addProduct = async (req, res) => {
  try {
    const { name, price, description, brand, gender, category, discount, image } = req.body;
    const images = image.split(',').map(img => img.trim());

    const newProduct = new Product({
      name,
      price,
      description,
      image: images,
      brand,
      gender,
      category,
      discount
    });

    // Save the product to the database
    await newProduct.save();

    // Post to Facebook
    await postToFacebook(newProduct);

    res.redirect('/admin/manage-products');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};
exports.renderAddBrandPage = (req, res) => {
  res.render('add-brand');
};

exports.addBrand = async (req, res) => {
  try {
      const { name } = req.body;

      // Check if the brand already exists
      const existingBrand = await Brand.findOne({ name });
      if (existingBrand) {
          return res.status(400).send('Brand already exists');
      }

      const newBrand = new Brand({ name });
      await newBrand.save();
      res.redirect('/admin/manage-brands');
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
};
exports.renderManageOrdersPage = async (req, res) => {
  try {
      const orders = await Order.find()
          .populate('userId') // Populate userId field with User documents
          .populate('products.productId'); // Populate productId field with Product documents

      res.render('manage-orders', { orders });
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
};