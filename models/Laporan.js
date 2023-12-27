const mongoose = require("mongoose");

const LaporanSchema = new mongoose.Schema({
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
  status: {
    type: String,
    enum: ["Diterima", "Ditolak", "Menunggu"],
    default: "Menunggu",
  },
  commentar: { type: String, default: "" },
});

const Laporan = mongoose.model("Laporan", LaporanSchema);

module.exports = Laporan;
