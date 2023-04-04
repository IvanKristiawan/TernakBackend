const express = require("express");
const controller = require("../../../controllers/Pembelian/Beli/BeliController");
const verify = require("../../../../utils/verifyToken.js");
const getBelis = controller.getBelis;
const getBeliNextKode = controller.getBeliNextKode;
const getBeliById = controller.getBeliById;
const saveBeli = controller.saveBeli;
const updateBeli = controller.updateBeli;
const deleteBeli = controller.deleteBeli;
const verifyUser = verify.verifyUser;

const router = express.Router();

router.post("/belis", verifyUser, getBelis);
router.post("/beliNextKode", verifyUser, getBeliNextKode);
router.post("/belis/:id", verifyUser, getBeliById);
router.post("/saveBeli", verifyUser, saveBeli);
router.post("/updateBeli/:id", verifyUser, updateBeli);
router.post("/deleteBeli/:id", verifyUser, deleteBeli);

module.exports = router;
