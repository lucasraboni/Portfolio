import express from 'express'
import * as controllers from '../controllers/page.controllers.js'

const router = express.Router()

router.get('/', controllers.home)
router.get('/sobre-mi', controllers.sobreMi)
router.get('/formacion', controllers.formacion)
router.get('/habilidades', controllers.habilidades)
router.get('/portfolio', controllers.portfolio)
router.get('/contacto', controllers.contacto)
router.post('/contacto', controllers.contactoEnviar)
router.get('/gracias', controllers.gracias)

export default router