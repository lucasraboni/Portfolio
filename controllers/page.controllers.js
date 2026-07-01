import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import nodemailer from 'nodemailer'

const __dirname = dirname(fileURLToPath(import.meta.url))

function servirHTML(nombre) {
    return (req, res) => {
        const ruta = join(__dirname, '../public', nombre)
        res.send(readFileSync(ruta, 'utf-8'))
    }
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

export async function contactoEnviar(req, res) {
    const { nombre, email, mensaje } = req.body

    try {
        await transporter.sendMail({
            from: `"Portfolio" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            replyTo: email,
            subject: `Nuevo mensaje de ${nombre} — Portfolio`,
            text: `Nombre: ${nombre}\nEmail: ${email}\n\nMensaje:\n${mensaje}`
        })
    } catch (err) {
        console.error('Error enviando email:', err)
    }

    res.redirect('/gracias')
}