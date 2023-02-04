const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const reservationsController = {}

reservationsController.create = async (req, res) => {
    const {
        userId,
        roomId,
        start_date,
        end_date,
        price
    } = req.body;

    if (
        userId === null ||
        roomId === null ||
        start_date === null ||
        end_date === null ||
        price === null
    ) {
        return res.json({
            success: false,
            data: null,
            error: {
                msg: "Please enter all fields"
            }
        })
    }

    try {
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);
        const datesInbetween = startDate - endDate;

        let totalPrice = price;

        if (datesInbetween > 1) {
            totalPrice = price * datesInbetween;
        }

        const reservation = await prisma.reservation.count({
            while: {
                roomId,
                userId,
                start_date,
                end_date
            }
        });

        if (reservation === 0) {
            const newReservation = await prisma.reservation.create({
                data: {
                    roomId,
                    userId,
                    start_date,
                    end_date,
                    total_price: totalPrice,
                }
            });

            res.json({
                success: true,
                data: {
                    ...newReservation
                },
                error: null
            })
        } else {
            res.json({
                success: true,
                data: null,
                error: {
                    msg: "reservation already exists"
                }
            })
        }
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

reservationsController.getAllReservations = async (req, res) => {
    const skip = parseInt(req.query.skip);
    const take = parseInt(req.query.take);

    if (isNaN(skip) || isNaN(take)) {
        return res.json({
            success: false,
            data: null,
            error: {
                msg: "Please enter all fields",
            },
        });
    }

    try {
        const reservations = await prisma.reservation.findMany({
            skip,
            take,
            where: {}
        });

        res.json({
            success: true,
            data: {
                reservations
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

reservationsController.getReservationById = async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.json({
            success: false,
            data: null,
            error: {
                msg: "Please enter all fields",
            },
        });
    }

    try {
        const reservations = await prisma.reservation.findMany({
            where: {
                id
            }
        });

        res.json({
            success: true,
            data: {
                ...reservations[0]
            },
            error: null
        });
    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            data: null,
            error: error,
        });
    }
}

reservationsController.getReservationByUserId = async (req, res) => {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
        return res.json({
            success: false,
            data: null,
            error: {
                msg: "Please enter all fields",
            },
        });
    }

    try {
        const reservations = await prisma.reservation.findMany({
            where: {
                userId
            }
        });

        res.json({
            success: true,
            data: {
                reservations
            },
            error: null
        });
    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            data: null,
            error: error,
        });
    }
}

reservationsController.getAllReservationsByRoomId = async (req, res) => {
    const roomId = parseInt(req.params.roomId);

    if (isNaN(roomId)) {
        return res.json({
            success: false,
            data: null,
            error: {
                msg: "Please enter all fields",
            },
        });
    }

    try {
        const reservations = await prisma.reservation.findMany({
            where: {
                roomId
            }
        });

        res.json({
            success: true,
            data: {
                reservations
            },
            error: null
        });
    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            data: null,
            error: error,
        });
    }
}

reservationsController.getReservationsByRoomAndUserId = async (req, res) => {
    const userId = parseInt(req.params.userId);
    const roomId = parseInt(req.params.roomId);

    if (isNaN(userId) || isNaN(roomId)) {
        return res.json({
            success: false,
            data: null,
            error: {
                msg: "Please enter all fields",
            },
        });
    }

    try {
        const reservations = await prisma.reservation.findMany({
            where: {
                userId,
                roomId
            }
        });

        res.json({
            success: true,
            data: {
                reservations
            },
            error: null
        });
    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            data: null,
            error: error,
        });
    }
}

module.exports = reservationsController;