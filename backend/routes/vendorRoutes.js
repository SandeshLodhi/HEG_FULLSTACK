const express = require("express");
const router = express.Router();
const { validateVendor } = require("../controllers/vendorController");

router.post("/validate-vendor", validateVendor);

module.exports = router;