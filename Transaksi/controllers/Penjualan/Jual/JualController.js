const Jual = require("../../../models/Penjualan/Jual/JualModel.js");
const JualChild = require("../../../models/Penjualan/JualChild/JualChildModel.js");
const Stok = require("../../../../Master/models/Stok/StokModel.js");
const Customer = require("../../../../Master/models/Customer/CustomerModel.js");
const Cabang = require("../../../../Master/models/Cabang/CabangModel.js");
const { findNextKode, formatDate } = require("../../../../helper/helper");
const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;

const getJuals = async (req, res) => {
  try {
    let tempAllJual = [];
    const juals = await Jual.findAll({
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
      include: [{ model: Customer }, { model: Cabang }],
      order: [["noNotaJual", "ASC"]],
    });

    // Formatting date and Parsing json from string data
    for (let element of juals) {
      let objectBeli = {
        ...element.dataValues,
        tanggalJual: formatDate(element.dataValues.tanggalJual),
      };
      tempAllJual.push(objectBeli);
    }

    res.status(200).json(tempAllJual);
  } catch (error) {
    // Error 500 = Kesalahan di server
    res.status(500).json({ message: error.message });
  }
};

const getJualNextKode = async (req, res) => {
  try {
    const juals = await Jual.findAll({});
    let nextKodeJual = findNextKode(juals.length, 8);
    res.status(200).json(nextKodeJual);
  } catch (error) {
    // Error 500 = Kesalahan di server
    res.status(500).json({ message: error.message });
  }
};

const getJualById = async (req, res) => {
  try {
    const jual = await Jual.findOne({
      where: {
        id: req.params.id,
      },
      include: [{ model: Customer }, { model: Cabang }],
    });
    res.status(200).json(jual);
  } catch (error) {
    // Error 404 = Not Found
    res.status(404).json({ message: error.message });
  }
};

const saveJual = async (req, res) => {
  Object.keys(req.body).forEach(function (k) {
    if (typeof req.body[k] == "string") {
      req.body[k] = req.body[k].toUpperCase().trim();
    }
  });
  const juals = await Jual.findAll({});
  let nextKodeJual = findNextKode(juals.length, 8);

  let customers = await Customer.findOne({
    where: {
      kodeCustomer: req.body.kodeCustomer,
    },
  });
  try {
    const insertedJual = await Jual.create({
      noNotaJual: nextKodeJual,
      customerId: customers.id,
      totalJual: 0,
      cabangId: req.body.kodeCabang,
      ...req.body,
    });
    // Status 201 = Created
    res.status(201).json(insertedJual);
  } catch (error) {
    // Error 400 = Kesalahan dari sisi user
    res.status(400).json({ message: error.message });
  }
};

const updateJual = async (req, res) => {
  Object.keys(req.body).forEach(function (k) {
    if (typeof req.body[k] == "string") {
      req.body[k] = req.body[k].toUpperCase().trim();
    }
  });
  let customers = await Customer.findOne({
    where: {
      kodeCustomer: req.body.kodeCustomer,
    },
  });
  try {
    await Jual.update(
      {
        customerId: customers.id,
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
        res.status(200).json({ message: "Jual Updated!" });
      } else {
        res.status(400).json({ message: `Jual ${req.params.id} not found!` });
      }
    });
  } catch (error) {
    // Error 400 = Kesalahan dari sisi user
    res.status(400).json({ message: error.message });
  }
};

const deleteJual = async (req, res) => {
  try {
    const jualChilds = await JualChild.findAll({
      where: {
        jualId: req.params.id,
      },
      include: [{ model: Stok }, { model: Cabang }],
    });
    for (let jualChild of jualChilds) {
      let stoks = await Stok.findOne({
        where: {
          kodeStok: jualChild.stok.kodeStok,
        },
      });
      let tempQty =
        parseInt(stoks.dataValues.qtyStok) + parseInt(jualChild.qtyJualChild);
      await Stok.update(
        {
          ...req.body,
          qtyStok: tempQty,
        },
        {
          where: {
            kodeStok: jualChild.stok.kodeStok,
          },
        }
      );

      await JualChild.destroy({
        where: {
          id: jualChild.id,
        },
      });
    }
    await Jual.destroy({
      where: {
        id: req.params.id,
      },
    }).then((num) => {
      // num come from numbers of updated data
      if (num == 1) {
        res.status(200).json({ message: "Jual Deleted!" });
      } else {
        res.status(400).json({ message: `Jual ${req.params.id} not found!` });
      }
    });
  } catch (error) {
    // Error 400 = Kesalahan dari sisi user
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getJuals,
  getJualNextKode,
  getJualById,
  saveJual,
  updateJual,
  deleteJual,
};
