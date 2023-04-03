const GroupStok = require("../../models/GroupStok/GroupStokModel.js");

const getGroupStoks = async (req, res) => {
  try {
    const groupStok = await GroupStok.findAll({
      order: [["kodeGroupStok", "ASC"]],
    });
    res.status(200).json(groupStok);
  } catch (error) {
    // Error 500 = Kesalahan di server
    res.status(500).json({ message: error.message });
  }
};

const getGroupStokById = async (req, res) => {
  try {
    const groupStok = await GroupStok.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(groupStok);
  } catch (error) {
    // Error 404 = Not Found
    res.status(404).json({ message: error.message });
  }
};

const saveGroupStok = async (req, res) => {
  Object.keys(req.body).forEach(function (k) {
    if (typeof req.body[k] == "string") {
      req.body[k] = req.body[k].toUpperCase().trim();
    }
  });
  try {
    // Find if Kode Group Stok already exist
    const groupStok = await GroupStok.findOne({
      where: {
        kodeGroupStok: req.body.kodeGroupStok,
      },
    });
    let kodeGroupStokExist = groupStok;
    if (kodeGroupStokExist) {
      res.status(400).json({ message: "Kode Group Stok Sudah Ada!" });
    } else {
      const insertedGroupStok = await GroupStok.create({
        ...req.body,
      });
      // Status 201 = Created
      res.status(201).json(insertedGroupStok);
    }
  } catch (error) {
    // Error 400 = Kesalahan dari sisi user
    res.status(400).json({ message: error.message });
  }
};

const updateGroupStok = async (req, res) => {
  Object.keys(req.body).forEach(function (k) {
    if (typeof req.body[k] == "string") {
      req.body[k] = req.body[k].toUpperCase().trim();
    }
  });
  try {
    // Find if Kode Group Stok already exist and not current one
    const groupStok = await GroupStok.findOne({
      where: {
        kodeGroupStok: req.body.kodeGroupStok,
      },
    });
    let kodeGroupStokExist =
      groupStok &&
      groupStok.dataValues.kodeGroupStok !== req.body.kodeGroupStok;
    if (kodeGroupStokExist) {
      res.status(400).json({ message: "Kode Group Stok Sudah Ada!" });
    } else {
      await GroupStok.update(req.body, {
        where: {
          id: req.params.id,
        },
      }).then((num) => {
        // num come from numbers of updated data
        if (num == 1) {
          res.status(200).json({ message: "Group Stok Updated!" });
        } else {
          res
            .status(400)
            .json({ message: `Group Stok ${req.params.id} not found!` });
        }
      });
    }
  } catch (error) {
    // Error 400 = Kesalahan dari sisi user
    res.status(400).json({ message: error.message });
  }
};

const deleteGroupStok = async (req, res) => {
  try {
    await GroupStok.destroy({
      where: {
        id: req.params.id,
      },
    }).then((num) => {
      // num come from numbers of updated data
      if (num == 1) {
        res.status(200).json({ message: "Group Stok Deleted!" });
      } else {
        res
          .status(400)
          .json({ message: `Group Stok ${req.params.id} not found!` });
      }
    });
  } catch (error) {
    // Error 400 = Kesalahan dari sisi user
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getGroupStoks,
  getGroupStokById,
  saveGroupStok,
  updateGroupStok,
  deleteGroupStok,
};
