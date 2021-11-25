// Sync object
/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  moduleNameMapper: {
    // according to PHD paper https://medium.com/@martin_hotell/tree-shake-lodash-with-webpack-jest-and-typescript-2734fa13b5cd
    "^lodash-es$": "<rootDir>/../../node_modules/lodash/index.js",
    "@/(.*)": "<rootDir>/src/$1",
  },
};

module.exports = config;
