import {
    createAreaService,
    getAllAreasService,
    getAreaByIdService,
    updateAreaService,
    deleteAreaService
} from "../services/area.service.js";

export const createArea = async (req, res) => {
    try {

        const area = await createAreaService(req.body);

        res.status(201).json({
            success: true,
            message: "Area created successfully.",
            data: area
        });

    } catch (err) {

        res.status(400).json({
            success: false,
            message: err.message
        });

    }
};

export const getAllAreas = async (req, res) => {

    const areas = await getAllAreasService();

    res.json({
        success: true,
        data: areas
    });

};

export const getAreaById = async (req, res) => {

    const area = await getAreaByIdService(Number(req.params.id));

    if (!area) {

        return res.status(404).json({
            success: false,
            message: "Area not found"
        });

    }

    res.json({
        success: true,
        data: area
    });

};

export const updateArea = async (req, res) => {

    try {

        const area = await updateAreaService(
            Number(req.params.id),
            req.body
        );

        res.json({
            success: true,
            message: "Area updated successfully.",
            data: area
        });

    } catch (err) {

        res.status(400).json({
            success: false,
            message: err.message
        });

    }

};

export const deleteArea = async (req, res) => {

    try {

        await deleteAreaService(Number(req.params.id));

        res.json({
            success: true,
            message: "Area deleted successfully."
        });

    } catch (err) {

        res.status(400).json({
            success: false,
            message: err.message
        });

    }

};