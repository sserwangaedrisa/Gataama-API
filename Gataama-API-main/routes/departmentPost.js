const express = require("express");
const router = express.Router();
const departmentPostController = require("../controllers/departmentPost");
const verifyToken = require("../middleware/auth");
const { isCountryAdmin } = require("../middleware/role");

router.get(
  "/:countryId/departments/:departmentId/post",
  departmentPostController.getPostByDepartment
);

router.post(
  "/:countryId/departments/:departmentId/post",
  verifyToken,
  isCountryAdmin,
  departmentPostController.createPost
);

router.put(
  "/:countryId/departments/:departmentId/post",
  verifyToken,
  isCountryAdmin,
  departmentPostController.updatePost
);

router.delete(
  "/:countryId/departments/:departmentId/post",
  verifyToken,
  isCountryAdmin,
  departmentPostController.deletePost
);

module.exports = router;
