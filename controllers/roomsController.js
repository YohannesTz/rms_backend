const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require("fs");
require("dotenv").config();

const roomsController = {};
const prisma = new PrismaClient();

roomsController.create = async (req, res) => {
    const {
        home_type,
        room_type,
        total_occupancy,
        total_bedrooms,
        total_bathrooms,
        summary,
        address,
        has_tv,
        has_kitchen,
        has_air_con,
        has_heating,
        has_internet,
        price,
        date,
        latitude,
        longtude,
        is_available
    } = req.body;

    console.log(req.body);

    if (
        home_type === null ||
        room_type === null ||
        total_occupancy === null ||
        total_bedrooms === null ||
        total_bathrooms === null ||
        summary === null ||
        address === null ||
        has_tv === null ||
        has_kitchen === null ||
        has_air_con === null ||
        has_heating === null ||
        has_internet === null ||
        price === null ||
        date === null ||
        latitude === null ||
        longtude === null ||
        is_available === null
    ) {
        return res.json({
            success: false,
            data: null,
            error: {
                msg: "Please enter all fields",
            },
        });
    }

    try {
        const newRoom = await prisma.room.create({
            data: {
                home_type,
                room_type,
                total_occupancy,
                total_bedrooms,
                total_bathrooms,
                summary,
                address,
                has_tv,
                has_kitchen,
                has_air_con,
                has_heating,
                has_internet,
                price,
                latitude,
                longtude,
                is_available
            },
        });

        res.json({
            success: true,
            data: {
                ...newRoom
            },
            error: null
        });
    } catch (error) {
        console.log(error);
        if (error.code === 'P2003') {
            res.json({
                success: false,
                data: null,
                error: {
                    msg: `${error.meta.field_name} not found`,
                },
            });
        } else {
            return res.json({
                success: false,
                data: null,
                error: error.meta
            });
        }
    }
}

roomsController.getAllRooms = async (req, res) => {
    const skip = parseInt(req.query.skip);
    const take = parseInt(req.query.take);

    if (skip < 0 || take < 0) {
        return res.json({
            success: false,
            data: null,
            error: {
                message: "Please enter all fields"
            }
        });
    }

    try {
        const rooms = await prisma.room.findMany({
            skip,
            take,
            where: {}
        });
        res.json({
            success: true,
            data: {
                rooms
            },
            error: null
        })
    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            data: null,
            error: error,
        });
    }
}

roomsController.getRoomById = async (req, res) => {
    const id = parseInt(req.params.id);

    if (id === null) {
        return res.json({
            success: false,
            data: null,
            error: {
                message: "Please Enter all fields"
            }
        })
    }

    try {
        const rooms = await prisma.room.findMany({
            where: {
                id
            }
        })
        res.json({
            success: true,
            data: {
                ...rooms[0]
            },
            error: null
        })
    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            data: null,
            error: error,
        });
    }
}

roomsController.getAllAvailableRooms = async (req, res) => {
    const skip = parseInt(req.query.skip);
    const take = parseInt(req.query.take);

    if (skip < 0 || take < 0) {
        return res.json({
            success: false,
            data: null,
            error: {
                message: "Please enter all fields"
            }
        });
    }

    try {
        const rooms = await prisma.room.findMany({
            skip,
            take,
            where: {
                is_available: true
            }
        });
        res.json({
            success: true,
            data: {
                rooms
            },
            error: null
        })
    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            data: null,
            error: error,
        });
    }
}

roomsController.getRoomByLordId = async (req, res) => {
    const lordId = parseInt(req.params.lordId);

    if (lordId === null) {
        return res.json({
            success: false,
            data: null,
            error: {
                msg: "Please enter all fields"
            }
        })
    }

    try {
        const rooms = await prisma.room.findMany({
            where: {
                landLordId: lordId
            }
        });

        res.json({
            success: true,
            data: {
                rooms
            },
            error: null
        })
    } catch (error) {
        if (error.code === 'P2003') {
            return res.json({
                success: false,
                data: null,
                error: {
                    msg: error.meta.cause
                }
            })
        } else {
            console.log(error);
            return res.json({
                success: false,
                data: null,
                error: error
            })
        }
    }
}

roomsController.editRoom = async (req, res) => {
    const {
        id,
        home_type,
        room_type,
        total_occupancy,
        total_bedrooms,
        total_bathrooms,
        summary,
        address,
        has_tv,
        has_kitchen,
        has_air_con,
        has_heating,
        has_internet,
        price,
        date,
        latitude,
        longtude,
        is_available
    } = req.body;

    if (
        id < 0 ||
        home_type === null ||
        room_type === null ||
        total_occupancy === null ||
        total_bedrooms === null ||
        total_bathrooms === null ||
        summary === null ||
        address === null ||
        has_tv === null ||
        has_kitchen === null ||
        has_air_con === null ||
        has_heating === null ||
        has_internet === null ||
        price === null ||
        date === null ||
        latitude === null ||
        longtude === null ||
        is_available === null
    ) {
        return res.json({
            success: false,
            data: null,
            error: {
                msg: "Please enter all fields",
            },
        });
    }

    try {
        const updatedRoomData = await prisma.room.update({
            where: {
                id,
            },
            data: {
                home_type,
                room_type,
                total_occupancy,
                total_bedrooms,
                total_bathrooms,
                summary,
                address,
                has_tv,
                has_kitchen,
                has_air_con,
                has_heating,
                has_internet,
                price,
                date,
                latitude,
                longtude,
                is_available
            }
        });

        res.json({
            success: true,
            data: {
                ...updatedRoomData
            },
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            data: null,
            error: error,
        });
    }
}

module.exports = roomsController;