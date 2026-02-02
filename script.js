// Animación de entrada para elementos al hacer scroll (bidireccional)
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-visible');
            entry.target.classList.remove('animate-hidden');
        } else {
            entry.target.classList.remove('animate-visible');
            entry.target.classList.add('animate-hidden');
        }
    });
}, observerOptions);

// Observer para elementos con diferentes animaciones (bidireccional)
const scrollAnimationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const animationType = entry.target.dataset.animation || 'fade-up';
            entry.target.classList.add(animationType);
            entry.target.classList.remove('scroll-hidden');
        } else {
            const animationType = entry.target.dataset.animation || 'fade-up';
            entry.target.classList.remove(animationType);
            entry.target.classList.add('scroll-hidden');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

// Menú hamburguesa
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle menú
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });

    // Cerrar menú al hacer click en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Cerrar menú al hacer click fuera
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !menuToggle.contains(e.target) && nav.classList.contains('active')) {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Observar secciones para animaciones
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.add('scroll-animate');
        observer.observe(section);
    });
    
    // Observar elementos individuales con animaciones (excluyendo stat-card del hero)
    const animatedElements = document.querySelectorAll('.section-title, .section-text, .step, .punto-item, .fotoelectrica-img');
    animatedElements.forEach((el, index) => {
        el.classList.add('scroll-hidden');
        setTimeout(() => {
            scrollAnimationObserver.observe(el);
        }, index * 20);
    });
    
    // Stat cards sin animaciones de scroll
    const statCards = document.querySelectorAll('.hero .stat-card');
    statCards.forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    });

    // Animación inicial del hero
    const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .cta-button');
    heroElements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('fade-up');
        }, index * 200);
    });
});

// Scroll suave mejorado
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Efecto hover en las tarjetas de servicio
const servicioCards = document.querySelectorAll('.servicio-card');
servicioCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.borderColor = getComputedStyle(document.documentElement)
            .getPropertyValue('--color-primario');
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.borderColor = '#e0e0e0';
    });
});

// Actualizar el año en el footer automáticamente
const currentYear = new Date().getFullYear();
const footerCopy = document.querySelector('.footer-copy');
if (footerCopy) {
    footerCopy.textContent = footerCopy.textContent.replace('2026', currentYear);
}

// Animación de conteo para las estadísticas
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16); // 60fps
    const isPercentage = element.textContent.includes('%');
    const hasPlus = element.textContent.includes('+');
    
    // Extraer el número del texto
    const targetNumber = parseInt(target.toString().replace(/[^0-9]/g, ''));
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= targetNumber) {
            if (hasPlus && isPercentage) {
                element.textContent = `+${targetNumber}%`;
            } else if (hasPlus) {
                element.textContent = `+${targetNumber.toLocaleString('es-ES')}`;
            } else if (isPercentage) {
                element.textContent = `${targetNumber}%`;
            } else {
                element.textContent = targetNumber.toLocaleString('es-ES');
            }
            clearInterval(timer);
        } else {
            if (hasPlus && isPercentage) {
                element.textContent = `+${Math.floor(start)}%`;
            } else if (hasPlus) {
                element.textContent = `+${Math.floor(start).toLocaleString('es-ES')}`;
            } else if (isPercentage) {
                element.textContent = `${Math.floor(start)}%`;
            } else {
                element.textContent = Math.floor(start).toLocaleString('es-ES');
            }
        }
    }, 16);
}

// Observador para iniciar la animación cuando las estadísticas sean visibles
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            entry.target.classList.add('animated');
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                const number = parseInt(text.replace(/[^0-9]/g, ''));
                animateCounter(stat, number, 2000);
            });
            
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// Observar las estadísticas
const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// Modal de formulario de diagnóstico
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modalDiagnostico');
    const botonesAbrir = document.querySelectorAll('.btn-abrir-modal');
    const botonCerrar = document.querySelector('.modal-close');
    const formulario = document.getElementById('formDiagnostico');

    // Abrir modal
    botonesAbrir.forEach(boton => {
        boton.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Cerrar modal al hacer clic en el botón de cerrar
    if (botonCerrar) {
        botonCerrar.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Cerrar modal al hacer clic fuera del contenido
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Cerrar modal con la tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Manejar envío del formulario
    if (formulario) {
        formulario.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Obtener los datos del formulario
            const formData = {
                nombre: document.getElementById('nombre').value,
                telefono: document.getElementById('telefono').value,
                email: document.getElementById('email').value,
                vehiculo: document.getElementById('vehiculo').value,
                problema: document.getElementById('problema').value,
                fecha: document.getElementById('fecha').value
            };

            // Crear mensaje para WhatsApp
            const mensaje = `*Nueva solicitud de diagnóstico*%0A%0A` +
                `*Nombre:* ${formData.nombre}%0A` +
                `*Teléfono:* ${formData.telefono}%0A` +
                `*Email:* ${formData.email || 'No proporcionado'}%0A` +
                `*Vehículo:* ${formData.vehiculo}%0A` +
                `*Problema:* ${formData.problema}%0A` +
                `*Fecha preferida:* ${formData.fecha || 'No especificada'}`;

            // Número de WhatsApp (reemplaza con tu número real)
            const numeroWhatsApp = '56912345678';
            
            // Abrir WhatsApp con el mensaje
            window.open(`https://wa.me/${numeroWhatsApp}?text=${mensaje}`, '_blank');

            // Cerrar modal y resetear formulario
            modal.classList.remove('active');
            document.body.style.overflow = '';
            formulario.reset();

            // Mostrar mensaje de confirmación
            alert('¡Gracias! Tu solicitud se ha enviado correctamente. Nos contactaremos contigo pronto.');
        });
    }
});
