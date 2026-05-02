const express = require("express");
const cors = require("cors");

const vendorRoutes = require("./routes/vendorRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", vendorRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});