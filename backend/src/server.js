import { app } from "./app.js";

const port = 8010;

// start server
app.listen(port, () => {
  console.log(`Server listens on port ${port}`);
});
