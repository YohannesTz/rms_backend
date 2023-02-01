const express = require("express");
const cors = require("cors");
const route = require("./routes/routes");
const fileUpload = require("express-fileupload");
const { PrismaClient } = require("@prisma/client");

require("dotenv").config();

const prisma = new PrismaClient();
const port = process.env.PORT || 4000;

async function connectDB() {
    try {
        await prisma.$connect();
        console.log("Database connection successfull");
    } catch (error) {
        console.log(error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

connectDB();

const app = express();

app.use(express.json());
app.use(cors());
app.use(fileUpload());
app.use(express.static('public'));
app.use("/api", route);

app.get("/", async(req, res) => {
    res.send({
        "status": "running..."
    });
})

console.log("Server will be running on " + port)
app.listen(port);