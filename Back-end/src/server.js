const express = require("express");
const Controller = require("./controller");
const cors = require("cors");

const server = express();
const PORT = 8080;

server.use(cors());
server.use(express.json());

server.get("/foods", Controller.getAllFoods);
server.get("/food/:id", Controller.getFoodById);
server.post("/payment", Controller.setPayment);
server.get("/history/:cpf", Controller.getHistoryByCpf);


server.listen(PORT, () => console.log("Server ON"));
