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

export function noEncontrado(req, res) {
    res.status(404).sendFile(join(__dirname, '../public', '404.html'))
}

// === SEO ===
// Si SITE_URL no está en el .env, se usa el dominio con el que entró la visita
function urlBase(req) {
    return (process.env.SITE_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '')
}

const PAGINAS_SITEMAP = [
    '/', '/sobre-mi', '/formacion', '/habilidades', '/portfolio', '/contacto', '/cv.html',
    '/portfolio/cetasa.html', '/portfolio/vinyl-maquetado.html', '/portfolio/redondos.html'
]

export function robots(req, res) {
    res.type('text/plain').send(
        `User-agent: *\nAllow: /\nDisallow: /gracias\n\nSitemap: ${urlBase(req)}/sitemap.xml\n`
    )
}

export function sitemap(req, res) {
    const base = urlBase(req)
    const urls = PAGINAS_SITEMAP.map(p => `  <url><loc>${base}${p}</loc></url>`).join('\n')
    res.type('application/xml').send(
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
    )
}

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