const fs = require('fs').promises;
const path = require('path');

/**
 * Deletes an entire folder and its contents.
 * @param {string} folderPath - Relative path to the folder to delete.
 */
async function deleteAccommodationFolder(folderPath) {
  const absolutePath = path.resolve(folderPath);

  try {
    await fs.rm(absolutePath, { recursive: true, force: true });
    console.log(`Deleted folder: ${absolutePath}`);
  } catch (err) {
    console.error(`Failed to delete folder: ${absolutePath}`, err);
  }
}

module.exports = deleteAccommodationFolder;
