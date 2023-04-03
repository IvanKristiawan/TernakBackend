const Customer = require("../../models/Customer/CustomerModel.js");
const { findNextKode } = require("../../../helper/helper");

const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll({
      order: [["kodeCustomer", "ASC"]],
    });
    res.status(200).json(customers);
  } catch (error) {
    // Error 500 = Kesalahan di server
    res.status(500).json({ message: error.message });
  }
};

const getCustomerNextKode = async (req, res) => {
  try {
    const customers = await Customer.findAll({});
    let nextKodeCustomer = findNextKode(customers.length, 6);
    res.status(200).json(nextKodeCustomer);
  } catch (error) {
    // Error 500 = Kesalahan di server
    res.status(500).json({ message: error.message });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(customer);
  } catch (error) {
    // Error 404 = Not Found
    res.status(404).json({ message: error.message });
  }
};

const saveCustomer = async (req, res) => {
  Object.keys(req.body).forEach(function (k) {
    if (typeof req.body[k] == "string") {
      req.body[k] = req.body[k].toUpperCase().trim();
    }
  });
  const customers = await Customer.findAll();
  let nextKodeCustomer = findNextKode(customers.length, 6);
  try {
    const insertedCustomer = await Customer.create({
      kodeCustomer: nextKodeCustomer,
      ...req.body,
    });
    // Status 201 = Created
    res.status(201).json(insertedCustomer);
  } catch (error) {
    // Error 400 = Kesalahan dari sisi user
    res.status(400).json({ message: error.message });
  }
};

const updateCustomer = async (req, res) => {
  Object.keys(req.body).forEach(function (k) {
    if (typeof req.body[k] == "string") {
      req.body[k] = req.body[k].toUpperCase().trim();
    }
  });
  try {
    await Customer.update(
      { ...req.body },
      {
        where: {
          id: req.params.id,
        },
      }
    ).then((num) => {
      // num come from numbers of updated data
      if (num == 1) {
        res.status(200).json({ message: "Customer Updated!" });
      } else {
        res
          .status(400)
          .json({ message: `Customer ${req.params.id} not found!` });
      }
    });
  } catch (error) {
    // Error 400 = Kesalahan dari sisi user
    res.status(400).json({ message: error.message });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    await Customer.destroy({
      where: {
        id: req.params.id,
      },
    }).then((num) => {
      // num come from numbers of updated data
      if (num == 1) {
        res.status(200).json({ message: "Customer Deleted!" });
      } else {
        res
          .status(400)
          .json({ message: `Customer ${req.params.id} not found!` });
      }
    });
  } catch (error) {
    // Error 400 = Kesalahan dari sisi user
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getCustomers,
  getCustomerNextKode,
  getCustomerById,
  saveCustomer,
  updateCustomer,
  deleteCustomer,
};
