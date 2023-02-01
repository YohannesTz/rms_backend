const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const mediaController = {}

let cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET_KEY,
    secure: true
})

mediaController.create = async (req, res) => {
    const {
        Image
    } = req.files;

    const room_id = parseInt(req.body.room_id);

    if (room_id === null || Image === null) {
        return res.json({
            success: false,
            data: null,
            error: {
                message: "Please enter all the fields"
            }
        });
    }

    let date = Date.now();


    Image.mv(
        __dirname + "/uploads/" + date + "." + Image.name.split(".").pop()
    );

    try {
        let newUrl = await cloudinary.uploader
            .upload(__dirname + "/uploads/" + date + "." + Image.name.split(".").pop(), {
                resource_type: "",
                overwrite: true,
                notification_url: "https://mysite.example.com/notify_endpoint",
            }).then(async (result) => {
                return result.url;
            });

        const media = await prisma.media.create({
            data: {
                roomId: room_id,
                file_url: newUrl
            }
        });


        res.json({
            success: true,
            data: {
                media,
            },
            error: null,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

mediaController.getAllMedias = async (req, res) => {
    const skip = parseInt(req.query.skip);
    const take = parseInt(req.query.take);

    if (skip < 0 || take < 0) {
        return res.json({
            success: false,
            data: null,
            error: {
                msg: "Please enter all fields",
            },
        });
    }


    try {
        const medias = await prisma.media.findMany({
            skip,
            take
        });

        res.json({
            success: true,
            data: {
                medias
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

mediaController.getMediaByRoomId = async (req, res) => {
    const room_id = parseInt(req.params.room_id);

    if (room_id) {
        return res.json({
            success: false,
            data: null,
            error: {
                message: "please enter all the fields"
            }
        });
    }

    try {
        const medias = await prisma.media.findMany({
            where: {
                room_id
            }
        })
        res.json({
            success: true,
            data: {
                medias
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

module.exports = mediaController;