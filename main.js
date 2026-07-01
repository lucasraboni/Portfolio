import 'dotenv/config'
import express from 'express'
import pageRoutes from './routes/page.routes.js'

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('public'))

app.use('/', pageRoutes)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`))