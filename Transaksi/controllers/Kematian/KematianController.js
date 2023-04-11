const Kematian = require("../../models/Kematian/KematianModel.js");
const Stok = require("../../../Master/models/Stok/StokModel.js");
const Cabang = require("../../../Master/models/Cabang/CabangModel.js");
const { formatDate } = require("../../../helper/helper");
const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;

const getKematians = async (req, res) => {
    try {
        let tempAllKematian = [];
        const kematians = await Kematian.findAll({
            where: {
                cabangId: req.body.kodeCabang,
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
            },
            include: [
                { model: Stok },
                { model: Cabang },
            ],
        });

        // Formatting date and Parsing json from string data
        for (let element of kematians) {
            let objectKematian = {
                ...element.dataValues,
                tanggalKematian: formatDate(element.dataValues.tanggalKematian),
            };
            tempAllKematian.push(objectKematian);
        }

        res.status(200).json(tempAllKematian);
    } catch (error) {
        // Error 500 = Kesalahan di server
        res.status(500).json({ message: error.message });
    }
};

const getKematianById = async (req, res) => {
    try {
        const kematian = await Kematian.findOne({
            where: {
                id: req.params.id,
            },
            include: [
                { model: Stok },
                { model: Cabang },
            ],
        });
        res.status(200).json(kematian);
    } catch (error) {
        // Error 404 = Not Found
        res.status(404).json({ message: error.message });
    }
};

const saveKematian = async (req, res) => {
    Object.keys(req.body).forEach(function (k) {
        if (typeof req.body[k] == "string") {
            req.body[k] = req.body[k].toUpperCase().trim();
        }
    });
    let stoks = await Stok.findOne({
        where: {
            kodeStok: req.body.kodeStok,
        },
    });
    try {
        const insertedKematian = await Kematian.create({
            stokId: stoks.id,
            cabangId: req.body.kodeCabang,
            ...req.body,
        });
        // Status 201 = Created
        res.status(201).json(insertedKematian);
    } catch (error) {
        // Error 400 = Kesalahan dari sisi user
        res.status(400).json({ message: error.message });
    }
};

const updateKematian = async (req, res) => {
    Object.keys(req.body).forEach(function (k) {
        if (typeof req.body[k] == "string") {
            req.body[k] = req.body[k].toUpperCase().trim();
        }
    });
    try {
        await Kematian.update(
            { ...req.body, cabangId: req.body.kodeCabang },
            {
                where: {
                    id: req.params.id,
                },
            }
        ).then((num) => {
            // num come from numbers of updated data
            if (num == 1) {
                res.status(200).json({ message: "Kematian Updated!" });
            } else {
                res
                    .status(400)
                    .json({ message: `Kematian ${req.params.id} not found!` });
            }
        });
    } catch (error) {
        // Error 400 = Kesalahan dari sisi user
        res.status(400).json({ message: error.message });
    }
};

const deleteKematian = async (req, res) => {
    try {
        await Kematian.destroy({
            where: {
                id: req.params.id,
            },
        }).then((num) => {
            // num come from numbers of updated data
            if (num == 1) {
                res.status(200).json({ message: "Kematian Deleted!" });
            } else {
                res
                    .status(400)
                    .json({ message: `Kematian ${req.params.id} not found!` });
            }
        });
    } catch (error) {
        // Error 400 = Kesalahan dari sisi user
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getKematians,
    getKematianById,
    saveKematian,
    updateKematian,
    deleteKematian
}