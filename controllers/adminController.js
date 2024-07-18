const bcrypt = require("bcryptjs");
const Admin = require("../models/adminModel");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");

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
