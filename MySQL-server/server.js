const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");
const mysql = require("mysql2");

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`port is running at ${port}`);
});
