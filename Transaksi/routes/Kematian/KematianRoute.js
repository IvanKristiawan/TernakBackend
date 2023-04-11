const express = require("express");
const controller = require("../../controllers/Kematian/KematianController.js");
const verify = require("../../../utils/verifyToken.js");
const getKematians = controller.getKematians;
const getKematianById = controller.getKematianById;
const saveKematian = controller.saveKematian;
const updateKematian = controller.updateKematian;
const deleteKematian = controller.deleteKematian;
const verifyUser = verify.verifyUser;

const router = express.Router();

router.post("/belisChild", verifyUser, getKematians);
router.post("/belisChild/:id", verifyUser, getKematianById);
router.post("/saveKematian", verifyUser, saveKematian);
router.post("/updateKematian/:id", verifyUser, updateKematian);
router.post("/deleteKematian/:id", verifyUser, deleteKematian);

module.exports = router;
