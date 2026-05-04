import { app } from "./app.js";

// const host = "localhost";
// const host = "0.0.0.0";

const port = 8010;

// start server
app.listen(port, () => {
  console.log(`Server listens on port ${port}`);
});
