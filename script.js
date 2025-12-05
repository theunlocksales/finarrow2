// ============================================
// FINARROW - PROFESSIONAL WEBSITE JAVASCRIPT
// Animations, Navigation, Counters, WhatsApp, Forms
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    // ===== Mobile Navigation =====
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navbar = document.getElementById('navbar');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close menu on link click
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }

    // ===== Navbar scroll state =====
    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ===== Smooth scroll for in-page anchors =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const href = anchor.getAttribute('href');
            if (href && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (!target) return;

                const targetY = target.getBoundingClientRect().top + window.scrollY - 90;
                smoothScrollTo(targetY, 600);
            }
        });
    });

    function smoothScrollTo(targetY, duration = 600) {
        const startY = window.scrollY;
        const distance = targetY - startY;
        const startTime = performance.now();

        function scroll(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            window.scrollTo(0, startY + distance * ease);
            if (progress < 1) requestAnimationFrame(scroll);
        }

        requestAnimationFrame(scroll);
    }

    // ===== Counter Animation =====
    const counters = document.querySelectorAll('.counter');

    if (counters.length) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.getAttribute('data-target') || '0', 10);
                    animateCounter(el, target);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    }

    function animateCounter(element, target) {
        let current = 0;
        const duration = 2000;
        const startTime = performance.now();

        function update(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            current = Math.floor(target * eased);
            element.textContent = current.toLocaleString('en-IN');
            if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
    }

    // ===== AOS Init (scroll animations) =====
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 900,
            easing: 'ease-out-cubic',
            once: true,
            offset: 100
        });
    }

    // ===== Back-to-top button (optional) =====
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 600) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    backToTop.addEventListener('click', () => {
        smoothScrollTo(0, 600);
    });

    // ===== Hero video safe autoplay =====
    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo) {
        heroVideo.play().catch(() => {
            // Autoplay blocked on some mobiles – ignore silently
        });
    }

    // ===== Contact form → WhatsApp redirect (if form exists) =====
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', e => {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            if (!data.name || !data.phone) {
                showToast('Please fill all required fields.', 'error');
                return;
            }

            const phoneClean = (data.phone || '').replace(/[^0-9]/g, '');
            if (phoneClean.length < 10) {
                showToast('Enter a valid phone number.', 'error');
                return;
            }

            if (data.email && !validateEmail(data.email)) {
                showToast('Enter a valid email address.', 'error');
                return;
            }

            const msg =
                `Hi Finarrow,%0A%0A` +
                `Name: ${data.name || ''}%0A` +
                `Phone: ${data.phone || ''}%0A` +
                `Email: ${data.email || ''}%0A` +
                `Loan Type: ${data.loanType || ''}%0A` +
                `Amount: ${data.amount || ''}%0A` +
                `Message: ${data.message || ''}`;

            const waUrl = `https://wa.me/917838393421?text=${msg}`;
            showToast('Redirecting to WhatsApp...', 'success');
            setTimeout(() => {
                window.open(waUrl, '_blank');
                contactForm.reset();
            }, 800);
        });
    }

    function validateEmail(email) {
        const re = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
        return re.test(email);
    }

    // ===== Toast Notifications =====
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `finarrow-toast finarrow-toast-${type}`;
        toast.innerHTML = `
            <span class="toast-icon">
                ${type === 'success'
                    ? '<i class="fas fa-check-circle"></i>'
                    : type === 'error'
                    ? '<i class="fas fa-exclamation-circle"></i>'
                    : '<i class="fas fa-info-circle"></i>'}
            </span>
            <span class="toast-message">${message}</span>
        `;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 50);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // ===== Optional: Custom cursor only on desktop =====
    if (window.innerWidth > 1024) {
        const cursor = document.createElement('div');
        const follower = document.createElement('div');
        cursor.className = 'finarrow-cursor';
        follower.className = 'finarrow-cursor-follower';
        document.body.appendChild(cursor);
        document.body.appendChild(follower);

        let mouseX = 0;
        let mouseY = 0;
        let fx = 0;
        let fy = 0;

        document.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        });

        function animateFollower() {
            fx += (mouseX - fx) * 0.12;
            fy += (mouseY - fy) * 0.12;
            follower.style.transform = `translate3d(${fx}px, ${fy}px, 0)`;
            requestAnimationFrame(animateFollower);
        }
        animateFollower();

        const hoverTargets = document.querySelectorAll('a, button, .btn-primary, .btn-outline, .service-card');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('active');
                follower.classList.add('active');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('active');
                follower.classList.remove('active');
            });
        });
    }

    console.log('%cFinarrow Professional Theme Loaded', 'color:#F5A623;font-weight:700;font-size:14px;');
});

// ===== Extra styles for cursor & toast (injected) =====
const extraStyle = document.createElement('style');
extraStyle.textContent = `
.finarrow-toast {
    position: fixed;
    top: 96px;
    right: 24px;
    background: #ffffff;
    border-radius: 12px;
    padding: 12px 18px;
    box-shadow: 0 12px 32px rgba(0,0,0,0.12);
    display: flex;
    align-items: center;
    gap: 10px;
    z-index: 1100;
    opacity: 0;
    transform: translateY(-10px);
    transition: all 0.25s ease;
    font-size: 14px;
}
.finarrow-toast.show {
    opacity: 1;
    transform: translateY(0);
}
.finarrow-toast-success .toast-icon { color: #16A34A; }
.finarrow-toast-error .toast-icon { color: #DC2626; }
.finarrow-toast-info .toast-icon { color: #2563EB; }
.toast-icon i { font-size: 18px; }
.finarrow-cursor,
.finarrow-cursor-follower {
    position: fixed;
    top: 0;
    left: 0;
    pointer-events: none;
    z-index: 1200;
    transform: translate3d(-100px,-100px,0);
    transition: transform 0.15s ease-out;
}
.finarrow-cursor {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #F5A623;
}
.finarrow-cursor-follower {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid rgba(245,166,35,0.6);
}
.finarrow-cursor.active {
    transform: scale(1.8);
}
.finarrow-cursor-follower.active {
    transform: scale(1.3);
}
.back-to-top {
    position: fixed;
    bottom: 32px;
    left: 24px;
    width: 46px;
    height: 46px;
    border-radius: 50%;
    border: none;
    background: linear-gradient(135deg,#F5A623,#FF8C42);
    color: #fff;
    display: flex;
    align-items:center;
    justify-content:center;
    font-size:18px;
    cursor:pointer;
    box-shadow: 0 10px 30px rgba(0,0,0,0.25);
    opacity: 0;
    visibility: hidden;
    transform: translateY(10px);
    transition: all 0.25s ease;
    z-index: 1050;
}
.back-to-top.show {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}
@media (max-width: 1024px) {
    .finarrow-cursor,
    .finarrow-cursor-follower {
        display:none;
    }
}
`;
document.head.appendChild(extraStyle);
