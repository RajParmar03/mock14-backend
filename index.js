const express = require("express");
const connection = require("./config/db");
const cors = require("cors");


const app = express();

app.use(cors());
app.use(express.json());



app.listen(8080 , async () => {
    try {
        await connection;
        console.log("successfully connected with DB...");
    } catch (error) {
        console.log("failed to connect with DB...");
    }
    console.log("server is successfully started at 8080...");
});