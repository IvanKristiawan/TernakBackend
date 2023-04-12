const Jual = require("../../../Transaksi/models/Penjualan/Jual/JualModel");
const JualChild = require("../../../Transaksi/models/Penjualan/JualChild/JualChildModel.js");
const Stok = require("../../../Master/models/Stok/StokModel.js");
const Cabang = require("../../../Master/models/Cabang/CabangModel.js");
const { formatDate } = require("../../../helper/helper");
const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;

const getLaporanPenjualan = async (req, res) => {
  try {
    let jualChilds = [];
    let whereClause = {
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
    };
    let includeClause = [{ model: Jual }, { model: Stok }, { model: Cabang }];

    let isStokExist = req.body.kodeStok;

    if (isStokExist) {
      includeClause[1]["where"] = {
        kodeStok: req.body.kodeStok,
      };
    }

    let isCabangExist = req.body.kodeCabang;

    if (isCabangExist) {
      whereClause["cabangId"] = req.body.kodeCabang;
    }

    jualChilds = await JualChild.findAll({
      where: whereClause,
      include: includeClause,
    });

    let tempJualChilds = [];
    let groupBy;

    for (let jualChild of jualChilds) {
      let jualChildObject = {
        ...jualChild.dataValues,
        tanggalJual: formatDate(jualChild.dataValues.tanggalJual),
        groupStok: `${jualChild.stok.dataValues.kodeStok} - ${jualChild.stok.dataValues.namaStok}`,
      };
      tempJualChilds.push(jualChildObject);
    }

    let isGroupByStok = req.body.grouping === "STOK";

    if (isGroupByStok) {
      groupBy = tempJualChilds.reduce((group, beliChild) => {
        const { groupStok } = beliChild;
        group[groupStok] = group[groupStok] ?? [];
        group[groupStok].push(beliChild);
        return group;
      }, {});
    }
    res.status(200).json(groupBy);
  } catch (error) {
    // Error 500 = Kesalahan di server
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getLaporanPenjualan,
};
