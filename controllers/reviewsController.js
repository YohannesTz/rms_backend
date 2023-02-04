const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const reviewsController = {}

reviewsController.create = async (req, res) => {
    const {
        user_id,
        room_id,
        comment,
        rating
    } = req.body;

    if (
        user_id === null ||
        room_id === null ||
        comment === null ||
        rating === null
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
        const review = await prisma.review.count({
            where: {
                user_id,
                room_id
            }
        });

        if (review === 0) {
            const newReview = await prisma.review.create({
                data: {
                    user_id,
                    room_id,
                    comment,
                    rating
                }
            })

            res.json({
                success: true,
                data: {
                    newReview
                },
                error: null
            });
        } else {
            res.json({
                success: true,
                data: null,
                error: {
                    msg: "review already submitted"
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

reviewsController.getAllReview = async (req, res) => {
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
        const reviews = await prisma.review.findMany({
            skip,
            take
        });

        res.json({
            success: true,
            data: {
                reviews
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

reviewsController.getReviewById = async (req, res) => {
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
        const reviews = await prisma.review.findMany({
            where: {
                id
            }
        })

        res.json({
            success: true,
            data: {
                ...reviews[0]
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

reviewsController.getReviewByRoomId = async (req, res) => {
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
        const reviews = await prisma.review.findMany({
            where: {
                room_id: roomId
            }
        })
        res.json({
            success: true,
            data: {
                reviews
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

reviewsController.getReviewByUserId = async (req, res) => {
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
        const reviews = await prisma.review.findMany({
            where: {
                user_id: userId
            },
        })
        res.json({
            success: true,
            data: {
                reviews
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

reviewsController.updateReview = async (req, res) => {
    const {
        id,
        room_id,
        user_id,
        comment,
        rating
    } = req.body;


    if (
        id < 0 ||
        room_id === null ||
        user_id === null ||
        comment === null ||
        rating === null) {
        return res.json({
            success: false,
            data: null,
            error: {
                msg: "Please enter all fields",
            },
        });
    }

    try {
        const updatedReview = await prisma.review.update({
            where: {
                id
            },
            data: {
                user_id,
                room_id,
                comment,
                rating
            }
        })

        res.json({
            success: true,
            data: {
                ...updatedReview
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

reviewsController.deleteReview = async (req, res) => {
    const {
        id
    } = req.body;


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
        const updatedReview = await prisma.review.update({
            where: {
                id
            },
            data: {
                user_id,
                room_id,
                comment: "[review was removed by user]",
                rating: -1
            }
        })

        res.json({
            success: true,
            data: {
                ...updatedReview
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

module.exports = reviewsController;