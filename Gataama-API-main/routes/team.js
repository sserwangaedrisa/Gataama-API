const express = require("express");
const router = express.Router();
const teamsController = require("../controllers/team");
const verifyToken = require("../middleware/auth");
const upload = require("../middleware/image-upload");

const { isCountryAdmin, isAdmin } = require("../middleware/role");
router.post('/main',verifyToken, isAdmin, upload.single("profilePicture"), teamsController.addTeamMemberForMain);

router.post('/:countryId',verifyToken, isCountryAdmin, upload.single("profilePicture"), teamsController.addTeamMember);


router.get('/main', teamsController.getTeamsMain);

router.get('/:countryId', teamsController.getTeamMembersByCountry);

router.put('/main/:teamMemberId', verifyToken, isAdmin, upload.single("profilePicture"), teamsController.updateTeamMemberForMain);

router.delete('/main/:teamMemberId', verifyToken, isAdmin,teamsController.deleteMainTeamMember);


router.put('/:countryId/:teamMemberId', verifyToken, isCountryAdmin, upload.single("profilePicture"), teamsController.updateTeamMember);


router.delete('/:countryId/:teamMemberId', verifyToken, isCountryAdmin,teamsController.deleteTeamMember);

module.exports = router;
