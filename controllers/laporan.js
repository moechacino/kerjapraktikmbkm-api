require("dotenv").config();
const Laporan = require("../models/Laporan");
const { BadRequestError } = require("../errors");
const s3 = require("../db/s3");
const { GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const BUCKET_NAME = process.env.BUCKET_NAME;
const ObjectId = require("mongoose").Types.ObjectId;

const createOneLaporan = async (req, res) => {
  const { username, nama, nrp, prodi, status } = req.user;
  if (status !== "Mahasiswa") {
    throw new BadRequestError("Bukan Mahasiswa");
  } else {
    if (!req.file) {
      throw new BadRequestError("File Kosong");
    }
    let msg = "";
    const params = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: `${req.user.prodi}/Laporan/${req.user.username}_Laporan_${req.file.originalname}`,
      Body: req.file.buffer,
    });
    try {
      //uploading file
      await s3.send(params);

      msg = "File Uploaded";
    } catch {
      throw new BadRequestError("Error Uploading File");
    }
    const objectParams = {
      Bucket: BUCKET_NAME,
      Key: `${req.user.prodi}/Laporan/${req.user.username}_Laporan_${req.file.originalname}`,
    };
    //get url pdf
    const command = new GetObjectCommand(objectParams);

    const url = await getSignedUrl(s3, command);

    const laporan = await Laporan.create({
      nama: nama,
      nrp: nrp,
      prodi: prodi,
      file: url,
      createdBy: username,
    });
    res.status(201).json({ laporan, msg: msg });
  }
};

const getAllLaporan = async (req, res) => {
  const { username, nama, nrp, prodi, status } = req.user;
  if (!username) {
    throw new BadRequestError("username is needed");
  } else {
    if (status === "Mahasiswa") {
      const laporan = await Laporan.find({
        createdBy: username,
      });

      res.json(laporan);
    } else if (status === "Dosen") {
      const laporan = await Laporan.find({
        prodi: prodi,
      });

      res.json(laporan);
    } else {
      throw new BadRequestError("status is needed");
    }
  }
};

const getOneLaporan = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new BadRequestError("id is needed");
  }
  const laporan = await Laporan.findById(id);
  if (!laporan) {
    throw new BadRequestError("Laporan tidak ditemukan");
  }
  res.json(laporan);
};

const deleteLaporan = async (req, res) => {
  const { status } = req.user;
  if (status !== "Mahasiswa") {
    throw new BadRequestError("Bukan Mahasiswa");
  }

  const id = req.params.id;
  const laporan = await Laporan.findByIdAndDelete(id);
  if (!laporan) {
    throw new BadRequestError("Laporan tidak ditemukan");
  }

  res
    .status(200)
    .json({ message: "Laporan berhasil dihapus", deletedLaporan: laporan });
};

const editStatusLaporan = async (req, res) => {
  const { status } = req.user;
  if (status !== "Dosen") {
    throw new BadRequestError("Bukan Dosen");
  }

  const { id } = req.params;
  const { statusLaporan, commentar } = req.body;
  if (
    statusLaporan === "Diterima" ||
    statusLaporan === "Ditolak" ||
    statusLaporan === "Menunggu"
  ) {
    const laporan = await Laporan.findByIdAndUpdate(
      id,
      {
        status: statusLaporan,
        commentar: commentar,
      },
      { new: true }
    );

    if (!laporan) {
      throw new BadRequestError("Laporan tidak ditemukan");
    }

    res.status(200).json({ laporan, msg: "Updated" });
  } else {
    throw new BadRequestError("Error Changing Status");
  }
};

module.exports = {
  createOneLaporan,
  getAllLaporan,
  getOneLaporan,
  deleteLaporan,
  editStatusLaporan,
};
