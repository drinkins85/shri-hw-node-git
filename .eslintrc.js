module.exports = {
  "env": {
    "browser": true,
  },
  "extends": "airbnb-base",
  "rules": {
    "no-use-before-define": ["error", { "functions": false, "classes": true }],
    "func-names": "off",
    "import/no-extraneous-dependencies": ["error", {"devDependencies": ["**/*webpack*.js", "**/*.config.js"], "optionalDependencies": false, "peerDependencies": false}],
    "no-shadow": "off",
    "no-console": "off",
    "max-len": ["error", 120],
    "no-plusplus": "off",
    "linebreak-style": "off",
    "no-unused-vars": "off",
    "global-require": "off",
    "class-methods-use-this": "off"
  }
};