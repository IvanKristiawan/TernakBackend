const Beli = require("../../../Transaksi/models/Pembelian/Beli/BeliModel.js");
const BeliChild = require("../../../Transaksi/models/Pembelian/BeliChild/BeliChildModel.js");
const Stok = require("../../../Master/models/Stok/StokModel.js");
const Supplier = require("../../../Master/models/Supplier/SupplierModel.js");
const Jual = require("../../../Transaksi/models/Penjualan/Jual/JualModel");
const JualChild = require("../../../Transaksi/models/Penjualan/JualChild/JualChildModel.js");
const Cabang = require("../../../Master/models/Cabang/CabangModel.js");
const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;

const getLaporanLabaRugi = async (req, res) => {
  try {
    let jualChilds;
    let beliChilds = await BeliChild.findAll({
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

    var resultBeli = [];
    beliChilds.reduce(function (res, value) {
      if (!res[value]) {
        res[value] = {
          nama: "PEMBELIAN",
          jumlah: 0,
        };
        resultBeli.push(res[value]);
      }
      res[value].jumlah += value.subtotalBeliChild;
      return res;
    }, {});

    jualChilds = await JualChild.findAll({
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

    var resultJual = [];
    jualChilds.reduce(function (res, value) {
      if (!res[value]) {
        res[value] = {
          nama: "PENJUALAN",
          jumlah: 0,
        };
        resultJual.push(res[value]);
      }
      res[value].jumlah += value.subtotalJualChild;
      return res;
    }, {});

    let result = [];
    for (let beli of resultBeli) {
      result.push(beli);
    }
    for (let jual of resultJual) {
      result.push(jual);
    }
    let objectLabaRugi = {
      nama: "LABA RUGI",
      jumlah: result[1].jumlah - result[0].jumlah,
    };
    result.push(objectLabaRugi);

    res.status(200).json(result);
  } catch (error) {
    // Error 500 = Kesalahan di server
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getLaporanLabaRugi,
};
