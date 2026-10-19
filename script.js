/* =========================================================================
   RaikoStudios — JavaScript principal
   Sin dependencias propias. EmailJS se carga de forma diferida solo para
   el formulario de contacto.
   ========================================================================= */

/* =========================================================================
   1) CONFIGURACIÓN DEL FORMULARIO DE CONTACTO (EmailJS)
   Mecanismo real ya existente en el sitio. Conservado sin cambios.
   ========================================================================= */
const MY_SERVICE_ID = "service_raikostudios";
const MY_TEMPLATE_ID = "template_z0woy1c";
const MY_PUBLIC_KEY = "7bivaHgN1RRfsotWS";
const MY_EMAIL = "nicosantana199@gmail.com";

/* =========================================================================
   2) CONFIGURACIÓN DE DESCARGAS — RaikoLauncher 0.3.1 Void
   Los instaladores están en la MISMA carpeta que raikolauncher.html.

   - Con RAIKOLAUNCHER_DOWNLOAD_BASE vacío (""), cada botón descarga el
     archivo de esta misma carpeta (ruta relativa).
   - Si en algún momento subís los archivos a un GitHub Release u otro
     servidor, pegá la URL base (terminada en "/") y los botones usarán
     esa dirección automáticamente. Ejemplo:
       "https://github.com/raikkito/raikostudios/releases/download/v0.3.1/"
   ========================================================================= */
const RAIKOLAUNCHER_DOWNLOAD_BASE = "";

/* Nombre exacto de cada archivo (en la misma carpeta o en el Release). */
const RAIKOLAUNCHER_FILES = {
    windows_setup:     "RaikoLauncher-0.3.1-Setup.exe",     // Windows (instalador)
    windows_portable:  "RaikoLauncher-0.3.1-Portable.exe",  // Windows (portable)
    linux_deb:         "RaikoLauncher-0.3.1.deb",           // Linux .deb
    linux_rpm:         "RaikoLauncher-0.3.1.rpm",           // Linux .rpm
    linux_appimage:    "RaikoLauncher-0.3.1.AppImage",      // Linux .AppImage
    linux_pkg_tar_zst: "RaikoLauncher-0.3.1.tar.zst"        // Linux .pkg.tar.zst
};

/* Devuelve la URL final de descarga o "" si todavía no está disponible. */
function getDownloadUrl(key) {
    const file = (RAIKOLAUNCHER_FILES[key] || "").trim();
    if (!file) return "";
    const base = (RAIKOLAUNCHER_DOWNLOAD_BASE || "").trim();
    if (!base) return file; // misma carpeta que raikolauncher.html
    return base.replace(/\/?$/, "/") + file;
}

let currentLang = 'es';

/* =========================================================================
   3) INICIALIZACIÓN
   ========================================================================= */
document.addEventListener('DOMContentLoaded', () => {
    setCurrentYear();
    setupLanguageToggle();
    setupMobileNav();
    setupSmoothScroll();
    setupRevealAnimations();
    setupDownloadButtons();

    // EmailJS solo se carga si existe el formulario de contacto en la página
    if (document.getElementById('contactForm')) {
        loadEmailJSScript(() => {
            if (window.emailjs) {
                emailjs.init(MY_PUBLIC_KEY);
            }
            setupContactForm();
        });
    }
});

/* =========================================================================
   4) PIE DE PÁGINA — AÑO AUTOMÁTICO
   ========================================================================= */
function setCurrentYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}

/* =========================================================================
   5) NAVEGACIÓN MÓVIL
   ========================================================================= */
function setupMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const nav = document.getElementById('primaryNav');

    if (!navToggle || !nav) return;

    const closeNav = () => {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', currentLang === 'es' ? 'Abrir menú' : 'Open menu');
    };

    navToggle.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('is-open');
        navToggle.setAttribute('aria-expanded', String(isOpen));
        navToggle.setAttribute('aria-label', isOpen
            ? (currentLang === 'es' ? 'Cerrar menú' : 'Close menu')
            : (currentLang === 'es' ? 'Abrir menú' : 'Open menu'));
    });

    // Cerrar el menú al navegar o al tocar fuera
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeNav));

    document.addEventListener('click', (e) => {
        if (!nav.classList.contains('is-open')) return;
        if (!nav.contains(e.target) && !navToggle.contains(e.target)) {
            closeNav();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeNav();
    });
}

/* =========================================================================
   6) DESPLAZAMIENTO SUAVE PARA ENLACES INTERNOS
   ========================================================================= */
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Solo interceptar anclas internas reales (no URLs ni "#")
            if (!href || !href.startsWith('#') || href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

/* =========================================================================
   7) ANIMACIONES DISCRETAS AL DESPLAZAR
   ========================================================================= */
function setupRevealAnimations() {
    if (!('IntersectionObserver' in window)) return;

    const elements = document.querySelectorAll('.section, .card');
    if (!elements.length) return;

    elements.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    elements.forEach(el => observer.observe(el));
}

/* =========================================================================
   8) IDIOMA (ES / EN)
   ========================================================================= */
function setupLanguageToggle() {
    const langToggle = document.getElementById('langToggle');
    if (!langToggle) return;

    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang === 'es' || savedLang === 'en') {
        currentLang = savedLang;
    }
    updateLanguage();

    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'es' ? 'en' : 'es';
        localStorage.setItem('preferredLanguage', currentLang);
        updateLanguage();
    });
}

function updateLanguage() {
    const langText = document.getElementById('langText');
    if (langText) {
        langText.textContent = currentLang === 'es' ? 'English' : 'Español';
    }

    document.querySelectorAll('[data-es][data-en]').forEach(element => {
        const text = currentLang === 'es'
            ? element.getAttribute('data-es')
            : element.getAttribute('data-en');
        if (text !== null) element.textContent = text;
    });

    const navToggle = document.getElementById('navToggle');
    if (navToggle) {
        const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-label', isOpen
            ? (currentLang === 'es' ? 'Cerrar menú' : 'Close menu')
            : (currentLang === 'es' ? 'Abrir menú' : 'Open menu'));
    }
}

/* =========================================================================
   9) BOTONES DE DESCARGA (raikolauncher.html)
   ========================================================================= */
function setupDownloadButtons() {
    const buttons = document.querySelectorAll('.download-btn[data-download]');
    if (!buttons.length) return;

    buttons.forEach(btn => {
        const key = btn.getAttribute('data-download');
        const url = getDownloadUrl(key);
        const note = document.querySelector(`.download-note[data-download-note="${key}"]`);

        if (url && typeof url === 'string' && url.trim() !== '') {
            // Descarga configurada: el botón apunta al archivo real
            btn.setAttribute('href', url.trim());
            btn.setAttribute('target', '_blank');
            btn.setAttribute('rel', 'noopener noreferrer');
            btn.classList.remove('is-disabled');
            btn.removeAttribute('aria-disabled');

            if (note) {
                note.setAttribute('data-es', 'Descarga directa del archivo.');
                note.setAttribute('data-en', 'Direct file download.');
                note.textContent = currentLang === 'es'
                    ? 'Descarga directa del archivo.'
                    : 'Direct file download.';
                note.classList.remove('is-warning');
            }
        } else {
            // Sin descarga configurada: se avisa claramente y el botón no navega
            btn.classList.add('is-disabled');
            btn.removeAttribute('href');
            btn.setAttribute('aria-disabled', 'true');

            if (note) {
                note.setAttribute('data-es', 'El archivo todavía no está disponible.');
                note.setAttribute('data-en', 'The file is not available yet.');
                note.textContent = currentLang === 'es'
                    ? 'El archivo todavía no está disponible.'
                    : 'The file is not available yet.';
                note.classList.add('is-warning');
            }
        }
    });
}

