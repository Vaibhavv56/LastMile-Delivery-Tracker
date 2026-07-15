import {

    createCustomerService,

    getAllCustomersService,

    getCustomerByIdService,

    updateCustomerService,

    deleteCustomerService

} from "../services/customer.service.js";

export const createCustomer = async (req, res) => {

    try {

        const customer = await createCustomerService(req.body);

        res.status(201).json({

            success: true,

            message: "Customer created successfully.",

            data: customer

        });

    }

    catch (err) {

        res.status(400).json({

            success: false,

            message: err.message

        });

    }

};

export const getAllCustomers = async (req, res) => {

    const customers = await getAllCustomersService();

    res.json({

        success: true,

        data: customers

    });

};

export const getCustomerById = async (req, res) => {

    const customer = await getCustomerByIdService(Number(req.params.id));

    if (!customer) {

        return res.status(404).json({

            success: false,

            message: "Customer not found."

        });

    }

    res.json({

        success: true,

        data: customer

    });

};

export const updateCustomer = async (req, res) => {

    try {

        const customer = await updateCustomerService(

            Number(req.params.id),

            req.body

        );

        res.json({

            success: true,

            message: "Customer updated successfully.",

            data: customer

        });

    }

    catch (err) {

        res.status(400).json({

            success: false,

            message: err.message

        });

    }

};

export const deleteCustomer = async (req, res) => {

    await deleteCustomerService(Number(req.params.id));

    res.json({

        success: true,

        message: "Customer deactivated successfully."

    });

};