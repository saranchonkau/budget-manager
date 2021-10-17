const { app } = require("./app");

app.build().then(() => {
  process.exit();
});
