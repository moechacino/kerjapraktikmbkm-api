const Mahasiswa = require("../models/Mahasiswa");
const { BadRequestError } = require("../errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
//registrasi
const createMahasiswa = async (req, res) => {
  let data = req.body;
  if (!data.tanggalLahir) {
  }
  if (data.password.length < 8) {
    throw new BadRequestError("password minimal 8 karakter");
  }
  const hashedPassword = await bcrypt.hash(data.password, 10);
  data.password = hashedPassword;
  if ((await Mahasiswa.find({ nrp: data.nrp })).length !== 0) {
    throw new BadRequestError("NRP sudah digunakan akun lain");
  }
  if ((await Mahasiswa.find({ username: data.username })).length !== 0) {
    throw new BadRequestError("username sudah digunakan");
  }
  if ((await Mahasiswa.find({ email: data.email })).length !== 0) {
    throw new BadRequestError("Email sudah digunakan");
  }
  const mahasiswa = await Mahasiswa.create(data);

  res.status(201).json(mahasiswa);
};

//login
const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new BadRequestError("Please input username and password");
  }

  const mahasiswa = await Mahasiswa.findOne({ username });
  if (mahasiswa && bcrypt.compareSync(password, mahasiswa.password)) {
    const { _id } = mahasiswa;
    const token = jwt.sign(
      {
        id: _id,
        username,
        nama: mahasiswa.nama,
        nrp: mahasiswa.nrp,
        prodi: mahasiswa.prodi,
        status: mahasiswa.status,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    res.status(200).json({
      msg: "login success",
      data: {
        id: _id,
        username,
        nama: mahasiswa.nama,
        nrp: mahasiswa.nrp,
        prodi: mahasiswa.prodi,
        status: mahasiswa.status,
      },
      token,
    });
  } else {
    throw new BadRequestError("wrong username and password");
  }
};

const changePassword = async (req, res) => {
  const { id } = req.user;
  const { currentPassword, newPassword } = req.body;
  const mahasiswa = await Mahasiswa.findById(id);

  if (!mahasiswa) {
    throw new BadRequestError("Mahasiswa tidak ditemukan");
  }

  if (bcrypt.compareSync(currentPassword, mahasiswa.password)) {
    if (newPassword.length < 8) {
      res.json({ msg: "Panjang kata sandi baru harus minimal 8" });
    } else {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const updatedMahasiswa = await Mahasiswa.findByIdAndUpdate(id, {
        password: hashedPassword,
      });

      if (!updatedMahasiswa) {
        throw new BadRequestError("Gagal mengubah kata sandi Mahasiswa");
      }

      res
        .status(200)
        .json({ message: "Kata sandi berhasil diubah", updatedMahasiswa });
    }
  } else {
    throw new BadRequestError("Kata sandi saat ini tidak valid");
  }
};

module.exports = { createMahasiswa, login, changePassword };
