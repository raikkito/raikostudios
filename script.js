const MY_SERVICE_ID = "service_raikostudios";
const MY_TEMPLATE_ID = "template_z0woy1c";
const MY_PUBLIC_KEY = "7bivaHgN1RRfsotWS";
const MY_EMAIL = "nicosantana199@gmail.com";

function loadEmailJSScript(callback) {
    const urls = [
        'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js',
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
                    ? '❌ No se pudo cargar EmailJS. Verifica tu conexión o el CDN.'
                    : '❌ Could not load EmailJS. Check your connection or CDN.';
                formMessage.className = 'form-message error';
                formMessage.style.display = 'block';
            }
        }
    }

    tryLoad();
}

document.addEventListener('DOMContentLoaded', () => {
    loadEmailJSScript(() => {
        emailjs.init(MY_PUBLIC_KEY);
        setupContactForm();
    });

    setupLanguageToggle();
});

let currentLang = 'es';

function setupLanguageToggle() {
    const langToggle = document.getElementById('langToggle');

    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang) {
        currentLang = savedLang;
        updateLanguage();
    }

    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'es' ? 'en' : 'es';
        localStorage.setItem('preferredLanguage', currentLang);
        updateLanguage();
    });
}

function updateLanguage() {
    const langText = document.getElementById('langText');
    langText.textContent = currentLang === 'es' ? 'English' : 'Español';

    document.querySelectorAll('[data-es][data-en]').forEach(element => {
        const text = currentLang === 'es' ? element.getAttribute('data-es') : element.getAttribute('data-en');
        element.textContent = text;
    });

    document.body.style.opacity = '0.95';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
}

document.body.style.transition = 'opacity 0.3s ease';

function validateEmailJSConfig(formMessage) {
    if (!MY_SERVICE_ID || !MY_SERVICE_ID.startsWith('service_')) {
        const msg = currentLang === 'es'
            ? '❌ Service ID inválido. Copia el Service ID exacto desde EmailJS.'
            : '❌ Invalid Service ID. Copy the exact Service ID from EmailJS.';
        if (formMessage) {
            formMessage.textContent = msg;
            formMessage.className = 'form-message error';
            formMessage.style.display = 'block';
        }
        console.error(msg, 'MY_SERVICE_ID=', MY_SERVICE_ID);
        return false;
    }
    if (!MY_TEMPLATE_ID || !MY_TEMPLATE_ID.startsWith('template_')) {
        const msg = currentLang === 'es'
            ? '❌ Template ID inválido. Copia el Template ID exacto desde EmailJS.'
            : '❌ Invalid Template ID. Copy the exact Template ID from EmailJS.';
        if (formMessage) {
            formMessage.textContent = msg;
            formMessage.className = 'form-message error';
            formMessage.style.display = 'block';
        }
        console.error(msg, 'MY_TEMPLATE_ID=', MY_TEMPLATE_ID);
        return false;
    }
    if (!MY_PUBLIC_KEY || MY_PUBLIC_KEY === 'YOUR_PUBLIC_KEY_HERE') {
        const msg = currentLang === 'es'
            ? '❌ Public Key inválida. Revisa tu Public Key en EmailJS.'
            : '❌ Invalid Public Key. Check your Public Key in EmailJS.';
        if (formMessage) {
            formMessage.textContent = msg;
            formMessage.className = 'form-message error';
            formMessage.style.display = 'block';
        }
        console.error(msg, 'MY_PUBLIC_KEY=', MY_PUBLIC_KEY);
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

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;

        formMessage.textContent = currentLang === 'es' ? 'Enviando...' : 'Sending...';
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
                ? '✅ ¡Mensaje enviado exitosamente! Te contactaremos pronto.' 
                : '✅ Message sent successfully! We will contact you soon.';
            formMessage.className = 'form-message success';

            contactForm.reset();

            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);

        } catch (error) {
            console.error('❌ Error detallado:', error);
            console.error('Mensaje de error:', error.message);
            console.error('Código de error:', error.text);
            
            let errorMsg = currentLang === 'es'
                ? '❌ Error al enviar. '
                : '❌ Error sending. ';
            
            if (error.text === 'Unauthorized') {
                errorMsg += currentLang === 'es' 
                    ? 'Public Key inválida o no autorizada.'
                    : 'Invalid or unauthorized Public Key.';
            } else if (error.text === 'Bad Request') {
                errorMsg += currentLang === 'es'
                    ? 'Verifica que Service ID, Template ID y variables de plantilla sean correctos.'
                    : 'Check Service ID, Template ID, and template variables.';
            } else if (error.text && error.text.toLowerCase().includes('service id not found')) {
                errorMsg += currentLang === 'es'
                    ? 'Service ID no encontrado. Verifica el Service ID en EmailJS.'
                    : 'Service ID not found. Verify the Service ID in EmailJS.';
            } else {
                errorMsg += error.text || (currentLang === 'es' ? 'Error desconocido.' : 'Unknown error.');
            }
            
            formMessage.textContent = errorMsg;
            formMessage.className = 'form-message error';
        }
    });
}

const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.project-card, .form-group').forEach(el => {
    observer.observe(el);
});
