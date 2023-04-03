const Cabang = require("../../models/Cabang/CabangModel.js");
const Setting = require("../../../Setting/models/SettingModel.js");
const { findNextKode } = require("../../../helper/helper");

const getCabangs = async (req, res) => {
  try {
    const cabangs = await Cabang.findAll({
      order: [["id", "ASC"]],
    });
    res.status(200).json(cabangs);
  } catch (error) {
    // Error 500 = Kesalahan di server
    res.status(500).json({ message: error.message });
  }
};

const getCabangNextKode = async (req, res) => {
  try {
    const cabangs = await Cabang.findAll();
    let nextKodeCabang = findNextKode(cabangs.length, 3);
    res.status(200).json(nextKodeCabang);
  } catch (error) {
    // Error 500 = Kesalahan di server
    res.status(500).json({ message: error.message });
  }
};

const getCabangById = async (req, res) => {
  try {
    const cabang = await Cabang.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(cabang);
  } catch (error) {
    // Error 404 = Not Found
    res.status(404).json({ message: error.message });
  }
};

const saveCabang = async (req, res) => {
  Object.keys(req.body).forEach(function (k) {
    if (typeof req.body[k] == "string") {
      req.body[k] = req.body[k].toUpperCase().trim();
    }
  });
  const cabangs = await Cabang.findAll();
  let nextKodeCabang = findNextKode(cabangs.length, 3);
  try {
    const insertedCabang = await Cabang.create({
      id: nextKodeCabang,
      ...req.body,
    });
    const settings = await Setting.findAll({
      where: {
        cabangId: nextKodeCabang,
      },
    });
    if (settings.length === 0) {
      const insertedSetting = await Setting.create({
        cabangId: nextKodeCabang,
      });
    }
    // Status 201 = Created
    res.status(201).json(insertedCabang);
  } catch (error) {
    // Error 400 = Kesalahan dari sisi user
    res.status(400).json({ message: error.message });
  }
};

const updateCabang = async (req, res) => {
  Object.keys(req.body).forEach(function (k) {
    if (typeof req.body[k] == "string") {
      req.body[k] = req.body[k].toUpperCase().trim();
    }
  });
  try {
    await Cabang.update(req.body, {
      where: {
        id: req.params.id,
      },
    }).then((num) => {
      // num come from numbers of updated data
      if (num == 1) {
        res.status(200).json({ message: "Cabang Updated!" });
      } else {
        res.status(400).json({ message: `Cabang ${req.params.id} not found!` });
      }
    });
  } catch (error) {
    // Error 400 = Kesalahan dari sisi user
    res.status(400).json({ message: error.message });
  }
};

const deleteCabang = async (req, res) => {
  try {
    await Cabang.destroy({
      where: {
        id: req.params.id,
      },
    }).then((num) => {
      // num come from numbers of updated data
      if (num == 1) {
        res.status(200).json({ message: "Cabang Deleted!" });
      } else {
        res.status(400).json({ message: `Cabang ${req.params.id} not found!` });
      }
    });
  } catch (error) {
    // Error 400 = Kesalahan dari sisi user
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getCabangs,
  getCabangNextKode,
  getCabangById,
  saveCabang,
  updateCabang,
  deleteCabang,
};
