const Dosen = require("../models/Dosen");
const { BadRequestError } = require("../errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

//registrasi
const createDosen = async (req, res) => {
  const nipCollection = mongoose.connection.db.collection("nips");
  const data = req.body;
  if (Object.keys(data).length === 0) {
    throw new BadRequestError("Data is empty");
  }
  if (data.password.length < 8) {
    throw new BadRequestError("password minimal 8 karakter");
  }
  const existingNIPs = await nipCollection.find({ nip: data.nip }).toArray();

  if (existingNIPs.length === 0) {
    throw new BadRequestError("NIP Tidak Terdaftar");
  } else {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;
    if ((await Dosen.find({ nip: data.nip })).length !== 0) {
      throw new BadRequestError("NIP sudah digunakan");
    }

    if ((await Dosen.find({ username: data.username })).length !== 0) {
      throw new BadRequestError("Username sudah digunakan");
    }
    const dosen = await Dosen.create(data);

    res.status(201).json(dosen);
  }
};

//login
const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new BadRequestError("Please input username and password");
  }

  const dosen = await Dosen.findOne({ username });
  if (dosen && bcrypt.compareSync(password, dosen.password)) {
    const { _id } = dosen;
    const token = jwt.sign(
      {
        id: _id,
        username,
        nama: dosen.nama,
        nip: dosen.nip,
        prodi: dosen.prodi,
        status: dosen.status,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    res.status(200).json({ msg: "login success", token });
  } else {
    throw new BadRequestError("wrong username and password");
  }
};

const changePassword = async (req, res) => {
  const { id } = req.user;
  const { currentPassword, newPassword } = req.body;
  const dosen = await Dosen.findById(id);

  if (!dosen) {
    throw new BadRequestError("Dosen tidak ditemukan");
  }

  if (bcrypt.compareSync(currentPassword, dosen.password)) {
    if (newPassword.length < 8) {
      res.json({ msg: "Panjang kata sandi baru harus minimal 8" });
    } else {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const updatedDosen = await Dosen.findByIdAndUpdate(id, {
        password: hashedPassword,
      });

      if (!updatedDosen) {
        throw new BadRequestError("Gagal mengubah kata sandi Dosen");
      }

      res
        .status(200)
        .json({ message: "Kata sandi berhasil diubah", updatedDosen });
    }
  } else {
    throw new BadRequestError("Kata sandi saat ini tidak valid");
  }
};

module.exports = { createDosen, login, changePassword };
