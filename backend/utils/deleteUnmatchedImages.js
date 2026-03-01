const fs = require('fs').promises;
const path = require('path');

/**
 * Deletes all image files in the same folder as the given image path,
 * except the image itself.
 * @param {string} fullImagePath - Relative path from project root to the image to keep.
 */
async function deleteUnmatchedImages(fullImagePath) {
  const absoluteImagePath = path.resolve(fullImagePath);
  const folderPath = path.dirname(absoluteImagePath);
  const imageToKeep = path.basename(absoluteImagePath);

  console.log('Cleaning up images in folder:', folderPath);

  try {
    const files = await fs.readdir(folderPath);

    const deletableFiles = files.filter(
      (file) =>
        file !== imageToKeep && /\.(jpg|jpeg|png|gif|webp)$/i.test(file),
    );

    await Promise.all(
      deletableFiles.map(async (file) => {
        const filePath = path.join(folderPath, file);
        try {
          await fs.unlink(filePath);
          console.log(`Deleted: ${file}`);
        } catch (err) {
          console.error(`Failed to delete ${file}:`, err);
        }
      }),
    );
  } catch (err) {
    console.error(`Error reading folder: ${folderPath}`, err);
  }
}

module.exports = deleteUnmatchedImages;
