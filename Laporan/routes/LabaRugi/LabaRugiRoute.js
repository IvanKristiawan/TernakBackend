const express = require("express");
const controller = require("../../controllers/LabaRugi/LabaRugiController.js");
const verify = require("../../../utils/verifyToken.js");
const getLaporanLabaRugi = controller.getLaporanLabaRugi;
const verifyUser = verify.verifyUser;

const router = express.Router();

router.post("/laporanLabaRugi", verifyUser, getLaporanLabaRugi);

module.exports = router;
