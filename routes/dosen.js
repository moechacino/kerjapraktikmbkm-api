const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
const authenticationMiddleware = require("../middleware/auth");
const { createDosen, login, changePassword } = require("../controllers/dosen");

const {
  getAllPengajuanKP,
  getAllSuratPengantar,
  editPengajuanKP,
  createSuratPengantar,
  getOnePengajuanKP,
} = require("../controllers/pengajuankp");

const { getAllSuratPernyataan } = require("../controllers/suratPernyataan");

const {
  getAllLaporan,
  editStatusLaporan,
  getOneLaporan,
} = require("../controllers/laporan");

router.route("/login").post(login);
router.route("/register").post(createDosen);
router.route("/changepassword").post(authenticationMiddleware, changePassword);

router.route("/pengajuankp").get(authenticationMiddleware, getAllPengajuanKP);

router
  .route("/pengajuankp/:statusPengajuan/:id")
  .patch(authenticationMiddleware, editPengajuanKP);
router
  .route("/pengajuankp/:id")
  .get(authenticationMiddleware, getOnePengajuanKP);

router
  .route("/suratpengantar")
  .get(authenticationMiddleware, getAllSuratPengantar)
  .post(authenticationMiddleware, upload.single("file"), createSuratPengantar);

router
  .route("/suratpernyataan")
  .get(authenticationMiddleware, getAllSuratPernyataan);

router.route("/laporan").get(authenticationMiddleware, getAllLaporan);
router.route("/laporan/:id").get(authenticationMiddleware, getOneLaporan);

router
  .route("/laporan/edit/:id")
  .patch(authenticationMiddleware, editStatusLaporan);

module.exports = router;
