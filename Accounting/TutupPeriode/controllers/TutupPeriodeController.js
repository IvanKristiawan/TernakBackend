const TutupPeriode = require("../../TutupPeriode/models/TutupPeriodeModel.js");
const User = require("../../../User/models/UserModel.js");
const Cabang = require("../../../Master/models/Cabang/CabangModel.js");
const { formatDate } = require("../../../helper/helper");

const getTutupPeriodes = async (req, res) => {
  try {
    let tempAllPeriode = [];
    const periodes = await TutupPeriode.findAll({
      cabangId: req.body.kodeCabang,
    });

    // Formatting date and Parsing json from string data
    for (let element of periodes) {
      let objectPeriode = {
        ...element.dataValues,
        dariTanggal: formatDate(element.dataValues.dariTanggal),
        sampaiTanggal: formatDate(element.dataValues.sampaiTanggal),
      };
      tempAllPeriode.push(objectPeriode);
    }

    res.json(tempAllPeriode);
  } catch (error) {
    // Error 500 = Kesalahan di server
    res.status(500).json({ message: error.message });
  }
};

const getTutupPeriodesAsc = async (req, res) => {
  try {
    let tempAllPeriode = [];
    const periodes = await TutupPeriode.findAll({
      cabangId: req.body.kodeCabang,
      order: [["createdAt", "ASC"]],
    });

    // Formatting date and Parsing json from string data
    for (let element of periodes) {
      let objectPeriode = {
        ...element.dataValues,
        dariTanggal: formatDate(element.dataValues.dariTanggal),
        sampaiTanggal: formatDate(element.dataValues.sampaiTanggal),
      };
      tempAllPeriode.push(objectPeriode);
    }

    res.json(tempAllPeriode);
  } catch (error) {
    // Error 500 = Kesalahan di server
    res.status(500).json({ message: error.message });
  }
};

const getTutupPeriodeByNamaPeriode = async (req, res) => {
  try {
    const periode = await TutupPeriode.findOne({
      where: {
        namaPeriode: req.body.namaPeriode,
        cabangId: req.body.kodeCabang,
      },
    });

    // Formatting date and Parsing json from string data
    let objectPeriode = {
      ...periode.dataValues,
      dariTanggal: formatDate(periode.dataValues.dariTanggal),
      sampaiTanggal: formatDate(periode.dataValues.sampaiTanggal),
    };

    res.json(objectPeriode);
  } catch (error) {
    // Error 500 = Kesalahan di server
    res.status(500).json({ message: error.message });
  }
};

const getTutupPeriodeById = async (req, res) => {
  try {
    const periode = await TutupPeriode.findOne({
      where: {
        id: req.params.id,
      },
    });

    // Formatting date and Parsing json from string data
    let objectPeriode = {
      ...periode.dataValues,
      dariTanggal: formatDate(periode.dataValues.dariTanggal),
      sampaiTanggal: formatDate(periode.dataValues.sampaiTanggal),
    };

    res.json(objectPeriode);
  } catch (error) {
    // Error 404 = Not Found
    res.status(404).json({ message: error.message });
  }
};

const getLastTutupPeriode = async (req, res) => {
  try {
    const periode = await TutupPeriode.findOne({
      where: {
        cabangId: req.body.kodeCabang,
      },
      order: [["createdAt", "DESC"]],
    });

    // Formatting date and Parsing json from string data
    let objectPeriode = {
      ...periode.dataValues,
      dariTanggal: formatDate(periode.dataValues.dariTanggal),
      sampaiTanggal: formatDate(periode.dataValues.sampaiTanggal),
    };

    res.json(objectPeriode);
  } catch (error) {
    // Error 404 = Not Found
    res.status(404).json({ message: error.message });
  }
};

const getLastTutupPeriodeNoFormatDate = async (req, res) => {
  try {
    const periode = await TutupPeriode.findOne({
      where: {
        cabangId: req.body.kodeCabang,
      },
      order: [["createdAt", "DESC"]],
    });

    res.json(periode);
  } catch (error) {
    // Error 404 = Not Found
    res.status(404).json({ message: error.message });
  }
};

