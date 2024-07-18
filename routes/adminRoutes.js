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
router.post(
  "/login",
  adminController.ensureAdminNotLoggedIn,
  adminController.login
);

// Handle admin logout
router.get("/logout", adminController.logout);

// Admin dashboard route
router.get(
  "/dashboard",
  adminController.isAuthenticatedAdmin,
  adminController.getDashboard
);

// Manage Orders route
router.get("/manage-orders", adminController.getManageOrders);

// Manage Brands route
router.get("/manage-brands", adminController.getManageBrands);

// Manage Users route
router.get("/manage-users", adminController.getManageUsers);

router.get(
  "/orders-by-city",
  adminController.isAuthenticatedAdmin,
  adminController.getOrdersPerCity
);

router.get(
  "/products-by-brand",
  adminController.isAuthenticatedAdmin,
  adminController.getProductsByBrand
);

router.get(
  "/products-by-category",
  adminController.isAuthenticatedAdmin,
  adminController.getProductsByCategory
);

// Route to get orders locations
router.get(
  "/orders-locations",
  adminController.isAuthenticatedAdmin,
  adminController.getOrdersLocations
);

module.exports = router;
