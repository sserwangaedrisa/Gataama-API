const router = require("express").Router();
const { supportedLanguage, translator } = require("../controllers/translator");

router.get('/languages', supportedLanguage);
router.post('/translate', translator);

module.exports = router;
