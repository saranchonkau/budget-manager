import { app } from "./internal/app";

app.build().then(() => {
  process.exit();
});
