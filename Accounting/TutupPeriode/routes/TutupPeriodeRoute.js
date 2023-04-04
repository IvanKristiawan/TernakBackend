const express = require("express");
const controller = require("../../TutupPeriode/controllers/TutupPeriodeController.js");
const verify = require("../../../utils/verifyToken.js");
const getTutupPeriodes = controller.getTutupPeriodes;
const getTutupPeriodesAsc = controller.getTutupPeriodesAsc;
const getTutupPeriodeByNamaPeriode = controller.getTutupPeriodeByNamaPeriode;
const getTutupPeriodeById = controller.getTutupPeriodeById;
const getLastTutupPeriode = controller.getLastTutupPeriode;
const getLastTutupPeriodeNoFormatDate =
  controller.getLastTutupPeriodeNoFormatDate;
const saveLastTutupPeriode = controller.saveLastTutupPeriode;
const saveTutupPeriode = controller.saveTutupPeriode;
const updateTutupPeriode = controller.updateTutupPeriode;
const deleteTutupPeriode = controller.deleteTutupPeriode;
const verifyUser = verify.verifyUser;

const router = express.Router();

router.post("/tutupPeriodes", verifyUser, getTutupPeriodes);
router.post("/tutupPeriodesAsc", verifyUser, getTutupPeriodesAsc);
router.post(
  "/tutupPeriodeByNamaPeriode",
  verifyUser,
  getTutupPeriodeByNamaPeriode
);
router.post("/tutupPeriodes/:id", verifyUser, getTutupPeriodeById);
router.post("/lastTutupPeriode", verifyUser, getLastTutupPeriode);
router.post(
  "/lastTutupPeriodeNoFormatDate",
  verifyUser,
  getLastTutupPeriodeNoFormatDate
);
router.post("/saveLastTutupPeriode", verifyUser, saveLastTutupPeriode);
router.post("/saveTutupPeriode", verifyUser, saveTutupPeriode);
router.post("/updateTutupPeriode/:id", verifyUser, updateTutupPeriode);
router.post("/deleteTutupPeriode/:id", verifyUser, deleteTutupPeriode);

module.exports = router;
