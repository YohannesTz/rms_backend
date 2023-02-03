const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

const usersController = {};

usersController.signUp = async (req, res) => {
    const { email, password, firstName, lastName, phonenumber, bio, role } = req.body;

    if (email === null || password === null || firstName === null || lastName === null || phonenumber === null || bio === null || role === null) {
        return res.json({
            success: false,
            data: null,
            error: {
                message: "Please enter all fields"
            }
        })
    }

    try {
        const checkUserByEmail = await prisma.user.count({
            where: {
                email,
            }
        });

        const checkUserByPhone = await prisma.user.count({
            where: {
                phonenumber
            }
        });

        let isDuplicate = checkUserByEmail > 0 || checkUserByPhone > 0 ? true : false;
        const defaultProfilepic = "/index.png"

        if (isDuplicate) {
            let hashedPassword = bcrypt.hashSync(password, 8);

            const newUser = await prisma.user.create({
                data: {
                    firstName,
                    lastName,
                    email,
                    phonenumber,
                    profile_picture_url : defaultProfilepic,
                    password: hashedPassword,
                    bio,
                    role
                }
            });

            jwt.sign(
                { id: newUser.id },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "60d" },
                (error, token) => {
                    if (error) throw error;
                    res.json({
                        success: true,
                        data: {
                            token,
                            user: {
                                ...newUser
                            }
                        },
                        error: null
                    })
                }
            );
        } else {
            res.json({
                success: false,
                data: null,
                error: {
                    message: "Email or Phonenumber already in use"
                }
            });
        }
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            data: null,
            error: error
        });
    }
}

usersController.login = async (req, res) => {
    const { email, password } = req.body;

    if (email === null || password === null) {
        return res.json({
            success: false,
            data: null,
            error: {
                message: "Please enter all fields"
            }
        })
    }

    try {
        const user = await prisma.user.findMany({
            where: {
                email,
            }
        });

        if (user[0]) {
            bcrypt.compare(password, user[0].password).then((result) => {
                if (result) {
                    jwt.sign(
                        { id: user[0].id },
                        process.env.ACCESS_TOKEN_SECRET,
                        { expiresIn: "60d" },
                        (error, token) => {
                            if (error) throw error;
                            res.json({
                                success: true,
                                data: {
                                    token: token,
                                    ...user[0],
                                },
                                error: null
                            })
                        }
                    )
                } else {
                    return res.json({
                        success: false,
                        data: null,
                        error: {
                            message: "Invalid email or password",
                        }
                    });
                }
            })
        } else {
            return res.json({
                success: false,
                data: null,
                error: {
                    msg: "Invalid email or password",
                },
            });
        }
    } catch (error) {
        return res.json({
            success: false,
            data: null,
            error: {
                msg: "Invalid email or password",
            },
        });
    }
}

usersController.editProfile = async (req, res) => {
    const { id, email, firstName, lastName, phonenumber, bio } = req.body;

    if (
        id < 0 ||
        firstName === null ||
        lastName === null ||
        email === null ||
        phonenumber === null ||
        bio === null
    ) {
        return res.json({
            success: false,
            data: null,
            error: {
                message: "Please enter all fields"
            }
        })
    }

    try {
        const updatedUserData = await prisma.user.update({
            where: {
                id,
            },
            data: {
                firstName,
                lastName,
                email,
                phonenumber,
                bio
            },
        });

        res.json({
            success: true,
            data: {
                ...updatedUserData
            },
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            data: null,
            error: error,
        })
    }
}

usersController.getAllUsers = async (req, res) => {
    const skip = parseInt(req.query.skip);
    const take = parseInt(req.query.take);

    if (skip < 0 || take < 0 || skip  === null || take) {
        return res.json({
            success: false,
            data: null,
            error: {
                msg: "Please enter all fields",
            },
        });
    }

    try {
        const users = await prisma.user.findMany({
            skip,
            take,
            where: {}
        });

        res.json({
            success: true,
            data: {
                users,
            },
            error: null,
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

usersController.getUserById = async (req, res) => {
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
        const users = await prisma.user.findMany({
            where: {
                id,
            }
        })

        res.json({
            success: true,
            data: {
                ...users[0],
            },
            error: null,
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

usersController.getUsersByEmail = async (req, res) => {
    const email = req.params.email;

    if (email === null) {
        return res.json({
            success: false,
            data: null,
            error: {
                message: "Please Enter all fields"
            }
        })
    }

    try {
        const users = await prisma.user.findMany({
            where: {
                email,
            }
        })

        res.json({
            success: true,
            data: {
                ...users[0],
            },
            error: null,
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

module.exports = usersController;