const Perubahan = require("../../models/Perubahan/PerubahanModel.js");

const getPerubahans = async (req, res) => {
  try {
    const perubahans = await Perubahan.findAll({
      order: [["kodePerubahan", "ASC"]],
    });
    res.status(200).json(perubahans);
  } catch (error) {
    // Error 500 = Kesalahan di server
    res.status(500).json({ message: error.message });
  }
};

const getPerubahanById = async (req, res) => {
  try {
    const perubahan = await Perubahan.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(perubahan);
  } catch (error) {
    // Error 404 = Not Found
    res.status(404).json({ message: error.message });
  }
};

const savePerubahan = async (req, res) => {
  Object.keys(req.body).forEach(function (k) {
    if (typeof req.body[k] == "string") {
      req.body[k] = req.body[k].toUpperCase().trim();
    }
  });
  try {
    // Find if Kode Perubahan already exist
    const perubahan = await Perubahan.findOne({
      where: {
        kodePerubahan: req.body.kodePerubahan,
      },
    });
    let kodePerubahanExist = perubahan;
    if (kodePerubahanExist) {
      res.status(400).json({ message: "Kode Perubahan Sudah Ada!" });
    } else {
      const insertedPerubahan = await Perubahan.create({
        ...req.body,
      });
      // Status 201 = Created
      res.status(201).json(insertedPerubahan);
    }
  } catch (error) {
    // Error 400 = Kesalahan dari sisi user
    res.status(400).json({ message: error.message });
  }
};

const updatePerubahan = async (req, res) => {
  Object.keys(req.body).forEach(function (k) {
    if (typeof req.body[k] == "string") {
      req.body[k] = req.body[k].toUpperCase().trim();
    }
  });
  try {
    // Find if Kode Perubahan already exist and not current one
    const perubahan = await Perubahan.findOne({
      where: {
        kodePerubahan: req.body.kodePerubahan,
      },
    });
    let kodePerubahanExist =
      perubahan &&
      perubahan.dataValues.kodePerubahan !== req.body.kodePerubahan;
    if (kodePerubahanExist) {
      res.status(400).json({ message: "Kode Perubahan Sudah Ada!" });
    } else {
      await Perubahan.update(req.body, {
        where: {
          id: req.params.id,
        },
      }).then((num) => {
        // num come from numbers of updated data
        if (num == 1) {
          res.status(200).json({ message: "Perubahan Updated!" });
        } else {
          res
            .status(400)
            .json({ message: `Perubahan ${req.params.id} not found!` });
        }
      });
    }
  } catch (error) {
    // Error 400 = Kesalahan dari sisi user
    res.status(400).json({ message: error.message });
  }
};

const deletePerubahan = async (req, res) => {
  try {
    await Perubahan.destroy({
      where: {
        id: req.params.id,
      },
    }).then((num) => {
      // num come from numbers of updated data
      if (num == 1) {
        res.status(200).json({ message: "Perubahan Deleted!" });
      } else {
        res
          .status(400)
          .json({ message: `Perubahan ${req.params.id} not found!` });
      }
    });
  } catch (error) {
    // Error 400 = Kesalahan dari sisi user
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getPerubahans,
  getPerubahanById,
  savePerubahan,
  updatePerubahan,
  deletePerubahan,
};
