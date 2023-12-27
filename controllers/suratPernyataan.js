require("dotenv").config();
const SuratPernyataan = require("../models/SuratPernyataan");
const { BadRequestError } = require("../errors");
const s3 = require("../db/s3");
const { GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const BUCKET_NAME = process.env.BUCKET_NAME;

const createOneSuratPernyataan = async (req, res) => {
  const { username, nama, nrp, prodi, status } = req.user;
  if (status !== "Mahasiswa") {
    throw new BadRequestError("Bukan Mahasiswa");
  }
  if (!req.file) {
    throw new BadRequestError("File Kosong");
  }
  let msg = "";
  const params = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: `${req.user.prodi}/Surat Pernyataan/${req.user.username}_${req.file.originalname}`,
    Body: req.file.buffer,
  });
  try {
    //uploading file
    const response = await s3.send(params);

    msg = "File Uploaded";
  } catch {
    throw new BadRequestError("Error Uploading File");
  }
  const objectParams = {
    Bucket: BUCKET_NAME,
    Key: `${req.user.prodi}/Surat Pernyataan/${req.user.username}_${req.file.originalname}`,
  };
  //get url pdf
  const command = new GetObjectCommand(objectParams);

  const url = await getSignedUrl(s3, command);
  const suratPernyataan = await SuratPernyataan.create({
    nama: nama,
    nrp: nrp,
    prodi: prodi,
    file: url,
    createdBy: username,
  });

  res.status(201).json({ suratPernyataan, msg: msg });
};

const getAllSuratPernyataan = async (req, res) => {
  const { username, prodi, status } = req.user;

  if (status === "Mahasiswa") {
    if (!username) {
      throw new BadRequestError("username is needed");
    } else {
      const suratPernyataan = await SuratPernyataan.find({
        createdBy: username,
      });

      res.status(200).json(suratPernyataan);
    }
  } else if (status === "Dosen") {
    const suratPernyataan = await SuratPernyataan.find({ prodi: prodi });
    res.status(200).json(suratPernyataan);
  } else {
    throw new BadRequestError("Status Unavailable");
  }
};

const deleteOneSuratPernyataan = async (req, res) => {
  if (req.user.status !== "Mahasiswa") {
    throw new BadRequestError("Tidak memiliki akses");
  }
  const id = req.params.id;
  const suratPernyataan = await SuratPernyataan.findByIdAndDelete(id);
  if (!suratPernyataan) {
    throw new BadRequestError("Surat pernyataan tidak ditemukan");
  }
  res
    .status(200)
    .json({ deleted: suratPernyataan, msg: "succesfully deleted" });
};

module.exports = {
  createOneSuratPernyataan,
  getAllSuratPernyataan,
  deleteOneSuratPernyataan,
};
