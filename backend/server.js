import { app } from "./app.js";

const host = "localhost";
const port = 8010;

// start server
app.listen(port, host, () => {
  console.log(`Server listens http://${host}:${port}`);
});
