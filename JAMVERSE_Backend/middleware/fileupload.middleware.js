const multer = require("multer");

const loadImageToBuffer = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 2048 // Compliant: 8MB
    }
});

module.exports = loadImageToBuffer;