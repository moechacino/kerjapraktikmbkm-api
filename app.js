require("dotenv").config();
require("express-async-errors");
const { connectDB } = require("./db/connect");
const express = require("express");
const app = express();
const cors = require("cors");

const notFound = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const mahasiswa = require("./routes/mahasiswa");
const dosen = require("./routes/dosen");
// middleware
app.use(cors());
app.use(express.json());

// routess
app.use("/api/v1/mbkm/mahasiswa", mahasiswa);
app.use("/api/v1/mbkm/dosen", dosen);
app.use(notFound);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 8000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`server is lsitening on port ${port}`));
  } catch (err) {
    console.log(err);
  }
};

start();
