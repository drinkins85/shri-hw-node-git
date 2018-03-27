module.exports = {
  "env": {
    "browser": true,
  },
  "extends": "airbnb-base",
  "rules": {
    "no-use-before-define": ["error", { "functions": false, "classes": true }],
    "func-names": "off",
    "import/no-extraneous-dependencies": ["error", {"devDependencies": ["**/*webpack*.js", "**/*.config.js", "**/*.test.js"], "optionalDependencies": false, "peerDependencies": false}],
    "no-shadow": "off",
    "no-console": "off",
    "max-len": ["error", 120],
    "no-plusplus": "off",
    "linebreak-style": "off",
    "no-unused-vars": "off",
    "global-require": "off",
    "class-methods-use-this": "off",
    "prefer-destructuring": "off",
    "no-param-reassign": "off",
    "no-useless-escape": "off",
    "prefer-promise-reject-errors": "off",
    "default-case": "off",
    "arrow-body-style": "off",
    "no-undef": "off"
  }
};