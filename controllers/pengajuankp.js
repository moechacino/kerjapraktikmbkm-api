require("dotenv").config();
const Pengajuan = require("../models/Pengajuan");
const SuratPengantar = require("../models/SuratPengantar");
const { BadRequestError } = require("../errors");
const s3 = require("../db/s3");
const { GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const BUCKET_NAME = process.env.BUCKET_NAME;

const createOnePengajuanKP = async (req, res) => {
  if (req.user.status !== "Mahasiswa") {
    throw new BadRequestError("Bukan Mahasiswa!");
  } else {
    let data = req.body;
    if (
      !Object.values(data).every(
        (value) => value !== null && value !== undefined && value !== ""
      )
    ) {
      throw new BadRequestError("data ada yang kosong");
    }
    let msg = "";
    const params = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: `${req.user.prodi}/Pengajuan KP/${req.user.username}_KP_${req.file.originalname}`,
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
      Key: `${req.user.prodi}/Pengajuan KP/${req.user.username}_KP_${req.file.originalname}`,
    };
    //get url pdf
    const command = new GetObjectCommand(objectParams);

    const url = await getSignedUrl(s3, command);
    //create database pengajuan kp

    const pengajuan = await Pengajuan.create({
      anggotaKP: data.anggotaKP,
      tempatKP: data.tempatKP,
      proposal: url,
      pengajuanSuratKepada: data.pengajuanSuratKepada,
      tanggalPengajuan: data.tanggalPengajuan,
      createdBy: req.user.username,
      prodi: req.user.prodi,
    });

    res.status(201).json({ pengajuan, msg: msg });
  }
};

const getAllPengajuanKP = async (req, res) => {
  if (req.user.status === "Mahasiswa") {
    const pengajuan = await Pengajuan.find({
      createdBy: req.user.username,
    });

    res.status(201).json(pengajuan);
  } else if (req.user.status === "Dosen") {
    const pengajuan = await Pengajuan.find({ prodi: req.user.prodi });

    res.status(201).json(pengajuan);
  } else {
    throw new BadRequestError("Status Unavailable");
  }
};

const getOnePengajuanKP = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new BadRequestError("id is needed");
  }
  const pengajuan = await Pengajuan.findById(id);
  if (!pengajuan) {
    throw new BadRequestError("Pengajuan KP tidak ditemukan");
  }
  res.json(pengajuan);
};

const editPengajuanKP = async (req, res) => {
  if (req.user.status === "Dosen") {
    const { statusPengajuan, id } = req.params;
    if (statusPengajuan === "accept" || statusPengajuan === "reject") {
      const pengajuan = await Pengajuan.findByIdAndUpdate(
        id,
        {
          status:
            statusPengajuan === "accept"
              ? "Diterima"
              : statusPengajuan === "reject"
              ? "Ditolak"
              : "Status tidak valid",
        },
        { new: true }
      );

      if (!pengajuan) {
        throw new BadRequestError("Pengajuan tidak ditemukan");
      }

      res.status(200).json({
        message: "Status pengajuan berhasil diubah",
        updatedPengajuan: pengajuan,
      });
    } else {
      throw new BadRequestError("wrong status params");
    }
  } else {
    throw new BadRequestError(
      "Anda tidak memiliki izin untuk mengubah status pengajuan"
    );
  }
};

const deletePengajuanKP = async (req, res) => {
  if (req.user.status !== "Mahasiswa") {
    throw new BadRequestError(
      "Hanya mahasiswa yang memiliki izin untuk menghapus"
    );
  } else {
    const id = req.params.id;
    const pengajuan = await Pengajuan.findByIdAndDelete(id);
    if (!pengajuan) {
      throw new BadRequestError("Pengajuan tidak ditemukan");
    }

    res.status(201).json(pengajuan);
  }
};

const createSuratPengantar = async (req, res) => {
  const { username, status, prodi } = req.user;
  if (status !== "Dosen") {
    throw new BadRequestError("Tidak memiliki akses");
  } else {
    if (!req.file) {
      throw new BadRequestError("File Missing");
    }
    let msg = "";
    const params = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: `${prodi}/Surat Pengantar/${req.file.originalname}`,
      Body: req.file.buffer,
    });
    const objectParams = {
      Bucket: BUCKET_NAME,
      Key: `${prodi}/Surat Pengantar/${req.file.originalname}`,
    };

    try {
      //uploading file
      await s3.send(params);
      msg = "File Uploaded";
    } catch (err) {
      throw new BadRequestError("Error uploading");
    }
    //get url pdf
    const command = new GetObjectCommand(objectParams);
    const url = await getSignedUrl(s3, command);
    const suratPengantar = await SuratPengantar.create({
      prodi: prodi,
      file: url,
      createdBy: username,
    });
    res.json({ suratPengantar, msg: msg });
  }
};

const getAllSuratPengantar = async (req, res) => {
  const { status, prodi } = req.user;
  if (!status) {
    throw new BadRequestError("Status is needed");
  } else {
    const suratPengantar = await SuratPengantar.find({
      prodi: prodi,
    });
    if (suratPengantar)
      res.status(200).json({ suratPengantar, msg: "Mendapatkan Data" });
    else throw new BadRequestError("Gagal mendapatkan data");
  }
};

module.exports = {
  createOnePengajuanKP,
  getAllPengajuanKP,
  getOnePengajuanKP,
  editPengajuanKP,
  deletePengajuanKP,
  createSuratPengantar,
  getAllSuratPengantar,
};
