const express = require("express");
const controller = require("../../controllers/LaporanPenjualan/LaporanPenjualanController.js");
const verify = require("../../../utils/verifyToken.js");
const getLaporanPenjualan = controller.getLaporanPenjualan;
const verifyUser = verify.verifyUser;

const router = express.Router();

router.post("/laporanPenjualan", verifyUser, getLaporanPenjualan);

module.exports = router;
