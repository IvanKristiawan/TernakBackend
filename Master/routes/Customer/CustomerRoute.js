const express = require("express");
const controller = require("../../controllers/Customer/CustomerController.js");
const verify = require("../../../utils/verifyToken.js");
const getCustomers = controller.getCustomers;
const getCustomerNextKode = controller.getCustomerNextKode;
const getCustomerById = controller.getCustomerById;
const saveCustomer = controller.saveCustomer;
const updateCustomer = controller.updateCustomer;
const deleteCustomer = controller.deleteCustomer;
const verifyUser = verify.verifyUser;

const router = express.Router();

router.post("/customers", verifyUser, getCustomers);
router.post("/customerNextKode", verifyUser, getCustomerNextKode);
router.post("/customers/:id", verifyUser, getCustomerById);
router.post("/saveCustomer", verifyUser, saveCustomer);
router.post("/updateCustomer/:id", verifyUser, updateCustomer);
router.post("/deleteCustomer/:id", verifyUser, deleteCustomer);

module.exports = router;
