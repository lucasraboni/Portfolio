// Fade in al cargar la página
document.body.style.opacity = '0'

document.addEventListener('DOMContentLoaded', () => {

    // === FADE IN ===
    requestAnimationFrame(() => requestAnimationFrame(() => {
        document.body.style.opacity = '1'
    }))

    // === FADE OUT al navegar ===
    document.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href')
        if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || link.target === '_blank') return
        link.addEventListener('click', e => {
            e.preventDefault()
            document.body.style.opacity = '0'
            setTimeout(() => { window.location.href = href }, 330)
        })
    })

    // === TEMA CLARO/OSCURO ===
    const navIcons = document.querySelector('.nav-icons')
    const btn = document.createElement('button')
    btn.id = 'theme-toggle'
    btn.setAttribute('aria-label', 'Cambiar tema')
    btn.innerHTML = '<i class="fas fa-circle-half-stroke"></i>'
    navIcons.appendChild(btn)

    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-mode')
    }

    btn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode')
        localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark')
    })

    // === MENÚ HAMBURGUESA ===
    const nav = document.querySelector('nav')
    const navLinks = document.querySelector('.nav-links')

    const hamburger = document.createElement('button')
    hamburger.id = 'hamburger'
    hamburger.setAttribute('aria-label', 'Menú')
    hamburger.setAttribute('aria-expanded', 'false')
    hamburger.innerHTML = '<i class="fas fa-bars"></i>'
    nav.insertBefore(hamburger, nav.firstChild)

    function toggleMenu(abrir) {
        navLinks.classList.toggle('nav-open', abrir)
        document.body.classList.toggle('menu-open', abrir)
        hamburger.setAttribute('aria-expanded', abrir)
        hamburger.innerHTML = abrir ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>'
    }

    hamburger.addEventListener('click', () => {
        toggleMenu(!navLinks.classList.contains('nav-open'))
    })

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => toggleMenu(false))
    })

    // === FONDO DEL NAV AL SCROLLEAR ===
    const marcarScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20)
    marcarScroll()
    window.addEventListener('scroll', marcarScroll, { passive: true })

    // === BOTÓN VOLVER ARRIBA ===
    const paginasConScroll = ['/sobre-mi', '/formacion', '/habilidades', '/portfolio', '/contacto']
    const enPortfolioDetalle = window.location.pathname.startsWith('/portfolio/')
    if (paginasConScroll.includes(window.location.pathname) || enPortfolioDetalle) {
        const scrollBtn = document.createElement('button')
        scrollBtn.id = 'scroll-top'
        scrollBtn.setAttribute('aria-label', 'Volver arriba')
        scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>'
        document.body.appendChild(scrollBtn)

        window.addEventListener('scroll', () => {
            scrollBtn.classList.toggle('visible', window.scrollY > 300)
        })

        scrollBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' })
        })
    }

})
