import {
    createZoneService,
    getAllZonesService,
    getZoneByIdService,
    updateZoneService,
    deleteZoneService
} from "../services/zone.service.js";

export const createZone = async (req, res) => {

    try {

        const zone = await createZoneService(req.body);

        return res.status(201).json({
            success: true,
            message: "Zone created successfully.",
            data: zone
        });

    } catch (err) {

        return res.status(400).json({
            success: false,
            message: err.message
        });

    }

};

export const getAllZones = async (req, res) => {

    try {

        const zones = await getAllZonesService();

        res.json({
            success: true,
            data: zones
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

export const getZoneById = async (req, res) => {

    try {

        const zone = await getZoneByIdService(Number(req.params.id));

        if (!zone) {

            return res.status(404).json({
                success: false,
                message: "Zone not found"
            });

        }

        res.json({
            success: true,
            data: zone
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

export const updateZone = async (req, res) => {

    try {

        const zone = await updateZoneService(
            Number(req.params.id),
            req.body
        );

        res.json({
            success: true,
            message: "Zone updated successfully.",
            data: zone
        });

    } catch (err) {

        res.status(400).json({
            success: false,
            message: err.message
        });

    }

};

export const deleteZone = async (req, res) => {

    try {

        await deleteZoneService(Number(req.params.id));

        res.json({
            success: true,
            message: "Zone deleted successfully."
        });

    } catch (err) {

        res.status(400).json({
            success: false,
            message: err.message
        });

    }

};