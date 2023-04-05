const express = require("express");
const controller = require("../../controllers/LaporanPembelian/LaporanPembelianController.js");
const verify = require("../../../utils/verifyToken.js");
const getLaporanPembelian = controller.getLaporanPembelian;
const verifyUser = verify.verifyUser;

const router = express.Router();

router.post("/laporanPembelian", verifyUser, getLaporanPembelian);

module.exports = router;
