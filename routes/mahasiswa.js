const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
const {
  createMahasiswa,
  login,
  changePassword,
} = require("../controllers/mahasiswa");

const {
  createOnePengajuanKP,
  getAllPengajuanKP,
  deletePengajuanKP,
  getAllSuratPengantar,
} = require("../controllers/pengajuankp");

const {
  createOneSuratPernyataan,
  getAllSuratPernyataan,
  deleteOneSuratPernyataan,
} = require("../controllers/suratPernyataan");
const {
  createOneLaporan,
  getAllLaporan,
  deleteLaporan,
} = require("../controllers/laporan");
const authenticationMiddleware = require("../middleware/auth");

router.route("/changepassword").post(authenticationMiddleware, changePassword);
router
  .route("/pengajuankp")
  .post(authenticationMiddleware, upload.single("file"), createOnePengajuanKP)
  .get(authenticationMiddleware, getAllPengajuanKP);

router
  .route("/pengajuankp/delete/:id")
  .delete(authenticationMiddleware, deletePengajuanKP);

router
  .route("/suratpengantar")
  .get(authenticationMiddleware, getAllSuratPengantar);

router
  .route("/suratpernyataan")
  .post(
    authenticationMiddleware,
    upload.single("file"),
    createOneSuratPernyataan
  )
  .get(authenticationMiddleware, getAllSuratPernyataan);

router
  .route("/suratpernyataan/delete/:id")
  .delete(authenticationMiddleware, deleteOneSuratPernyataan);

router
  .route("/laporan")
  .post(authenticationMiddleware, upload.single("file"), createOneLaporan)
  .get(authenticationMiddleware, getAllLaporan);

router
  .route("/laporan/delete/:id")
  .delete(authenticationMiddleware, deleteLaporan);

router.route("/login").post(login);
router.route("/register").post(createMahasiswa);

module.exports = router;
