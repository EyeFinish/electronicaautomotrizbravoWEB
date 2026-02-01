// Animación de entrada para elementos al hacer scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observar secciones para animaciones
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        observer.observe(section);
    });

    // Animación inicial del hero
    const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .cta-button');
    heroElements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('fade-in');
        }, index * 150);
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
