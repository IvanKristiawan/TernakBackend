const Jual = require("../../../models/Penjualan/Jual/JualModel.js");
const JualChild = require("../../../models/Penjualan/JualChild/JualChildModel.js");
const Stok = require("../../../../Master/models/Stok/StokModel.js");
const Cabang = require("../../../../Master/models/Cabang/CabangModel.js");
const { formatDate } = require("../../../../helper/helper");
const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;

const getJualChilds = async (req, res) => {
  try {
    let tempAllJualChild = [];
    const jualChilds = await JualChild.findAll({
      where: {
        cabangId: req.body.kodeCabang,
        [Op.and]: [
          {
            tanggalJual: {
              [Op.gte]: new Date(req.body.dariTanggal),
            },
          },
          {
            tanggalJual: {
              [Op.lte]: new Date(req.body.sampaiTanggal),
            },
          },
        ],
      },
      include: [{ model: Jual }, { model: Stok }, { model: Cabang }],
    });

    // Formatting date and Parsing json from string data
    for (let element of jualChilds) {
      let objectJualChild = {
        ...element.dataValues,
        tanggalJual: formatDate(element.dataValues.tanggalJual),
      };
      tempAllJualChild.push(objectJualChild);
    }

    res.status(200).json(tempAllJualChild);
  } catch (error) {
    // Error 500 = Kesalahan di server
    res.status(500).json({ message: error.message });
  }
};

const getJualChildByJual = async (req, res) => {
  try {
    const jualChild = await JualChild.findAll({
      where: {
        jualId: req.body.jualId,
        cabangId: req.body.kodeCabang,
      },
      include: [{ model: Jual }, { model: Stok }, { model: Cabang }],
    });
    res.status(200).json(jualChild);
  } catch (error) {
    // Error 500 = Kesalahan di server
    res.status(500).json({ message: error.message });
  }
};

const getJualChildById = async (req, res) => {
  try {
    const jualChild = await JualChild.findOne({
      where: {
        id: req.params.id,
      },
      include: [{ model: Jual }, { model: Stok }, { model: Cabang }],
    });
    res.status(200).json(jualChild);
  } catch (error) {
    // Error 404 = Not Found
    res.status(404).json({ message: error.message });
  }
};

const saveJualChild = async (req, res) => {
  Object.keys(req.body).forEach(function (k) {
    if (typeof req.body[k] == "string") {
      req.body[k] = req.body[k].toUpperCase().trim();
    }
  });
  const jual = await Jual.findOne({
    where: {
      id: req.body.jualId,
    },
  });
  let tempTotal =
    parseInt(jual.dataValues.totalJual) + parseInt(req.body.subtotalJualChild);
  let stoks = await Stok.findOne({
    where: {
      kodeStok: req.body.kodeStok,
    },
  });
  let tempQty =
    parseInt(stoks.dataValues.qtyStok) - parseInt(req.body.qtyJualChild);
  try {
    await Jual.update(
      {
        ...req.body,
        totalJual: tempTotal,
        cabangId: req.body.kodeCabang,
      },
      {
        where: {
          id: req.body.jualId,
        },
      }
    );
    await Stok.update(
      {
        ...req.body,
        qtyStok: tempQty,
        cabangId: req.body.kodeCabang,
      },
      {
        where: {
          kodeStok: req.body.kodeStok,
        },
      }
    );
    const insertedJualChild = await JualChild.create({
      stokId: stoks.id,
      cabangId: req.body.kodeCabang,
      ...req.body,
    });
    // Status 201 = Created
    res.status(201).json(insertedJualChild);
  } catch (error) {
    // Error 400 = Kesalahan dari sisi user
    res.status(400).json({ message: error.message });
  }
};

const updateJualChild = async (req, res) => {
  Object.keys(req.body).forEach(function (k) {
    if (typeof req.body[k] == "string") {
      req.body[k] = req.body[k].toUpperCase().trim();
    }
  });
  try {
    const jual = await Jual.findOne({
      where: {
        id: req.body.jualId,
      },
    });
    let tempTotal =
      parseInt(jual.dataValues.totalJual) -
      parseInt(req.body.subtotalJualChildLama) +
      parseInt(req.body.subtotalJualChild);
    let stoks = await Stok.findOne({
      where: {
        kodeStok: req.body.kodeStok,
      },
    });
    let tempQty =
      parseInt(stoks.dataValues.qtyStok) +
      parseInt(req.body.qtyJualChildLama) -
      parseInt(req.body.qtyJualChild);
    await Stok.update(
      {
        ...req.body,
        qtyStok: tempQty,
        cabangId: req.body.kodeCabang,
      },
      {
        where: {
          kodeStok: req.body.kodeStok,
        },
      }
    );
    await Jual.update(
      {
        ...req.body,
        totalJual: tempTotal,
        cabangId: req.body.kodeCabang,
      },
      {
        where: {
          id: req.body.jualId,
        },
      }
    );
    await JualChild.update(
      { ...req.body, cabangId: req.body.kodeCabang },
      {
        where: {
          id: req.params.id,
        },
      }
    ).then((num) => {
      // num come from numbers of updated data
      if (num == 1) {
        res.status(200).json({ message: "Jual Child Updated!" });
      } else {
        res
          .status(400)
          .json({ message: `Jual Child ${req.params.id} not found!` });
      }
    });
  } catch (error) {
    // Error 400 = Kesalahan dari sisi user
    res.status(400).json({ message: error.message });
  }
};

const deleteJualChild = async (req, res) => {
  try {
    const jual = await Jual.findOne({
      where: {
        id: req.body.jualId,
      },
    });
    let tempTotal =
      parseInt(jual.dataValues.totalJual) -
      parseInt(req.body.subtotalJualChild);
    let stoks = await Stok.findOne({
      where: {
        kodeStok: req.body.kodeStok,
      },
    });
    let tempQty =
      parseInt(stoks.dataValues.qtyStok) + parseInt(req.body.qtyJualChild);
    await Stok.update(
      {
        ...req.body,
        qtyStok: tempQty,
        cabangId: req.body.kodeCabang,
      },
      {
        where: {
          kodeStok: req.body.kodeStok,
        },
      }
    );
    await Jual.update(
      {
        ...req.body,
        totalJual: tempTotal,
        cabangId: req.body.kodeCabang,
      },
      {
        where: {
          id: req.body.jualId,
        },
      }
    );
    await JualChild.destroy({
      where: {
        id: req.params.id,
      },
    }).then((num) => {
      // num come from numbers of updated data
      if (num == 1) {
        res.status(200).json({ message: "Jual Child Deleted!" });
      } else {
        res
          .status(400)
          .json({ message: `Jual Child ${req.params.id} not found!` });
      }
    });
  } catch (error) {
    // Error 400 = Kesalahan dari sisi user
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getJualChilds,
  getJualChildByJual,
  getJualChildById,
  saveJualChild,
  updateJualChild,
  deleteJualChild,
};
