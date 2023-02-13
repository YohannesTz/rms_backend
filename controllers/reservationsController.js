const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const reservationsController = {}
const nodemailer = require("nodemailer");
require("dotenv").config();
const { ACCEPTION_EMAIL, REJECTION_EMAIL } = require("../util/util");

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: "bobby.von60@ethereal.email", // this was intentional
        pass: "N4Ww7gjFANR3Wxsnpf" // this was intentional
    }
});

reservationsController.create = async (req, res) => {
    const {
        userId,
        roomId,
        start_date,
        end_date,
        price,
        lordId
    } = req.body;

    console.log(req.body);

    if (
        isNaN(userId) ||
        isNaN(roomId) ||
        start_date === null ||
        end_date === null ||
        isNaN(price)
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
        let startDate = new Date(start_date);
        let endDate = new Date(end_date);
        let diff = endDate.getTime() - startDate.getTime();
        let datesInbetween = Math.ceil(diff / (1000 * 3600 * 24));

        let totalPrice = +price;

        if (datesInbetween > 1) {
            totalPrice = price * datesInbetween;
        }

        const reservation = await prisma.reservation.count({
            where: {
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
                    status: "pending",
                    lordId
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

reservationsController.getReservationByLordId = async (req, res) => {
    const { lordId } = req.params;
    console.log(req.params);

    if (isNaN(lordId)) {
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
                lordId: parseInt(lordId)
            },
            include: {
                room: true,
                user: true
            }
        });

        res.json({
            success: true,
            data: { reservations },
            error: null
        });
    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            data: null,
            error: error
        });
    }
}

/* reservationsController.acceptReservation = async (req, res) => {
    const {
        resId
    } = req.params;

    if (isNaN(resId)) {
        return res.json({
            success: false,
            data: null,
            error: {
                msg: "Please enter all fields",
            },
        });
    }

    try {

        //send Email here
        let info = await transporter.sendMail({
            from: 'Search Homes Ethiopia <support@searchhomes.com>',
            to: "user@gmail.com",
            subject: "Reservation Booked Successfully!",
            text: "Your Reservation is accepted."
        })

        let emailUrl = nodemailer.getTestMessageUrl(info);

        console.log("preview: ", emailUrl);

        const candidateReservation = await prisma.reservation.findMany({
            where: {
                id: parseInt(resId)
            }
        })

        console.log(candidateReservation);


        const reservation = await prisma.$transaction([
            prisma.reservation.update({
                where: {
                    id: parseInt(resId)
                },
                data: {
                    status: emailUrl
                }
            }),
            prisma.room.update({
                where: {
                    id: candidateReservation[0].id
                },

                data: {
                    is_available: false
                }
            })
        ])

        console.log(reservation);

        res.json({
            success: true,
            data: {
                reservation
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
 */
reservationsController.acceptReservation = async (req, res) => {
    const {
        resId
    } = req.params;

    if (isNaN(resId)) {
        return res.json({
            success: false,
            data: null,
            error: {
                msg: "Please enter all fields",
            },
        });
    }

    try {

        //send Email here
        let info = await transporter.sendMail({
            from: 'Search Homes Ethiopia <support@searchhomes.com>',
            to: "user@gmail.com",
            subject: "Reservation was Declined!",
            html: ACCEPTION_EMAIL
        })

        let emailUrl = nodemailer.getTestMessageUrl(info);


        const candidateReservation = await prisma.reservation.findMany({
            where: {
                id: parseInt(resId)
            }
        })

        const reservation = await prisma.$transaction([
            prisma.reservation.update({
                where: {
                    id: parseInt(resId)
                },
                data: {
                    status: `accepted;${emailUrl}`
                }
            }),
            prisma.room.update({
                where: {
                    id: candidateReservation[0].id
                },

                data: {
                    is_available: false
                }
            })
        ])

        res.json({
            success: true,
            data: {
                reservation
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

reservationsController.rejectReservation = async (req, res) => {
    const {
        resId
    } = req.params;

    if (isNaN(resId)) {
        return res.json({
            success: false,
            data: null,
            error: {
                msg: "Please enter all fields",
            },
        });
    }

    try {

        //send Email here
        let info = await transporter.sendMail({
            from: 'Search Homes Ethiopia <support@searchhomes.com>',
            to: "yohannes222ethiopia@gmail.com",
            subject: "Reservation Booked Successfully!",
            html: REJECTION_EMAIL
        })

        let emailUrl = nodemailer.getTestMessageUrl(info);

        console.log("preview: ", emailUrl);

        const reservation = await prisma.reservation.update({
            where: {
                id: parseInt(resId)
            },
            data: {
                status: `declined;${emailUrl}`
            }
        });

        res.json({
            success: true,
            data: {
                reservation
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
            include: {
                room: true,
                user: true
            }
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
            },
            include: {
                room: true,
                user: true
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
            },
            include: {
                room: true,
                user: true
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
            },
            include: {
                room: true,
                user: true
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
            },
            include: {
                room: true,
                user: true
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