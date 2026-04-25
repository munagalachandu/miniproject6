const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDatabase = require("./utils/db");
const dataRoutes = require("./routes/dataRoutes");
const plantRoutes = require("./routes/plantRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Smart Plant Monitoring API is running" });
});

app.use("/data", dataRoutes);
app.use("/plant", plantRoutes);

connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  });
