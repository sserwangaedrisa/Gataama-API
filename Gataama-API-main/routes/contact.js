const express = require('express');
const multer = require('multer');
const path = require('path');
const ContactsController = require('../controllers/contacts');
const checkAuth = require('../middleware/check-auth');
const validation = require('../middleware/validation');

const router = express.Router();
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/cvs/'));
  },
  filename(req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.match(/^application/)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, and DOCX files are allowed'), false);
  }
};
const upload = multer({ storage, fileFilter });

router.post('/', validation.contactFormPolicy, ContactsController.contactForm);

router.post('/petition', validation.petitionFormPolicy, ContactsController.petitionForm);

router.post('/careers', upload.single('cv'), validation.careersFormPolicy, ContactsController.careerForm);

router.get('/getVolunteers', checkAuth, ContactsController.getVolunteers);

router.get('/getPetitions', checkAuth, ContactsController.getPetitions);

router.get('/getJobs', checkAuth, ContactsController.getJobs);

router.get('/getMessages', checkAuth, ContactsController.getMessages);

router.patch('/career/:id', checkAuth, validation.patchcareersFormPolicy, ContactsController.editCareersForm);

module.exports = router;
