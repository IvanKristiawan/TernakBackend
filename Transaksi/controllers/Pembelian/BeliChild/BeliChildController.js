const Beli = require("../../../models/Pembelian/Beli/BeliModel.js");
const BeliChild = require("../../../models/Pembelian/BeliChild/BeliChildModel.js");
const Stok = require("../../../../Master/models/Stok/StokModel.js");
const Supplier = require("../../../../Master/models/Supplier/SupplierModel.js");
const Cabang = require("../../../../Master/models/Cabang/CabangModel.js");
const { formatDate } = require("../../../../helper/helper");
const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;

const getBeliChilds = async (req, res) => {
  try {
    let tempAllBeliChild = [];
    const beliChilds = await BeliChild.findAll({
      where: {
        cabangId: req.body.kodeCabang,
        [Op.and]: [
          {
            tanggalBeli: {
              [Op.gte]: new Date(req.body.dariTanggal),
            },
          },
          {
            tanggalBeli: {
              [Op.lte]: new Date(req.body.sampaiTanggal),
            },
          },
        ],
      },
      include: [
        { model: Beli },
        { model: Stok },
        { model: Supplier },
        { model: Cabang },
      ],
    });

    // Formatting date and Parsing json from string data
    for (let element of beliChilds) {
      let objectBeliChild = {
        ...element.dataValues,
        tanggalBeli: formatDate(element.dataValues.tanggalBeli),
      };
      tempAllBeliChild.push(objectBeliChild);
    }

    res.status(200).json(tempAllBeliChild);
  } catch (error) {
    // Error 500 = Kesalahan di server
    res.status(500).json({ message: error.message });
  }
};

const getBeliChildByBeli = async (req, res) => {
  try {
    const beliChild = await BeliChild.findAll({
      where: {
        beliId: req.body.beliId,
        cabangId: req.body.kodeCabang,
      },
      include: [
        { model: Beli },
        { model: Stok },
        { model: Supplier },
        { model: Cabang },
      ],
    });
    res.status(200).json(beliChild);
  } catch (error) {
    // Error 500 = Kesalahan di server
    res.status(500).json({ message: error.message });
  }
};

const getBeliChildById = async (req, res) => {
  try {
    const beliChild = await BeliChild.findOne({
      where: {
        id: req.params.id,
      },
      include: [
        { model: Beli },
        { model: Stok },
        { model: Supplier },
        { model: Cabang },
      ],
    });
    res.status(200).json(beliChild);
  } catch (error) {
    // Error 404 = Not Found
    res.status(404).json({ message: error.message });
  }
};

const saveBeliChild = async (req, res) => {
  Object.keys(req.body).forEach(function (k) {
    if (typeof req.body[k] == "string") {
      req.body[k] = req.body[k].toUpperCase().trim();
    }
  });
  const beli = await Beli.findOne({
    where: {
      id: req.body.beliId,
    },
  });
  let tempTotal =
    parseInt(beli.dataValues.totalBeli) + parseInt(req.body.subtotalBeliChild);
  let stoks = await Stok.findOne({
    where: {
      kodeStok: req.body.kodeStok,
    },
  });
  let tempQty =
    parseInt(stoks.dataValues.qtyStok) + parseInt(req.body.qtyBeliChild);
  try {
    await Beli.update(
      {
        ...req.body,
        totalBeli: tempTotal,
        cabangId: req.body.kodeCabang,
      },
      {
        where: {
          id: req.body.beliId,
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
    const insertedBeliChild = await BeliChild.create({
      stokId: stoks.id,
      cabangId: req.body.kodeCabang,
      ...req.body,
    });
    // Status 201 = Created
    res.status(201).json(insertedBeliChild);
  } catch (error) {
    // Error 400 = Kesalahan dari sisi user
    res.status(400).json({ message: error.message });
  }
};

const updateBeliChild = async (req, res) => {
  Object.keys(req.body).forEach(function (k) {
    if (typeof req.body[k] == "string") {
      req.body[k] = req.body[k].toUpperCase().trim();
    }
  });
  try {
    const beli = await Beli.findOne({
      where: {
        id: req.body.beliId,
      },
    });
    let tempTotal =
      parseInt(beli.dataValues.totalBeli) -
      parseInt(req.body.subtotalBeliChildLama) +
      parseInt(req.body.subtotalBeliChild);
    let stoks = await Stok.findOne({
      where: {
        kodeStok: req.body.kodeStok,
      },
    });
    let tempQty =
      parseInt(stoks.dataValues.qtyStok) -
      parseInt(req.body.qtyBeliChildLama) +
      parseInt(req.body.qtyBeliChild);
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
    await Beli.update(
      {
        ...req.body,
        totalBeli: tempTotal,
        cabangId: req.body.kodeCabang,
      },
      {
        where: {
          id: req.body.beliId,
        },
      }
    );
    await BeliChild.update(
      { ...req.body, cabangId: req.body.kodeCabang },
      {
        where: {
          id: req.params.id,
        },
      }
    ).then((num) => {
      // num come from numbers of updated data
      if (num == 1) {
        res.status(200).json({ message: "Beli Child Updated!" });
      } else {
        res
          .status(400)
          .json({ message: `Beli Child ${req.params.id} not found!` });
      }
    });
  } catch (error) {
    // Error 400 = Kesalahan dari sisi user
    res.status(400).json({ message: error.message });
  }
};

const deleteBeliChild = async (req, res) => {
  try {
    const beli = await Beli.findOne({
      where: {
        id: req.body.beliId,
      },
    });
    let tempTotal =
      parseInt(beli.dataValues.totalBeli) -
      parseInt(req.body.subtotalBeliChild);
    let stoks = await Stok.findOne({
      where: {
        kodeStok: req.body.kodeStok,
      },
    });
    let tempQty =
      parseInt(stoks.dataValues.qtyStok) - parseInt(req.body.qtyBeliChild);
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
    await Beli.update(
      {
        ...req.body,
        totalBeli: tempTotal,
        cabangId: req.body.kodeCabang,
      },
      {
        where: {
          id: req.body.beliId,
        },
      }
    );
    await BeliChild.destroy({
      where: {
        id: req.params.id,
      },
    }).then((num) => {
      // num come from numbers of updated data
      if (num == 1) {
        res.status(200).json({ message: "Beli Child Deleted!" });
      } else {
        res
          .status(400)
          .json({ message: `Beli Child ${req.params.id} not found!` });
      }
    });
  } catch (error) {
    // Error 400 = Kesalahan dari sisi user
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getBeliChilds,
  getBeliChildByBeli,
  getBeliChildById,
  saveBeliChild,
  updateBeliChild,
  deleteBeliChild,
};
