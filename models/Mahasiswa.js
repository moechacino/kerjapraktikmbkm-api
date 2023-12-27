const mongoose = require("mongoose");

const MahasiswaSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: [true, "Nama tidak boleh kosong"],
  },
  nrp: {
    type: String,
    required: [true, "NRP tidak boleh kosong"],
    unique: true,
  },
  prodi: {
    type: String,
    required: [true, "Prodi tidak boleh kosong"],
  },
  alamat: {
    type: String,
    required: [true, "Alamat tidak boleh kosong"],
  },
  noTelepon: {
    type: String,
    required: [true, "Nomor Telepon tidak boleh kosong"],
  },
  tanggalLahir: {
    type: Date,
    required: [true, "Tanggal Lahir tidak boleh kosong"],
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: "Isi email dengan tepat",
    },
    required: [true, "Email tidak boleh kosong"],
  },
  username: {
    type: String,
    required: [true, "Username tidak boleh kosong"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password tidak boleh kosong"],
  },
  status: { type: String, default: "Mahasiswa" },
});

module.exports = mongoose.model("Mahasiswa", MahasiswaSchema);
