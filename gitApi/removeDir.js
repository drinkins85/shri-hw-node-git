const rimraf = require('rimraf');

function removeDir(path) {
  return new Promise((resolve, reject) => {
    rimraf(path, (err) => {
      if (err) {
        reject(err);
      }
      resolve(path);
    });
  });
}

module.exports = removeDir;

