const HakAkses = require("../../models/HakAkses/HakAksesModel.js");
const User = require("../../models/UserModel.js");

const getHakAksess = async (req, res) => {
  try {
    const hakAksess = await HakAkses.findAll({
      include: [{ model: User }],
    });
    res.status(200).json(hakAksess);
  } catch (error) {
    // Error 500 = Kesalahan di server
    res.status(500).json({ message: error.message });
  }
};

const getHakAksesById = async (req, res) => {
  try {
    const hakAkses = await HakAkses.findOne({
      where: {
        id: req.params.id,
      },
      include: [{ model: User }],
    });
    res.status(200).json(hakAkses);
  } catch (error) {
    // Error 404 = Not Found
    res.status(404).json({ message: error.message });
  }
};

const getHakAksesByUserId = async (req, res) => {
  try {
    const hakAkses = await HakAkses.findOne({
      where: {
        userId: req.body.userId,
      },
      include: [{ model: User }],
    });
    res.status(200).json(hakAkses);
  } catch (error) {
    // Error 404 = Not Found
    res.status(404).json({ message: error.message });
  }
};

const saveHakAkses = async (req, res) => {
  Object.keys(req.body).forEach(function (k) {
    if (typeof req.body[k] == "string") {
      req.body[k] = req.body[k].toUpperCase().trim();
    }
  });
  try {
    const insertedHakAkses = await HakAkses.create({
      ...req.body,
    });
    // Status 201 = Created
    res.status(201).json(insertedHakAkses);
  } catch (error) {
    // Error 400 = Kesalahan dari sisi user
    res.status(400).json({ message: error.message });
  }
};

const updateHakAkses = async (req, res) => {
  Object.keys(req.body).forEach(function (k) {
    if (typeof req.body[k] == "string") {
      req.body[k] = req.body[k].toUpperCase().trim();
    }
  });
  try {
    await HakAkses.update(
      { ...req.body },
      {
        where: {
          id: req.params.id,
        },
      }
    ).then((num) => {
      // num come from numbers of updated data
      if (num == 1) {
        res.status(200).json({ message: "Hak Akses Updated!" });
      } else {
        res
          .status(400)
          .json({ message: `Hak Akses ${req.params.id} not found!` });
      }
    });
  } catch (error) {
    // Error 400 = Kesalahan dari sisi user
    res.status(400).json({ message: error.message });
  }
};

const deleteHakAkses = async (req, res) => {
  try {
    await HakAkses.destroy({
      where: {
        id: req.params.id,
      },
    }).then((num) => {
      // num come from numbers of updated data
      if (num == 1) {
        res.status(200).json({ message: "Hak Akses Deleted!" });
      } else {
        res
          .status(400)
          .json({ message: `Hak Akses ${req.params.id} not found!` });
      }
    });
  } catch (error) {
    // Error 400 = Kesalahan dari sisi user
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getHakAksess,
  getHakAksesById,
  getHakAksesByUserId,
  saveHakAkses,
  updateHakAkses,
  deleteHakAkses,
};
