import 'dotenv/config'
import express from 'express'
import pageRoutes from './routes/page.routes.js'
import { securityHeaders } from './middlewares/security.js'

const app = express()

app.disable('x-powered-by')   // no anunciar que el servidor es Express
app.set('trust proxy', 1)     // el hosting pone un proxy adelante: así req.ip y req.secure son los reales

app.use(securityHeaders)
app.use(express.urlencoded({ extended: false, limit: '10kb' }))
app.use(express.static('public', { redirect: false }))

app.use('/', pageRoutes)

// Errores no manejados: se loguean en el servidor, pero al visitante no le mostramos detalles
app.use((err, req, res, next) => {
    console.error(err)
    res.status(err.status || 500).send('Ocurrió un error. Volvé a intentarlo más tarde.')
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`))