const saveLastTutupPeriode = async (req, res) => {
  const periodes = await TutupPeriode.findOne({
    where: {
      cabangId: req.body.kodeCabang,
    },
    order: [["createdAt", "DESC"]],
  });

  let tempDateName;
  let tempTgl = new Date(periodes.dariTanggal);
  let newDateMonth = new Date(tempTgl.setMonth(tempTgl.getMonth() + 1));
  let newBulan =
    newDateMonth.getFullYear() +
    "-" +
    (newDateMonth.getMonth() + 1).toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    }) +
    "-" +
    "01";

  let lastday = function (y, m) {
    return new Date(y, m, 0).getDate();
  };
  let sampaiTgl =
    periodes.sampaiTanggal.getFullYear() +
    "-" +
    (periodes.sampaiTanggal.getMonth() + 2).toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    }) +
    "-" +
    lastday(
      periodes.sampaiTanggal.getDate(),
      periodes.sampaiTanggal.getMonth() + 2
    ).toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });

  // Find Next Month and Year
  let tempNowPeriode = new Date(periodes.dariTanggal);
  let tempNextPeriode = new Date(newDateMonth);

  let isYearChanged =
    tempNowPeriode.getFullYear() !== tempNextPeriode.getFullYear();
  if (isYearChanged) {
    periodes.sampaiTanggal = new Date(
      periodes.sampaiTanggal.setMonth(periodes.sampaiTanggal.getMonth() + 1)
    );
    sampaiTgl =
      periodes.sampaiTanggal.getFullYear() +
      "-" +
      (periodes.sampaiTanggal.getMonth() + 1).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      }) +
      "-" +
      lastday(
        periodes.sampaiTanggal.getDate(),
        periodes.sampaiTanggal.getMonth() + 1
      ).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      });
  }

  switch (newDateMonth.getMonth() + 1) {
    case 1:
      tempDateName = "JANUARI";
      break;
    case 2:
      tempDateName = "FEBRUARI";
      break;
    case 3:
      tempDateName = "MARET";
      break;
    case 4:
      tempDateName = "APRIL";
      break;
    case 5:
      tempDateName = "MEI";
      break;
    case 6:
      tempDateName = "JUNI";
      break;
    case 7:
      tempDateName = "JULI";
      break;
    case 8:
      tempDateName = "AGUSTUS";
      break;
    case 9:
      tempDateName = "SEPTEMBER";
      break;
    case 10:
      tempDateName = "OKTOBER";
      break;
    case 11:
      tempDateName = "NOVEMBER";
      break;
    case 12:
      tempDateName = "DESEMBER";
      break;
    default:
      break;
  }

  try {
    const insertedPeriode = await TutupPeriode.create({
      dariTanggal: newBulan,
      sampaiTanggal: sampaiTgl,
      namaPeriode: `${tempDateName} ${periodes.sampaiTanggal.getFullYear()}`,
      cabangId: req.body.kodeCabang,
    });
    // Status 201 = Created
    res.status(201).json(insertedPeriode);
  } catch (error) {
    // Error 400 = Kesalahan dari sisi user
    res.status(400).json({ message: error.message });
  }
};

const saveTutupPeriode = async (req, res) => {
  Object.keys(req.body).forEach(function (k) {
    if (typeof req.body[k] == "string") {
      req.body[k] = req.body[k].toUpperCase().trim();
    }
  });
  try {
    const insertedPeriode = await TutupPeriode.create({
      ...req.body,
      cabangId: req.body.kodeCabang,
    });
    // Status 201 = Created
    res.status(201).json(insertedPeriode);
  } catch (error) {
    // Error 400 = Kesalahan dari sisi user
    res.status(400).json({ message: error.message });
  }
};

const updateTutupPeriode = async (req, res) => {
  Object.keys(req.body).forEach(function (k) {
    if (typeof req.body[k] == "string") {
      req.body[k] = req.body[k].toUpperCase().trim();
    }
  });
  try {
    await TutupPeriode.update(req.body, {
      where: {
        id: req.params.id,
      },
    }).then((num) => {
      // num come from numbers of updated data
      if (num == 1) {
        res.status(200).json({ message: "Tutup Periode Updated!" });
      } else {
        res
          .status(400)
          .json({ message: `Tutup Periode ${req.params.id} not found!` });
      }
    });
  } catch (error) {
    // Error 400 = Kesalahan dari sisi user
    res.status(400).json({ message: error.message });
  }
};

const deleteTutupPeriode = async (req, res) => {
  try {
    await TutupPeriode.destroy({
      where: {
        id: req.params.id,
      },
    }).then((num) => {
      // num come from numbers of updated data
      if (num == 1) {
        res.status(200).json({ message: "Tutup Periode Deleted!" });
      } else {
        res
          .status(400)
          .json({ message: `Tutup Periode ${req.params.id} not found!` });
      }
    });
  } catch (error) {
    // Error 400 = Kesalahan dari sisi user
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getTutupPeriodes,
  getTutupPeriodesAsc,
  getTutupPeriodeByNamaPeriode,
  getTutupPeriodeById,
  getLastTutupPeriode,
  getLastTutupPeriodeNoFormatDate,
  saveLastTutupPeriode,
  saveTutupPeriode,
  updateTutupPeriode,
  deleteTutupPeriode,
};
