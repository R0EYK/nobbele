const bcrypt = require("bcryptjs");
const Admin = require("../models/adminModel"); // Assuming you have an Admin model

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

    // Set a session or cookie for the admin user
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
