
const express = require("express");
const router = express.Router();
const meetingController = require('../controllers/meeting');

const verifyToken = require("../middleware/auth");
const { isAdmin } = require("../middleware/role");
const upload = require("../middleware/image-upload");


router.post('/',  verifyToken, isAdmin,   upload.single("image"),meetingController.createMeeting);
router.get('/', meetingController.getMeetings);
router.get('/:id', meetingController.getMeetingById);
router.put('/:id', verifyToken, isAdmin,   upload.single("image"),meetingController.updateMeeting);
router.delete('/:id',  verifyToken, isAdmin, meetingController.deleteMeeting);

module.exports = router;
