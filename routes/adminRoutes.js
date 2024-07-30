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
router.get('/manage-users', adminController.isAuthenticatedAdmin , adminController.getManageUsers);
router.get('/manage-products', adminController.isAuthenticatedAdmin , adminController.getManageProductsPage);
router.delete('/delete-product/:id', adminController.isAuthenticatedAdmin , adminController.deleteProduct);
router.get('/edit-product/:id', adminController.isAuthenticatedAdmin , adminController.getEditProduct);
router.post('/edit-product/:id', adminController.isAuthenticatedAdmin , adminController.postEditProduct);
// Edit brand routes
router.get('/edit-brand/:id', adminController.isAuthenticatedAdmin , adminController.getEditBrand);
router.post('/edit-brand/:id', adminController.isAuthenticatedAdmin , adminController.postEditBrand);
// Manage brands route
router.get('/manage-brands',adminController.isAuthenticatedAdmin , adminController.getManageBrands);
// Delete brand route
router.get('/delete-brand/:id',adminController.isAuthenticatedAdmin , adminController.deleteBrand);
// Route to render add-product page
router.get('/add-product', adminController.isAuthenticatedAdmin, adminController.renderAddProductPage);
// Route to handle add-product form submission
router.post('/add-product', adminController.isAuthenticatedAdmin,  adminController.addProduct);
// Routes for brands
router.get('/add-brand',adminController.isAuthenticatedAdmin, adminController.renderAddBrandPage);
router.post('/add-brand',adminController.isAuthenticatedAdmin, adminController.addBrand);
// Route for managing orders
router.get('/manage-orders',adminController.isAuthenticatedAdmin,adminController.renderManageOrdersPage);
module.exports = router;
