const express = require("express");
const content = require("../controllers/UserController.js");
const content2 = require("../../utils/verifyToken.js");
const updateUser = content.updateUser;
const updateUserThenLogin = content.updateUserThenLogin;
const deleteUser = content.deleteUser;
const getUser = content.getUser;
const getUsers = content.getUsers;
const getUsername = content.getUsername;
const getKodeKwitansi = content.getKodeKwitansi;
const getUsersPerCabang = content.getUsersPerCabang;
const verifyUser = content2.verifyUser;
const router = express.Router();

// UPDATE
router.post("/users/:id", verifyUser, updateUser);
router.post("/updateUserThenLogin/:id", verifyUser, updateUserThenLogin);
// DELETE
router.post("/users/deleteUser/:id", verifyUser, deleteUser);
// GET
router.post("/findUser/:id", verifyUser, getUser);
// GET ALL
router.post("/users/", verifyUser, getUsers);
router.post("/getUsername", verifyUser, getUsername);
router.post("/getKodeKwitansi", verifyUser, getKodeKwitansi);
router.post("/usersPerCabang/", verifyUser, getUsersPerCabang);

module.exports = router;
