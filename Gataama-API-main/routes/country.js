const express = require("express");
const router = express.Router();
const countryController = require("../controllers/country");
const verifyToken = require("../middleware/auth");
const { isAdmin, isCountryAdmin } = require("../middleware/role");
const upload = require("../middleware/image-upload");


router.post("/", verifyToken, isAdmin,   upload.single("image"), countryController.createCountry);
router.get("/", countryController.getAllCountries);
router.get("/:id", countryController.getCountryById);
router.put("/:countryId", verifyToken, isCountryAdmin,   upload.single("image"), countryController.updateCountry);
router.delete("/remove-admin/:id", verifyToken, isAdmin, countryController.removeCountryAdmin);
router.delete("/:id", verifyToken, isAdmin, countryController.deleteCountry);

module.exports = router;
