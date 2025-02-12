const express = require("express");
const router = express.Router();
const jobController = require("../controllers/job");
const verifyToken = require("../middleware/auth");
const { isCountryAdmin, isAdmin } = require("../middleware/role");
router.get(
  "/", jobController.getJobs)
  router.get(
    "/published/", jobController.getPublishedJobs)
  router.get(
    "/main", jobController.getJobsMain)
router.get("/:id", jobController.getJobById);

router.post(
  "/",
  verifyToken,
 
  jobController.createJob
);
router.post(
  "/main",
  verifyToken,
  isAdmin,
  jobController.createJobForMain
);

router.put(
  "/main/:id",
  verifyToken,
  isAdmin,
  jobController.updateMainJob
);


router.put(
  "/:id",
  verifyToken,
  jobController.updateJob
);

router.delete(
  "/:id",
  verifyToken,
  isAdmin,
  jobController.deleteJob
);

module.exports = router;
