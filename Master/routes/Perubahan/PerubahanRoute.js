const express = require("express");
const controller = require("../../controllers/Perubahan/PerubahanController.js");
const verify = require("../../../utils/verifyToken.js");
const getPerubahans = controller.getPerubahans;
const getPerubahanById = controller.getPerubahanById;
const savePerubahan = controller.savePerubahan;
const updatePerubahan = controller.updatePerubahan;
const deletePerubahan = controller.deletePerubahan;
const verifyUser = verify.verifyUser;

const router = express.Router();

router.post("/perubahans", verifyUser, getPerubahans);
router.post("/perubahans/:id", verifyUser, getPerubahanById);
router.post("/savePerubahan", verifyUser, savePerubahan);
router.post("/updatePerubahan/:id", verifyUser, updatePerubahan);
router.post("/deletePerubahan/:id", verifyUser, deletePerubahan);

module.exports = router;
