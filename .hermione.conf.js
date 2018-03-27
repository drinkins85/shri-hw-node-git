const config = require('./app.config');

const url = `http://${config.host}:${config.port}`;

module.exports = {
  baseUrl: url,
  sets: {
    desktop: {
      files: 'tests/desktop'
    }
  },
  browsers: {
    chrome: {
      desiredCapabilities: {
        browserName: 'chrome'
      }
    },
    firefox: {
      desiredCapabilities: {
        browserName: 'firefox'
      }
    } 
  }
};