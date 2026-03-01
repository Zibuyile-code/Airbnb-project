const path = require('path');
const util = require('util');
const fs = require('fs');
const fsPromises = require('fs').promises;

const unlinkFile = util.promisify(fs.unlink);

const catchAsync = require('./catchAsync');

/**
 * Creates a folder at the specified relative path.
 * Uses Node.js fs.promises.mkdir with recursive option to ensure all directories in the path are created.
 * Wrapped in catchAsync for error handling.
 * @param {string} relativePath - The relative path to create the folder at.
 * @returns {Promise<void>}
 */
exports.createFolder = catchAsync(async (relativePath) => {
  const fullPath = path.resolve(relativePath);
  await fsPromises.mkdir(fullPath, { recursive: true });
});

/**
 * Checks if a file exists at the given file path.
 * @param {string} filePath - The absolute path to the file.
 * @returns {Promise<boolean>} - True if file exists, false otherwise.
 */
const fileExists = async (filePath) => {
  try {
    await fsPromises.access(filePath);
    return true;
  } catch (err) {
    console.error(err);
    console.error('⛔ File does not exists');
    return false;
  }
};

/**
 * Deletes files at the given relative paths.
 * Skips empty input and missing files. Logs actions to console.
 * Wrapped in catchAsync for error handling.
 * @param {string[]} imageFilePath - Array of relative file paths to delete.
 * @returns {Promise<void>}
 */
exports.deleteFiles = catchAsync(async (imageFilePath = []) => {
  if (imageFilePath.length === 1 && imageFilePath[0] === '') {
    return;
  }
  const deletions = imageFilePath.map(async (relativePath) => {
    // file = uploads/accommodations/id/filename
    const absolutePath = path.resolve(relativePath);
    if (await fileExists(absolutePath)) {
      await unlinkFile(absolutePath);
      console.log(`Deleted ${relativePath}`);
    } else {
      console.log(`⚠️ Skipped missing file: ${relativePath}`);
    }
  });
  await Promise.all(deletions);
});
