const express = require("express");
const controller = require("../../../controllers/Pembelian/BeliChild/BeliChildController.js");
const verify = require("../../../../utils/verifyToken.js");
const getBeliChilds = controller.getBeliChilds;
const getBeliChildByBeli = controller.getBeliChildByBeli;
const getBeliChildById = controller.getBeliChildById;
const saveBeliChild = controller.saveBeliChild;
const updateBeliChild = controller.updateBeliChild;
const deleteBeliChild = controller.deleteBeliChild;
const verifyUser = verify.verifyUser;

const router = express.Router();

router.post("/belisChild", verifyUser, getBeliChilds);
router.post("/belisChildByBeli", verifyUser, getBeliChildByBeli);
router.post("/belisChild/:id", verifyUser, getBeliChildById);
router.post("/saveBeliChild", verifyUser, saveBeliChild);
router.post("/updateBeliChild/:id", verifyUser, updateBeliChild);
router.post("/deleteBeliChild/:id", verifyUser, deleteBeliChild);

module.exports = router;
