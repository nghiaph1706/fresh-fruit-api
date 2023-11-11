import express, { json, urlencoded } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import './app/config/db.connection.js'

dotenv.config()

const app = express()

const corsOptions = {
  origin: '*'
}

app.use(cors(corsOptions))

app.use(json())

app.use(
  urlencoded({ extended: true })
)

// require("./app/routes/tutorial.routes.js")(app);

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})
