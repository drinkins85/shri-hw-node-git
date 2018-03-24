const fs = require('fs');

function checkDir(path) {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (!err) {
        if (!stats.isDirectory()) {
          reject();
        }
        resolve();
      }
      reject();
    });
  });
}
module.exports = checkDir;

