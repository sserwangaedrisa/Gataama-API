const express = require("express");
const router = express.Router();
const departmentController = require("../controllers/department");
const verifyToken = require("../middleware/auth");
const { isCountryAdmin, isAdmin } = require("../middleware/role");
const upload = require("../middleware/image-upload");
router.get(
  "/:countryId/post/:id", departmentController.getDepartmentById)
router.get("/published/:countryId", departmentController.getPublishedDepartmentsByCountry);

router.get("/:countryId", departmentController.getDepartmentsByCountry);
router.post(
  "/:countryId",
  verifyToken,
  isCountryAdmin,
  upload.single("image"),
  departmentController.createDepartment
);

router.put(
  "/:countryId/departments/:departmentId",
  verifyToken,
  isCountryAdmin,
  upload.single("image"),
  departmentController.updateDepartment
);
router.put(
  "/:countryId/department-publish/:departmentId",
  verifyToken,
  isAdmin,
  departmentController.publishDepartment
);
router.delete(
  "/:countryId/departments/:departmentId",
  verifyToken,
  isCountryAdmin,
  departmentController.deleteDepartment
);

module.exports = router;
