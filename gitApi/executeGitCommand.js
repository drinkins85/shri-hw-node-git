const { spawn } = require('child_process');

module.exports = function (command, options) {
  return new Promise((resolve, reject) => {
    const git = spawn('git', command, options);
    const out = [];
    git.stdout.on('data', (data) => {
      out.push(data);
    });
    git.stderr.on('data', (data) => {
      out.push(data);
    });
    git.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`${out} child process exited with code ${code}`));
      }
      return resolve(out.toString());
    });
  });
};
