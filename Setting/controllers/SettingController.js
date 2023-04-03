const Setting = require("../../Setting/models/SettingModel.js");

const getSettings = async (req, res) => {
  try {
    const settings = await Setting.findAll({
      where: {
        cabangId: req.body.kodeCabang,
      },
    });
    res.status(200).json(settings);
  } catch (error) {
    // Error 500 = Kesalahan di server
    res.status(500).json({ message: error.message });
  }
};

const getSettingById = async (req, res) => {
  try {
    const setting = await Setting.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(setting);
  } catch (error) {
    // Error 404 = Not Found
    res.status(404).json({ message: error.message });
  }
};

const getLastSetting = async (req, res) => {
  try {
    const setting = await Setting.findOne({
      where: {
        cabangId: req.body.kodeCabang,
      },
    });
    res.status(200).json(setting);
  } catch (error) {
    // Error 404 = Not Found
    res.status(404).json({ message: error.message });
  }
};

const saveSetting = async (req, res) => {
  Object.keys(req.body).forEach(function (k) {
    if (typeof req.body[k] == "string") {
      req.body[k] = req.body[k].toUpperCase().trim();
    }
  });
  try {
    const insertedSetting = await Setting.create({
      ...req.body,
      cabangId: req.body.kodeCabang,
    });
    // Status 201 = Created
    res.status(201).json(insertedSetting);
  } catch (error) {
    // Error 400 = Kesalahan dari sisi user
    res.status(400).json({ message: error.message });
  }
};

const updateSetting = async (req, res) => {
  Object.keys(req.body).forEach(function (k) {
    if (typeof req.body[k] == "string") {
      req.body[k] = req.body[k].toUpperCase().trim();
    }
  });
  try {
    await Setting.update(
      {
        ...req.body,
        cabangId: req.body.kodeCabang,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    ).then((num) => {
      // num come from numbers of updated data
      if (num == 1) {
        res.status(200).json({ message: "Setting Updated!" });
      } else {
        res
          .status(400)
          .json({ message: `Setting ${req.params.id} not found!` });
      }
    });
  } catch (error) {
    // Error 400 = Kesalahan dari sisi user
    res.status(400).json({ message: error.message });
  }
};

const deleteSetting = async (req, res) => {
  try {
    await Setting.destroy({
      where: {
        id: req.params.id,
      },
    }).then((num) => {
      // num come from numbers of updated data
      if (num == 1) {
        res.status(200).json({ message: "Setting Deleted!" });
      } else {
        res
          .status(400)
          .json({ message: `Setting ${req.params.id} not found!` });
      }
    });
  } catch (error) {
    // Error 400 = Kesalahan dari sisi user
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getSettings,
  getSettingById,
  getLastSetting,
  saveSetting,
  updateSetting,
  deleteSetting,
};
