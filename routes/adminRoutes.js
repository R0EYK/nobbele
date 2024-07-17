const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// Render admin login page
router.get(
  "/login",
  adminController.ensureAdminNotLoggedIn,
  adminController.renderLogin
);

// Handle admin login
router.post("/login", adminController.login);

// Handle admin logout
router.get("/logout", adminController.logout);

module.exports = router;
