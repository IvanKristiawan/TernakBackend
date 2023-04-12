const express = require("express");
const controller = require("../../controllers/LaporanKematian/LaporanKematianController.js");
const verify = require("../../../utils/verifyToken.js");
const getLaporanKematian = controller.getLaporanKematian;
const verifyUser = verify.verifyUser;

const router = express.Router();

router.post("/laporanKematian", verifyUser, getLaporanKematian);

module.exports = router;
