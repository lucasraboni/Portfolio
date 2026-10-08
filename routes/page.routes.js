import express from 'express'
import rateLimit from 'express-rate-limit'
import * as controllers from '../controllers/page.controllers.js'

const router = express.Router()

// Máximo 5 envíos del formulario cada 15 minutos por IP
const limiteContacto = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    handler: (req, res) => res.redirect('/contacto?error=limite')
})

router.get('/', controllers.home)
router.get('/sobre-mi', controllers.sobreMi)
router.get('/formacion', controllers.formacion)
router.get('/habilidades', controllers.habilidades)
router.get('/portfolio', controllers.portfolio)
router.get('/contacto', controllers.contacto)
router.post('/contacto', limiteContacto, controllers.contactoEnviar)
router.get('/gracias', controllers.gracias)

export default router