/* =========================================================================
   10) CARGA DIFERIDA DE EMAILJS + FORMULARIO DE CONTACTO
   ========================================================================= */
function loadEmailJSScript(callback) {
    const urls = [
        'https://cdn.jsdelivr.net/npm/@emailjs/browser@3.12.1/dist/email.min.js',
        'https://cdn.emailjs.com/dist/email.min.js'
    ];
    let index = 0;

    function tryLoad() {
        const script = document.createElement('script');
        script.src = urls[index];
        script.onload = () => {
            if (window.emailjs) {
                callback();
            } else {
                fallback();
            }
        };
        script.onerror = fallback;
        document.head.appendChild(script);
    }

    function fallback() {
        if (index < urls.length - 1) {
            index += 1;
            tryLoad();
        } else {
            const formMessage = document.getElementById('formMessage');
            if (formMessage) {
                formMessage.textContent = currentLang === 'es'
                    ? '❌ No se pudo cargar el servicio de contacto. Verificá tu conexión o usá el correo directo.'
                    : '❌ Could not load the contact service. Check your connection or use the direct email.';
                formMessage.className = 'form-message error';
                formMessage.style.display = 'block';
            }
        }
    }

    tryLoad();
}

function validateEmailJSConfig(formMessage) {
    const errors = [];
    if (!MY_SERVICE_ID || !MY_SERVICE_ID.startsWith('service_')) errors.push('Service ID');
    if (!MY_TEMPLATE_ID || !MY_TEMPLATE_ID.startsWith('template_')) errors.push('Template ID');
    if (!MY_PUBLIC_KEY || MY_PUBLIC_KEY === 'YOUR_PUBLIC_KEY_HERE') errors.push('Public Key');

    if (errors.length) {
        const msg = currentLang === 'es'
            ? `❌ Configuración de contacto inválida: ${errors.join(', ')}.`
            : `❌ Invalid contact configuration: ${errors.join(', ')}.`;
        if (formMessage) {
            formMessage.textContent = msg;
            formMessage.className = 'form-message error';
            formMessage.style.display = 'block';
        }
        console.error(msg);
        return false;
    }
    return true;
}

function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (!contactForm) return;
    if (!validateEmailJSConfig(formMessage)) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        formMessage.textContent = currentLang === 'es' ? 'Enviando…' : 'Sending…';
        formMessage.className = 'form-message';
        formMessage.style.display = 'block';

        try {
            await emailjs.send(MY_SERVICE_ID, MY_TEMPLATE_ID, {
                user_name: name,
                user_email: email,
                from_name: name,
                from_email: email,
                reply_to: email,
                to_email: MY_EMAIL,
                subject: subject,
                message: message
            });

            formMessage.textContent = currentLang === 'es'
                ? '✅ ¡Mensaje enviado! Te contactaremos pronto.'
                : '✅ Message sent! We will get back to you soon.';
            formMessage.className = 'form-message success';

            contactForm.reset();

            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 6000);
        } catch (error) {
            console.error('Error al enviar el formulario:', error);

            let errorMsg = currentLang === 'es' ? '❌ Error al enviar. ' : '❌ Error sending. ';
            if (error && error.text === 'Unauthorized') {
                errorMsg += currentLang === 'es'
                    ? 'La clave pública no es válida o no está autorizada.'
                    : 'The public key is invalid or unauthorized.';
            } else if (error && error.text === 'Bad Request') {
                errorMsg += currentLang === 'es'
                    ? 'Verificá el Service ID, el Template ID y las variables de la plantilla.'
                    : 'Check the Service ID, Template ID and template variables.';
            } else {
                errorMsg += (error && error.text) || (currentLang === 'es' ? 'Error desconocido.' : 'Unknown error.');
            }

            formMessage.textContent = errorMsg;
            formMessage.className = 'form-message error';
        }
    });
}
