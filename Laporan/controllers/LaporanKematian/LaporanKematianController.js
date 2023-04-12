const Kematian = require("../../../Transaksi/models/Kematian/KematianModel.js");
const Stok = require("../../../Master/models/Stok/StokModel.js");
const Cabang = require("../../../Master/models/Cabang/CabangModel.js");
const { formatDate } = require("../../../helper/helper");
const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;

const getLaporanKematian = async (req, res) => {
    try {
        let kematians = [];
        let whereClause = {
            [Op.and]: [
                {
                    tanggalKematian: {
                        [Op.gte]: new Date(req.body.dariTanggal),
                    },
                },
                {
                    tanggalKematian: {
                        [Op.lte]: new Date(req.body.sampaiTanggal),
                    },
                },
            ],
        };
        let includeClause = [{ model: Stok }, { model: Cabang }];

        let isStokExist = req.body.kodeStok;

        if (isStokExist) {
            includeClause[0]["where"] = {
                kodeStok: req.body.kodeStok,
            };
        }

        let isCabangExist = req.body.kodeCabang;

        if (isCabangExist) {
            whereClause["cabangId"] = req.body.kodeCabang;
        }

        kematians = await Kematian.findAll({
            where: whereClause,
            include: includeClause,
        });

        let tempKematians = [];
        let groupBy;

        for (let kematian of kematians) {
            let kematianObject = {
                ...kematian.dataValues,
                tanggalKematian: formatDate(kematian.dataValues.tanggalKematian),
                groupStok: `${kematian.stok.dataValues.kodeStok} - ${kematian.stok.dataValues.namaStok}`,
            };
            tempKematians.push(kematianObject);
        }

        let isGroupByStok = req.body.grouping === "STOK";

        if (isGroupByStok) {
            groupBy = tempKematians.reduce((group, kematian) => {
                const { groupStok } = kematian;
                group[groupStok] = group[groupStok] ?? [];
                group[groupStok].push(kematian);
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
    getLaporanKematian
}