const express = require("express");
const router = express.Router();
const countryContactController = require("../controllers/countryContact");
const verifyToken = require("../middleware/auth");

const { isCountryAdmin, isAdmin } = require("../middleware/role");

router.post('/:countryId',verifyToken, isCountryAdmin,  countryContactController.addCountryContact);

router.get('/:countryId', countryContactController.getCountryContact);

router.put('/:countryId', verifyToken, isCountryAdmin,  countryContactController.updateCountryContact);

router.delete('/:countryId', verifyToken, isCountryAdmin,countryContactController.getCountryContact);

module.exports = router;
