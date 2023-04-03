const express = require("express");
const controller = require("../../controllers/GroupStok/GroupStokController.js");
const verify = require("../../../utils/verifyToken.js");
const getGroupStoks = controller.getGroupStoks;
const getGroupStokById = controller.getGroupStokById;
const saveGroupStok = controller.saveGroupStok;
const updateGroupStok = controller.updateGroupStok;
const deleteGroupStok = controller.deleteGroupStok;
const verifyUser = verify.verifyUser;

const router = express.Router();

router.post("/groupStoks", verifyUser, getGroupStoks);
router.post("/groupStoks/:id", verifyUser, getGroupStokById);
router.post("/saveGroupStok", verifyUser, saveGroupStok);
router.post("/updateGroupStok/:id", verifyUser, updateGroupStok);
router.post("/deleteGroupStok/:id", verifyUser, deleteGroupStok);

module.exports = router;
