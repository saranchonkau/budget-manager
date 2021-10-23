const bcrypt = require("bcrypt");

bcrypt.hash("1234567", 10).then(function (hash) {
  console.log("hash", hash);
  // Store hash in your password DB.
});
