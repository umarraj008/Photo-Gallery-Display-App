const path = require("path");
const multer = require("multer");

/**
 * Class to manage image uploads from clients.
 * @author Umar Rajput
 */
module.exports = class UploadManger {
    
    /**
     * Create Upload Manager
     */
    constructor() {

        // Define images folder path using multer
        this.fileStorage = multer.diskStorage({
            destination: "./public/images",
            filename: (req, file, cb) => {
                cb(null, file.originalname + "___" + Date.now() + path.extname(file.originalname));
            }
        });

        // Image upload function using multer
        this.uploadImage = multer({
            storage: this.fileStorage,
            fileFilter(req, file, cb) {
                // Check if file type is acceptable
                if (
                    file.originalname.includes(".png") || 
                    file.originalname.includes(".jpg") || 
                    file.originalname.includes(".jpeg") || 
                    file.originalname.includes(".tiff") || 
                    file.originalname.includes(".tif") || 
                    file.originalname.includes(".bmp") || 
                    file.originalname.includes(".gif")
                    ) {
                        cb(undefined, true);
                    } else {
                        return cb(new Error("Please upload images only!"));
                    }
            }
        });
    }
}