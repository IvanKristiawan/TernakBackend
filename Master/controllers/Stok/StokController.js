const Stok = require("../../models/Stok/StokModel.js");
const GroupStok = require("../../models/GroupStok/GroupStokModel.js");

const getStoks = async (req, res) => {
  try {
    const stoks = await Stok.findAll({
      include: [{ model: GroupStok }],
      order: [["kodeStok", "ASC"]],
    });
    res.status(200).json(stoks);
  } catch (error) {
    // Error 500 = Kesalahan di server
    res.status(500).json({ message: error.message });
  }
};

const getStokById = async (req, res) => {
  try {
    const stok = await Stok.findOne({
      where: {
        id: req.params.id,
      },
      include: [{ model: GroupStok }],
    });
    res.status(200).json(stok);
  } catch (error) {
    // Error 404 = Not Found
    res.status(404).json({ message: error.message });
  }
};

const getStokByNama = async (req, res) => {
  try {
    const stok = await Stok.findOne({
      where: {
        namaStok: req.body.namaStok,
      },
      include: [{ model: GroupStok }],
    });
    res.status(200).json(stok);
  } catch (error) {
    // Error 404 = Not Found
    res.status(404).json({ message: error.message });
  }
};

const saveStok = async (req, res) => {
  Object.keys(req.body).forEach(function (k) {
    if (typeof req.body[k] == "string") {
      req.body[k] = req.body[k].toUpperCase().trim();
    }
  });
  let groupStoks = await GroupStok.findOne({
    where: {
      kodeGroupStok: req.body.kodeGroupStok,
    },
  });
  try {
    // Find if Nama Stok already exist
    const stok = await Stok.findOne({
      where: {
        kodeStok: req.body.kodeStok,
      },
    });
    let kodeStokExist = stok;
    if (kodeStokExist) {
      res.status(400).json({ message: "Kode Stok Sudah Ada!" });
    } else {
      const insertedStok = await Stok.create({
        groupStokId: groupStoks.id,
        ...req.body,
      });
      // Status 201 = Created
      res.status(201).json(insertedStok);
    }
  } catch (error) {
    // Error 400 = Kesalahan dari sisi user
    res.status(400).json({ message: error.message });
  }
};

const updateStok = async (req, res) => {
  Object.keys(req.body).forEach(function (k) {
    if (typeof req.body[k] == "string") {
      req.body[k] = req.body[k].toUpperCase().trim();
    }
  });
  let groupStoks = await GroupStok.findOne({
    where: {
      kodeGroupStok: req.body.kodeGroupStok,
    },
  });
  try {
    // Find if Nama Stok already exist and not current one
    const stok = await Stok.findOne({
      where: {
        kodeStok: req.body.kodeStok,
      },
    });
    let kodeStokExist =
      stok && stok.dataValues.kodeStok !== req.body.kodeStokLama;
    if (kodeStokExist) {
      res.status(400).json({ message: "Kode Stok Sudah Ada!" });
    } else {
      await Stok.update(
        {
          groupStokId: groupStoks.id,
          ...req.body,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      ).then((num) => {
        // num come from numbers of updated data
        if (num == 1) {
          res.status(200).json({ message: "Stok Updated!" });
        } else {
          res.status(400).json({ message: `Stok ${req.params.id} not found!` });
        }
      });
    }
  } catch (error) {
    // Error 400 = Kesalahan dari sisi user
    res.status(400).json({ message: error.message });
  }
};

const deleteStok = async (req, res) => {
  try {
    await Stok.destroy({
      where: {
        id: req.params.id,
      },
    }).then((num) => {
      // num come from numbers of updated data
      if (num == 1) {
        res.status(200).json({ message: "Stok Deleted!" });
      } else {
        res.status(400).json({ message: `Stok ${req.params.id} not found!` });
      }
    });
  } catch (error) {
    // Error 400 = Kesalahan dari sisi user
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getStoks,
  getStokById,
  getStokByNama,
  saveStok,
  updateStok,
  deleteStok,
};
