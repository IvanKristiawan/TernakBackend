const express = require("express");
const controller = require("../../controllers/Stok/StokController.js");
const verify = require("../../../utils/verifyToken.js");
const getStoks = controller.getStoks;
const getStokById = controller.getStokById;
const getStokByNama = controller.getStokByNama;
const saveStok = controller.saveStok;
const updateStok = controller.updateStok;
const deleteStok = controller.deleteStok;
const verifyUser = verify.verifyUser;

const router = express.Router();

router.post("/stoks", verifyUser, getStoks);
router.post("/stoks/:id", verifyUser, getStokById);
router.post("/stokByNama", verifyUser, getStokByNama);
router.post("/saveStok", verifyUser, saveStok);
router.post("/updateStok/:id", verifyUser, updateStok);
router.post("/deleteStok/:id", verifyUser, deleteStok);

module.exports = router;
