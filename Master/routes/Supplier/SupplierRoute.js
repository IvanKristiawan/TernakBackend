const express = require("express");
const controller = require("../../controllers/Supplier/SupplierController.js");
const verify = require("../../../utils/verifyToken.js");
const getSuppliers = controller.getSuppliers;
const getSupplierNextKode = controller.getSupplierNextKode;
const getSupplierById = controller.getSupplierById;
const saveSupplier = controller.saveSupplier;
const updateSupplier = controller.updateSupplier;
const deleteSupplier = controller.deleteSupplier;
const verifyUser = verify.verifyUser;

const router = express.Router();

router.post("/suppliers", verifyUser, getSuppliers);
router.post("/supplierNextKode", verifyUser, getSupplierNextKode);
router.post("/suppliers/:id", verifyUser, getSupplierById);
router.post("/saveSupplier", verifyUser, saveSupplier);
router.post("/updateSupplier/:id", verifyUser, updateSupplier);
router.post("/deleteSupplier/:id", verifyUser, deleteSupplier);

module.exports = router;
