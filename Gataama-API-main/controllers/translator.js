const { translate, languages } = require("google-translate-api-x");
const asyncHandler = require("express-async-handler");

const supportedLanguage = asyncHandler(async (req, res) => {
    return res.status(200).json(languages)
})

const translator = asyncHandler(async (req, res) => {
    const { text, targetLanguage, sourceLanguage } = req.body;
    if (!text || !targetLanguage) {
        return res.status(400).json({ message: 'Text and Target Language are required' });
    }

    const result = await translate(text, {
        from: sourceLanguage || "auto",
        to: targetLanguage
    });
    
    if(result){
        return res.status(200).json({
            translatedText: result.text,
            from: result.raw[1][3],
            to: result.raw[1][1]
        });

    } else {
        return res.status(500).json({ message: 'Translation failed' })
    }
});

module.exports = {
    supportedLanguage,
    translator
};
