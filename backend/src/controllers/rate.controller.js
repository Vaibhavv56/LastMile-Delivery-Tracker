import {
    createRateService,
    getAllRatesService,
    getRateByIdService,
    updateRateService,
    deleteRateService
} from "../services/rate.service.js";

export const createRate = async (req, res) => {

    try {

        const rate = await createRateService(req.body);

        res.status(201).json({
            success: true,
            message: "Rate card created successfully.",
            data: rate
        });

    } catch (err) {

        res.status(400).json({
            success: false,
            message: err.message
        });

    }

};

export const getAllRates = async (req, res) => {

    const rates = await getAllRatesService();

    res.json({
        success: true,
        data: rates
    });

};

export const getRateById = async (req, res) => {

    const rate = await getRateByIdService(Number(req.params.id));

    if (!rate) {
        return res.status(404).json({
            success: false,
            message: "Rate card not found."
        });
    }

    res.json({
        success: true,
        data: rate
    });

};

export const updateRate = async (req, res) => {

    try {

        const rate = await updateRateService(
            Number(req.params.id),
            req.body
        );

        res.json({
            success: true,
            message: "Rate card updated successfully.",
            data: rate
        });

    } catch (err) {

        res.status(400).json({
            success: false,
            message: err.message
        });

    }

};

export const deleteRate = async (req, res) => {

    try {

        await deleteRateService(Number(req.params.id));

        res.json({
            success: true,
            message: "Rate card deleted successfully."
        });

    } catch (err) {

        res.status(400).json({
            success: false,
            message: err.message
        });

    }

};