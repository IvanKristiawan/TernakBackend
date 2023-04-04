const User = require("../models/UserModel.js");
const HakAkses = require("../models/HakAkses/HakAksesModel.js");
const TutupPeriode = require("../../Accounting/TutupPeriode/models/TutupPeriodeModel.js");
const Cabang = require("../../Master/models/Cabang/CabangModel.js");
const { createError } = require("../../utils/error.js");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    Object.keys(req.body).forEach(function (k) {
      if (typeof req.body[k] == "string") {
        req.body[k] = req.body[k].toUpperCase().trim();
      }
    });
    const periode = await TutupPeriode.findOne({
      where: {
        namaPeriode: req.body.namaPeriode,
      },
    });

    const newUser = await User.create({
      username: req.body.username,
      password: req.body.password,
      tipeUser: req.body.tipeUser,
      periodeId: periode.id,
      cabangId: req.body.cabangId,
    });

    const insertedHakAkses = await HakAkses.create({
      ...req.body.akses,
      userId: newUser.dataValues.id,
    });

    res.status(200).send(`User ${req.body.username} has been created.`);
  } catch (error) {
    // Error 400 = Kesalahan dari sisi user
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.body.username,
      },
      include: [{ model: Cabang }, { model: TutupPeriode }],
    });
    if (!user) return next(createError(404, "User not found!"));

    if (req.body.password !== user.password) {
      return next(createError(400, "Username atau Password Salah!"));
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT, {
      expiresIn: "15d",
    });

    const { password, ...otherDetails } = user.dataValues;

    const hakAkses = await HakAkses.findOne({
      where: {
        userId: user.dataValues.id,
      },
    });

    res.status(200).json({
      details: {
        ...otherDetails,
        token,
        akses: hakAkses,
      },
    });
  } catch (error) {
    // Error 400 = Kesalahan dari sisi user
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
};
