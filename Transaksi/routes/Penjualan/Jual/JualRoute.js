const express = require("express");
const controller = require("../../../controllers/Penjualan/Jual/JualController.js");
const verify = require("../../../../utils/verifyToken.js");
const getJuals = controller.getJuals;
const getJualNextKode = controller.getJualNextKode;
const getJualById = controller.getJualById;
const saveJual = controller.saveJual;
const updateJual = controller.updateJual;
const deleteJual = controller.deleteJual;
const verifyUser = verify.verifyUser;

const router = express.Router();

router.post("/juals", verifyUser, getJuals);
router.post("/jualNextKode", verifyUser, getJualNextKode);
router.post("/juals/:id", verifyUser, getJualById);
router.post("/saveJual", verifyUser, saveJual);
router.post("/updateJual/:id", verifyUser, updateJual);
router.post("/deleteJual/:id", verifyUser, deleteJual);

module.exports = router;
