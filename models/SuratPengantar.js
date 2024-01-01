const mongoose = require("mongoose");

const SuratPengantarSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: [true, "Sertakan nama file"],
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

const SuratPengantar = mongoose.model("SuratPengantar", SuratPengantarSchema);

module.exports = SuratPengantar;
