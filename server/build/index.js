"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require('dotenv').config();
const routing_1 = require("./routing");
const sequalize_1 = require("./sequalize");
const udp_1 = require("./udp");
const tcp_1 = require("./tcp");
const app = express();
app.use(bodyParser());
udp_1.udp;
tcp_1.tcp;
app.use(cors());
app.use('/params', routing_1.paramsRouter);
app.listen(8080, () => console.log('>>> server listening localhost:8080'));
sequalize_1.sequelize.sync()
    .then(() => console.log('>>> db connected'));
