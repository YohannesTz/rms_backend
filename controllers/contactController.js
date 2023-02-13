const { PrismaClient } = require("@prisma/client");
const contactController = {};
const prisma = new PrismaClient();

contactController.create = async (req, res) => {
    const {
        name,
        email,
        phonenumber,
        telegram_username,
        note
    } = req.body;

    if (name === null ||
        email === null ||
        phonenumber === null ||
        telegram_username === null ||
        note === null) {
        return res.json({
            success: false,
            data: null,
            error: {
                msg: "Please enter all fields",
            },
        });
    }

    try {
        const contact = await prisma.contact.create({
            data: {
                name,
                email,
                phonenumber,
                telegram_username,
                note
            },
        });

        res.json({
            success: true,
            data: {
                ...contact
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

contactController.getAllContacts = async (req, res) => {
    const skip = parseInt(req.query.skip);
    const take = parseInt(req.query.take);

    if (isNaN(skip) || isNaN(take)) {
        return res.json({
            success: false,
            data: null,
            error: {
                message: "Please enter all fields"
            }
        });
    }

    try {
        const contacts = await prisma.contact.findMany({
            skip,
            take
        });

        res.json({
            success: true,
            data: {
                contacts
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

module.exports = contactController;