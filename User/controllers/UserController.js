const User = require("../models/UserModel.js");
const HakAkses = require("../models/HakAkses/HakAksesModel.js");
const Cabang = require("../../Master/models/Cabang/CabangModel.js");
const jwt = require("jsonwebtoken");

const updateUser = async (req, res) => {
  Object.keys(req.body).forEach(function (k) {
    if (typeof req.body[k] == "string") {
      req.body[k] = req.body[k].toUpperCase().trim();
    }
  });
  try {
    let findUser;
    findUser = await User.findOne({
      where: {
        id: req.params.id,
      },
    });
    let tempPassword;
    if (req.body.password) {
      tempPassword = req.body.password;
    } else {
      tempPassword = findUser.password;
    }

    await User.update(
      {
        username: req.body.username,
        password: tempPassword,
        tipeUser: req.body.tipeUser,
        cabangId: req.body.cabangId,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    await HakAkses.update(
      { ...req.body.akses },
      {
        where: {
          userId: req.params.id,
        },
      }
    );

    findUser = await User.findOne({
      where: {
        id: req.params.id,
      },
      include: [{ model: Cabang }],
    });

    const hakAkses = await HakAkses.findOne({
      where: {
        userId: req.params.id,
      },
    });

    const { ...otherDetails } = findUser.dataValues;

    res.status(200).json({
      ...otherDetails,
      akses: hakAkses,
    });
  } catch (error) {
    // Error 400 = Kesalahan dari sisi user
    res.status(400).json({ message: error.message });
  }
};

const updateUserThenLogin = async (req, res) => {
  try {
    // const findUser = await User.findById(req.params.id);
    const findUser = await User.findOne({
      where: {
        id: req.params.id,
      },
    });
    let tempPassword;
    if (req.body.password) {
      tempPassword = req.body.password;
    } else {
      tempPassword = findUser.password;
    }

    await User.update(
      {
        username: req.body.username,
        password: tempPassword,
        tipeUser: req.body.tipeUser,
        cabangId: req.body.cabangId,
        akses: JSON.stringify(req.body.akses),
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    await HakAkses.update(
      { ...req.body.akses },
      {
        where: {
          userId: req.params.id,
        },
      }
    );

    const user = await User.findOne({
      where: {
        id: req.params.id,
      },
      include: [{ model: Cabang }],
    });

    const hakAkses = await HakAkses.findOne({
      where: {
        userId: req.params.id,
      },
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT, {
      expiresIn: "15d",
    });

    const { password, ...otherDetails } = user.dataValues;

    res.status(200).json({
      details: {
        ...otherDetails,
        token,
        akses: hakAkses,
      },
    });
  } catch (error) {
    // Error 400 = Kesalahan dari sisi user
    res.status(400).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    await HakAkses.destroy({
      where: {
        userId: req.params.id,
      },
    });
    await User.destroy({
      where: {
        id: req.params.id,
      },
    }).then((num) => {
      // num come from numbers of updated data
      if (num == 1) {
        res.status(200).json({ message: "User Deleted!" });
      } else {
        res.status(400).json({ message: `User ${req.params.id} not found!` });
      }
    });
  } catch (error) {
    // Error 400 = Kesalahan dari sisi user
    res.status(400).json({ message: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.params.id,
      },
      include: [{ model: Cabang }],
    });
    const hakAkses = await HakAkses.findOne({
      where: {
        userId: req.params.id,
      },
    });
    const { ...otherDetails } = user.dataValues;
    res.status(200).json({
      ...otherDetails,
      akses: hakAkses,
    });
  } catch (error) {
    // Error 500 = Kesalahan di server
    res.status(500).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    let tempAllUser = [];
    const users = await User.findAll({
      include: [{ model: Cabang }],
    });

    for (let user of users) {
      let hakAkses = await HakAkses.findOne({
        where: {
          userId: user.dataValues.id,
        },
      });
      const { ...otherDetails } = user.dataValues;
      let objectUser = {
        ...otherDetails,
        akses: hakAkses,
      };
      tempAllUser.push(objectUser);
    }

    res.status(200).json(tempAllUser);
  } catch (error) {
    // Error 500 = Kesalahan di server
    res.status(500).json({ message: error.message });
  }
};

const getUsername = async (req, res) => {
  try {
    let tempAllUser = [];
    const users = await User.findAll({
      where: {
        username: req.body.username,
      },
      include: [{ model: Cabang }],
    });

    for (let user of users) {
      let hakAkses = await HakAkses.findOne({
        where: {
          userId: user.dataValues.id,
        },
      });
      const { ...otherDetails } = user.dataValues;
      let objectUser = {
        ...otherDetails,
        akses: hakAkses,
      };
      tempAllUser.push(objectUser);
    }

    res.status(200).json(tempAllUser);
  } catch (error) {
    // Error 500 = Kesalahan di server
    res.status(500).json({ message: error.message });
  }
};

const getKodeKwitansi = async (req, res) => {
  try {
    let tempAllUser = [];
    const users = await User.findAll({
      where: {
        kodeKwitansi: req.body.kodeKwitansi,
        cabangId: req.body.kodeCabang,
      },
      include: [{ model: Cabang }],
    });

    for (let user of users) {
      let hakAkses = await HakAkses.findOne({
        where: {
          userId: user.dataValues.id,
        },
      });
      const { ...otherDetails } = user.dataValues;
      let objectUser = {
        ...otherDetails,
        akses: hakAkses,
      };
      tempAllUser.push(objectUser);
    }

    res.status(200).json(tempAllUser);
  } catch (error) {
    // Error 500 = Kesalahan di server
    res.status(500).json({ message: error.message });
  }
};

const getUsersPerCabang = async (req, res) => {
  try {
    let tempAllUser = [];
    const users = await User.findAll({
      where: {
        cabangId: req.body.kodeCabang,
      },
      include: [{ model: Cabang }],
    });

    for (let user of users) {
      let hakAkses = await HakAkses.findOne({
        where: {
          userId: user.dataValues.id,
        },
      });
      const { ...otherDetails } = user.dataValues;
      let objectUser = {
        ...otherDetails,
        akses: hakAkses,
      };
      tempAllUser.push(objectUser);
    }

    res.status(200).json(tempAllUser);
  } catch (error) {
    // Error 500 = Kesalahan di server
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  updateUser,
  updateUserThenLogin,
  deleteUser,
  getUser,
  getUsers,
  getUsername,
  getKodeKwitansi,
  getUsersPerCabang,
};
