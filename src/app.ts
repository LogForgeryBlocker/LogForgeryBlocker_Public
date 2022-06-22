import 'dotenv/config'

import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import { invalidRouteHandler } from '@helpers/invalidRouteHandler'
import { router } from './routes'

const app = express()
const port = 3000

app.use(cors())

app.use(bodyParser.json())

app.use('/v0', router)
app.use('*', invalidRouteHandler)

app.listen(port, async () => {
  console.log(`server is listening on ${port}`)
})
