const mongoose = require("mongoose");

const SuratPernyataanSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: [true, "Sertakan Nama"],
  },
  nrp: {
    type: String,
    required: [true, "Sertakan NRP"],
  },
  prodi: {
    type: String,
    required: [true, "Sertakan Program Studi"],
  },
  file: {
    type: String,
    required: [true, "Sertakan file"],
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: String,
    required: [true, "Created By is Empty"],
  },
});

const SuratPernyataan = mongoose.model(
  "SuratPernyataan",
  SuratPernyataanSchema
);

module.exports = SuratPernyataan;
