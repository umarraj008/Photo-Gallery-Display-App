const fs = require("fs");

/**
 * Class to manage the photos.
 * @author Umar Rajput
 */
module.exports = class PhotoManager {
    
    /**
     * Create Photo Manager
     */
    constructor() {
        this.images = [];      // Stores images paths
        this.currentImage = 0; // Index of current image
    }
    
    loadImagesFromFile() {
        // Images folder path
        const imagesFolderPath = "./public/images/";

        // Clear images array
        this.images = [];

        // Reset current image
        this.currentImage = 0;

        fs.readdir(imagesFolderPath, (err, files) => {
            
            // Check for error
            if (err != null) {
                throw "Cannot Read Images File Path";
            }

            files.forEach(file => {

                // Check if file is image
                if (
                    file.includes(".png") || 
                    file.includes(".jpg") || 
                    file.includes(".jpeg") || 
                    file.includes(".tiff") || 
                    file.includes(".tif") || 
                    file.includes(".bmp") || 
                    file.includes(".gif")
                    ) {

                    // Add to images
                    this.images.push(file);
                }
            });
        });
    }
    
    /**
     * This funciton itterates the current photo and updates all clients that the current photo has changed.  
     * @returns {} Nothing is returned.
     */
    nextImage() {
        // Update current image
        this.currentImage++;
        if (this.currentImage >= this.images.length) this.currentImage = 0;
    }

    /**
     * Used to get the current image index.
     * @returns {int} returns current image index.
     */
    getCurrentImageIndex() {
        return this.currentImage;
    }

    /**
     * Used to get the current image path.
     * @returns {String} returns current image path.
     */
    getCurrentImage() {
        return this.images[this.currentImage];
    }
}