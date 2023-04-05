const Beli = require("../../../models/Pembelian/Beli/BeliModel.js");
const BeliChild = require("../../../models/Pembelian/BeliChild/BeliChildModel.js");
const Stok = require("../../../../Master/models/Stok/StokModel.js");
const Supplier = require("../../../../Master/models/Supplier/SupplierModel.js");
const Cabang = require("../../../../Master/models/Cabang/CabangModel.js");
const { findNextKode, formatDate } = require("../../../../helper/helper");
const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;

const getBelis = async (req, res) => {
  try {
    let tempAllBeli = [];
    const belis = await Beli.findAll({
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
      include: [{ model: Supplier }, { model: Cabang }],
      order: [["noNotaBeli", "ASC"]],
    });

    // Formatting date and Parsing json from string data
    for (let element of belis) {
      let objectBeli = {
        ...element.dataValues,
        tanggalBeli: formatDate(element.dataValues.tanggalBeli),
      };
      tempAllBeli.push(objectBeli);
    }

    res.status(200).json(tempAllBeli);
  } catch (error) {
    // Error 500 = Kesalahan di server
    res.status(500).json({ message: error.message });
  }
};

const getBeliNextKode = async (req, res) => {
  try {
    const belis = await Beli.findAll({});
    let nextKodeBeli = findNextKode(belis.length, 8);
    res.status(200).json(nextKodeBeli);
  } catch (error) {
    // Error 500 = Kesalahan di server
    res.status(500).json({ message: error.message });
  }
};

const getBeliById = async (req, res) => {
  try {
    const beli = await Beli.findOne({
      where: {
        id: req.params.id,
      },
      include: [{ model: Supplier }, { model: Cabang }],
    });
    res.status(200).json(beli);
  } catch (error) {
    // Error 404 = Not Found
    res.status(404).json({ message: error.message });
  }
};

const saveBeli = async (req, res) => {
  Object.keys(req.body).forEach(function (k) {
    if (typeof req.body[k] == "string") {
      req.body[k] = req.body[k].toUpperCase().trim();
    }
  });
  let suppliers = await Supplier.findOne({
    where: {
      kodeSupplier: req.body.kodeSupplier,
    },
  });
  const belis = await Beli.findAll({});
  let nextKodeBeli = findNextKode(belis.length, 8);
  try {
    const insertedBeli = await Beli.create({
      noNotaBeli: nextKodeBeli,
      supplierId: suppliers.id,
      totalBeli: 0,
      cabangId: req.body.kodeCabang,
      ...req.body,
    });
    // Status 201 = Created
    res.status(201).json(insertedBeli);
  } catch (error) {
    // Error 400 = Kesalahan dari sisi user
    res.status(400).json({ message: error.message });
  }
};

const updateBeli = async (req, res) => {
  Object.keys(req.body).forEach(function (k) {
    if (typeof req.body[k] == "string") {
      req.body[k] = req.body[k].toUpperCase().trim();
    }
  });
  let suppliers = await Supplier.findOne({
    where: {
      kodeSupplier: req.body.kodeSupplier,
    },
  });
  try {
    await Beli.update(
      {
        supplierId: suppliers.id,
        cabangId: req.body.kodeCabang,
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
        res.status(200).json({ message: "Beli Updated!" });
      } else {
        res.status(400).json({ message: `Beli ${req.params.id} not found!` });
      }
    });
  } catch (error) {
    // Error 400 = Kesalahan dari sisi user
    res.status(400).json({ message: error.message });
  }
};

const deleteBeli = async (req, res) => {
  try {
    const beliChilds = await BeliChild.findAll({
      where: {
        beliId: req.params.id,
      },
      include: [{ model: Stok }],
    });
    for (let beliChild of beliChilds) {
      let stoks = await Stok.findOne({
        where: {
          kodeStok: beliChild.stok.kodeStok,
        },
      });
      let tempQty =
        parseInt(stoks.dataValues.qtyStok) - parseInt(beliChild.qtyBeliChild);
      await Stok.update(
        {
          ...req.body,
          qtyStok: tempQty,
        },
        {
          where: {
            kodeStok: beliChild.stok.kodeStok,
          },
        }
      );

      await BeliChild.destroy({
        where: {
          id: beliChild.id,
        },
      });
    }
    await Beli.destroy({
      where: {
        id: req.params.id,
      },
    }).then((num) => {
      // num come from numbers of updated data
      if (num == 1) {
        res.status(200).json({ message: "Beli Deleted!" });
      } else {
        res.status(400).json({ message: `Beli ${req.params.id} not found!` });
      }
    });
  } catch (error) {
    // Error 400 = Kesalahan dari sisi user
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getBelis,
  getBeliNextKode,
  getBeliById,
  saveBeli,
  updateBeli,
  deleteBeli,
};
