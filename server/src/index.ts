import * as express from 'express'
import * as cors from 'cors'
import * as bodyParser from 'body-parser'
require('dotenv').config()

import { paramsRouter } from "./routing"
import { sequelize } from "./sequalize"
import { udp } from "./udp"
import { tcp } from "./tcp"

const app = express()
app.use(bodyParser())
udp
tcp

app.use(cors())
app.use('/params', paramsRouter)
app.listen(8080, () => console.log('>>> server listening localhost:8080'))
sequelize.sync()
    .then(() => console.log('>>> db connected'))