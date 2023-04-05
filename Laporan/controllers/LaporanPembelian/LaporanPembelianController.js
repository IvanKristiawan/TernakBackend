const Beli = require("../../../Transaksi/models/Pembelian/Beli/BeliModel.js");
const BeliChild = require("../../../Transaksi/models/Pembelian/BeliChild/BeliChildModel.js");
const Stok = require("../../../Master/models/Stok/StokModel.js");
const Supplier = require("../../../Master/models/Supplier/SupplierModel.js");
const Cabang = require("../../../Master/models/Cabang/CabangModel.js");
const { formatDate } = require("../../../helper/helper");
const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;

const getLaporanPembelian = async (req, res) => {
  try {
    let beliChilds = [];
    let whereClause = {
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
    };
    let includeClause = [
      { model: Beli },
      { model: Stok },
      { model: Supplier },
      { model: Cabang },
    ];

    let isStokAndSupplierExist = req.body.stokId && req.body.supplierId;
    let isStokExist = req.body.stokId;
    let isSupplierExist = req.body.supplierId;

    if (isStokAndSupplierExist) {
      includeClause[1]["where"] = {
        kodeStok: req.body.kodeStok,
      };
      whereClause["supplierId"] = req.body.supplierId;
    } else if (isStokExist) {
      includeClause[1]["where"] = {
        kodeStok: req.body.kodeStok,
      };
    } else if (isSupplierExist) {
      whereClause["supplierId"] = req.body.supplierId;
    }

    let isCabangExist = req.body.kodeCabang;

    if (isCabangExist) {
      whereClause["cabangId"] = req.body.kodeCabang;
    }

    beliChilds = await BeliChild.findAll({
      where: whereClause,
      include: includeClause,
    });

    let tempBeliChilds = [];
    let groupBy;

    for (let beliChild of beliChilds) {
      let beliChildObject = {
        ...beliChild.dataValues,
        tanggalBeli: formatDate(beliChild.dataValues.tanggalBeli),
        groupStok: `${beliChild.stok.dataValues.kodeStok} - ${beliChild.stok.dataValues.namaStok}`,
        groupSupplier: `${beliChild.supplier.dataValues.kodeSupplier} - ${beliChild.supplier.dataValues.namaSupplier}`,
      };
      tempBeliChilds.push(beliChildObject);
    }

    let isGroupByStok = req.body.grouping === "STOK";
    let isGroupBySupplier = req.body.grouping === "SUPPLIER";

    if (isGroupByStok) {
      groupBy = tempBeliChilds.reduce((group, beliChild) => {
        const { groupStok } = beliChild;
        group[groupStok] = group[groupStok] ?? [];
        group[groupStok].push(beliChild);
        return group;
      }, {});
    } else if (isGroupBySupplier) {
      groupBy = tempBeliChilds.reduce((group, beliChild) => {
        const { groupSupplier } = beliChild;
        group[groupSupplier] = group[groupSupplier] ?? [];
        group[groupSupplier].push(beliChild);
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
  getLaporanPembelian,
};
