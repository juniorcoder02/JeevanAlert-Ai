const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectdb = require("./config/db");

dotenv.config();
connectdb();

const app = express();
app.use(cors());
app.use(express.json());

// sample api endpoint
app.get("/", (req, res) => {
  res.send("JeevanAlert - Ai is running");
});

// port
const port = process.env.PORT || 5000;

// start server
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
  console.log(`http://localhost:${port}`);
});
