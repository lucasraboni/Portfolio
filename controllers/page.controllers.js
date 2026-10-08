import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import nodemailer from 'nodemailer'

const __dirname = dirname(fileURLToPath(import.meta.url))

function servirHTML(nombre) {
    return (req, res) => res.sendFile(join(__dirname, '../public', nombre))
}

export const home        = servirHTML('index.html')
export const sobreMi     = servirHTML('sobre-mi.html')
export const formacion   = servirHTML('formacion.html')
export const habilidades = servirHTML('habilidades.html')
export const portfolio   = servirHTML('portfolio.html')
export const contacto    = servirHTML('contacto.html')
export const gracias     = servirHTML('gracias.html')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

// Pasa a texto, saca espacios de los bordes y corta en el largo máximo
function limpiar(valor, max) {
    return String(valor ?? '').trim().slice(0, max)
}

export async function contactoEnviar(req, res) {
    // Honeypot: campo oculto que una persona nunca completa. Si viene lleno es un bot,
    // así que le respondemos como si todo hubiera salido bien pero no mandamos nada.
    if (req.body.website) return res.redirect('/gracias')

    const nombre  = limpiar(req.body.nombre, 100).replace(/[\r\n]+/g, ' ')
    const email   = limpiar(req.body.email, 150)
    const mensaje = limpiar(req.body.mensaje, 3000)

    if (!nombre || !mensaje || !EMAIL_VALIDO.test(email)) {
        return res.redirect('/contacto?error=datos')
    }

    try {
        await transporter.sendMail({
            from: `"Portfolio" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            replyTo: email,
            subject: `Nuevo mensaje de ${nombre} — Portfolio`,
            text: `Nombre: ${nombre}\nEmail: ${email}\n\nMensaje:\n${mensaje}`
        })
        res.redirect('/gracias')
    } catch (err) {
        console.error('Error enviando email:', err)
        res.redirect('/contacto?error=envio')
    }
} 