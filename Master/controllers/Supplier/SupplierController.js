const Supplier = require("../../models/Supplier/SupplierModel.js");
const { findNextKode } = require("../../../helper/helper");

const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.findAll({
      order: [["kodeSupplier", "ASC"]],
    });
    res.status(200).json(suppliers);
  } catch (error) {
    // Error 500 = Kesalahan di server
    res.status(500).json({ message: error.message });
  }
};

const getSupplierNextKode = async (req, res) => {
  try {
    const suppliers = await Supplier.findAll({});
    let nextKodeSupplier = findNextKode(suppliers.length, 4);
    res.status(200).json(nextKodeSupplier);
  } catch (error) {
    // Error 500 = Kesalahan di server
    res.status(500).json({ message: error.message });
  }
};

const getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(supplier);
  } catch (error) {
    // Error 404 = Not Found
    res.status(404).json({ message: error.message });
  }
};

const saveSupplier = async (req, res) => {
  Object.keys(req.body).forEach(function (k) {
    if (typeof req.body[k] == "string") {
      req.body[k] = req.body[k].toUpperCase().trim();
    }
  });
  const suppliers = await Supplier.findAll();
  let nextKodeSupplier = findNextKode(suppliers.length, 4);
  try {
    const insertedSupplier = await Supplier.create({
      kodeSupplier: nextKodeSupplier,
      ...req.body,
    });
    // Status 201 = Created
    res.status(201).json(insertedSupplier);
  } catch (error) {
    // Error 400 = Kesalahan dari sisi user
    res.status(400).json({ message: error.message });
  }
};

const updateSupplier = async (req, res) => {
  Object.keys(req.body).forEach(function (k) {
    if (typeof req.body[k] == "string") {
      req.body[k] = req.body[k].toUpperCase().trim();
    }
  });
  try {
    await Supplier.update(
      { ...req.body },
      {
        where: {
          id: req.params.id,
        },
      }
    ).then((num) => {
      // num come from numbers of updated data
      if (num == 1) {
        res.status(200).json({ message: "Supplier Updated!" });
      } else {
        res
          .status(400)
          .json({ message: `Supplier ${req.params.id} not found!` });
      }
    });
  } catch (error) {
    // Error 400 = Kesalahan dari sisi user
    res.status(400).json({ message: error.message });
  }
};

const deleteSupplier = async (req, res) => {
  try {
    await Supplier.destroy({
      where: {
        id: req.params.id,
      },
    }).then((num) => {
      // num come from numbers of updated data
      if (num == 1) {
        res.status(200).json({ message: "Supplier Deleted!" });
      } else {
        res
          .status(400)
          .json({ message: `Supplier ${req.params.id} not found!` });
      }
    });
  } catch (error) {
    // Error 400 = Kesalahan dari sisi user
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getSuppliers,
  getSupplierNextKode,
  getSupplierById,
  saveSupplier,
  updateSupplier,
  deleteSupplier,
};
