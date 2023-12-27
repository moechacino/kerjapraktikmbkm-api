const mongoose = require("mongoose");

const PengajuanSchema = new mongoose.Schema({
  anggotaKP: {
    type: String,
    required: [true, "Sertakan Nama dan NRP Anggota KP"],
  },
  tempatKP: {
    type: String,
    required: [true, "Tempat KP tidak boleh kosong"],
  },
  proposal: {
    type: String,
    required: [true, "Proposal tidak boleh kosong"],
  },
  pengajuanSuratKepada: {
    type: String,
    required: [true, "Surat permohonan tidak boleh kosong"],
  },
  tanggalPengajuan: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Diterima", "Ditolak", "Menunggu"],
    default: "Menunggu",
  },
  createdBy: {
    type: String,
    required: [true, "Created By Empty"],
  },
  prodi: String,
  
});

const Pengajuan = mongoose.model("Pengajuan", PengajuanSchema);

module.exports = Pengajuan;
