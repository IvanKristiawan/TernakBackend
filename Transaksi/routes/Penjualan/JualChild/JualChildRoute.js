const express = require("express");
const controller = require("../../../controllers/Penjualan/JualChild/JualChildController.js");
const verify = require("../../../../utils/verifyToken.js");
const getJualChilds = controller.getJualChilds;
const getJualChildByJual = controller.getJualChildByJual;
const getJualChildById = controller.getJualChildById;
const saveJualChild = controller.saveJualChild;
const updateJualChild = controller.updateJualChild;
const deleteJualChild = controller.deleteJualChild;
const verifyUser = verify.verifyUser;

const router = express.Router();

router.post("/jualsChild", verifyUser, getJualChilds);
router.post("/jualsChildByJual", verifyUser, getJualChildByJual);
router.post("/jualsChild/:id", verifyUser, getJualChildById);
router.post("/saveJualChild", verifyUser, saveJualChild);
router.post("/updateJualChild/:id", verifyUser, updateJualChild);
router.post("/deleteJualChild/:id", verifyUser, deleteJualChild);

module.exports = router;
