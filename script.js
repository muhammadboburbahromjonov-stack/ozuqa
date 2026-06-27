// ============ HEADER SCROLL ============
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ============ MOBILE NAV ============
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

burger.addEventListener('click', () => {
    nav.classList.toggle('active');
});

document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
    });
});


// ============ FORM HANDLING ============
// ⚠️ DIQQAT: Hozir bu forma ma'lumotni HECH QAYERGA yubormaydi!
// Real ishlatish uchun quyidagilardan birini sozlang:
//
//  1) Telegram bot (eng tezi):
//     • @BotFather'dan bot oching, TOKEN va CHAT_ID oling
//     • TELEGRAM_BOT_TOKEN va TELEGRAM_CHAT_ID konstantalarni to'ldiring
//
//  2) Formspree (kod yozmaslik):
//     • formspree.io'da bepul akkaunt
//     • Form'ning action="https://formspree.io/f/XXXX" qilib qo'ying
//
//  3) Vercel Serverless Function (api/contact.js)
//     • Kerak bo'lsa men yozib beraman

const TELEGRAM_BOT_TOKEN = ''; // ← bu yerga bot token'ni yozing
const TELEGRAM_CHAT_ID   = ''; // ← bu yerga chat ID'ni yozing

const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;

    btn.textContent = 'Yuborilmoqda...';
    btn.disabled = true;

    // Telegram bot integratsiyasi (token va chat_id to'ldirilgan bo'lsa)
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
        try {
            const message =
                `🆕 Yangi so'rov — Ozuqa.org.uz\n\n` +
                `👤 Ism: ${data.name}\n` +
                `📞 Telefon: ${data.phone}\n` +
                `📦 Mahsulot: ${data.product || '—'}\n` +
                `💬 Xabar: ${data.message || '—'}`;

            const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message }),
            });

            if (!res.ok) throw new Error('Telegram API error');

            btn.textContent = "✓ So'rovingiz qabul qilindi!";
            btn.style.background = 'linear-gradient(135deg, #16a34a, #84cc16)';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
                btn.style.background = '';
                contactForm.reset();
            }, 3000);
        } catch (err) {
            btn.textContent = '✗ Xatolik — qayta urinib ko\'ring';
            btn.disabled = false;
            console.error('Form submit error:', err);
        }
    } else {
        // Sozlanmagan — foydalanuvchini aldamaymiz
        btn.textContent = "⚠️ Forma hali sozlanmagan";
        btn.style.background = '#f59e0b';
        console.warn(
            'Aloqa formasi konfiguratsiya qilinmagan. ' +
            'script.js da TELEGRAM_BOT_TOKEN va TELEGRAM_CHAT_ID ni to\'ldiring.\n',
            'Form data:', data
        );
        setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
            btn.style.background = '';
        }, 3000);
    }
});

// ============ IMMERSIVE HERO ANIMATION ============
// Uses GSAP + ScrollTrigger loaded from CDN in index.html.
// Each product image has data-depth (parallax weight) and data-rotate (base tilt).
//
// Initialization is deferred until window.load so all hero images have their
// real dimensions before computeFromCenter() measures offsets. Otherwise the
// burst animates from incorrect coordinates.
function initHeroAnimation() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    const products = gsap.utils.toArray('.hero__product');
    if (!products.length) return;

    // 1) ENTRANCE — products burst out from the center:
    //    All products start stacked at the CENTER (large + no rotation),
    //    then on a tiny delay they BURST outward to their scattered positions
    //    while rotating to their final tilt. Real-time math: for each product
    //    we measure the offset between its CSS position and the hero center,
    //    then animate FROM that offset to zero (i.e. into its CSS position).
    const heroEl = document.querySelector('.hero');

    function computeFromCenter() {
        const heroRect = heroEl.getBoundingClientRect();
        const centerX = heroRect.left + heroRect.width / 2;
        const centerY = heroRect.top + heroRect.height / 2;

        return products.map((el) => {
            const r = el.getBoundingClientRect();
            const elCx = r.left + r.width / 2;
            const elCy = r.top + r.height / 2;
            return { dx: centerX - elCx, dy: centerY - elCy };
        });
    }

    const offsets = computeFromCenter();

    // Stage A — instantly snap products to the center, no rotation, scaled up
    products.forEach((el, i) => {
        gsap.set(el, {
            x: offsets[i].dx,
            y: offsets[i].dy,
            scale: 1.4,
            rotation: 0,
            opacity: 0.95,
        });
    });

    // Stage B — after a short beat, BURST outward to scattered positions
    gsap.to(products, {
        x: 0,
        y: 0,
        scale: 1,
        rotation: (i, el) => parseFloat(el.dataset.rotate),
        opacity: 1,
        duration: 1.6,
        ease: 'expo.out',         // dramatic deceleration — feels physical
        stagger: { each: 0.06, from: 'center' },
        delay: 0.6,
        onComplete: () => {
            // Hand control to idle/scroll layers — both start AFTER the burst
            startIdleAnimations();
            startScrollParallax();
        },
    });

    // Text reveals — wait until the burst is mostly done so it doesn't compete
    gsap.from('.hero__title-line, .hero__title-badge', {
        opacity: 0,
        y: 60,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.15,
        delay: 1.4,
    });

    gsap.from('.hero__subtitle, .hero__actions, .hero__stats', {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.1,
        delay: 2,
    });

    // 2) IDLE animations — defined as a function, called AFTER the burst
    //    completes so they don't fight with the explosion tween.
    function startIdleAnimations() {
        products.forEach((el, i) => {
            const baseRot = parseFloat(el.dataset.rotate);

            // Y bob — vertical breathing
            gsap.to(el, {
                y: `+=${30 + Math.random() * 25}`,
                duration: 3 + Math.random() * 2,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: i * 0.15,
            });

            // X sway — sideways drift
            gsap.to(el, {
                x: `+=${20 + Math.random() * 20}`,
                duration: 4 + Math.random() * 3,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: Math.random() * 1.5,
            });

            // Rotation oscillation — gentle wobble around the base tilt
            gsap.to(el, {
                rotation: baseRot + (Math.random() > 0.5 ? 1 : -1) * (8 + Math.random() * 6),
                duration: 5 + Math.random() * 3,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: Math.random() * 2,
            });
        });
    }

    // Badge breathing + bg glow can start immediately (they don't touch products)
    gsap.to('.hero__title-badge', {
        scale: 1.04,
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1.4,
    });

    gsap.to('.hero__bg', {
        scale: 1.15,
        opacity: 0.7,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
    });

    // 4) SCROLL PARALLAX — wrapped in a function so it only initializes
    //    AFTER the burst finishes (avoids conflict with explosion tween).
    function startScrollParallax() {
        const viewportCenter = window.innerWidth / 2;
        products.forEach((el) => {
            const depth = parseFloat(el.dataset.depth);
            const baseRotate = parseFloat(el.dataset.rotate);

            // Determine which side of the viewport this product sits on,
            // so it flies AWAY from the centre rather than always one direction.
            const rect = el.getBoundingClientRect();
            const elCenter = rect.left + rect.width / 2;
            const flyDir = elCenter < viewportCenter ? -1 : 1;

            gsap.to(el, {
                y: `-=${200 * depth}`,
                x: `+=${flyDir * 100 * depth}`,
                rotation: baseRotate + (Math.random() - 0.5) * 60,
                scale: 1 + depth * 0.3,
                opacity: 0,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1,
                },
            });
        });

        gsap.to('.hero__content', {
            scale: 0.92,
            opacity: 0.4,
            y: -60,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1,
            },
        });
    }

    // 5) MOUSE PARALLAX + AUTO-DRIFT — scatter layer drifts on a figure-8
    //    path even when idle. The rAF loop pauses when the hero scrolls
    //    off-screen (saves CPU/battery on mobile).
    const hero = document.querySelector('.hero');
    const scatter = document.querySelector('.hero__scatter');
    let mouseX = 0, mouseY = 0;
    let curX = 0, curY = 0;
    let heroVisible = true;
    const startTime = performance.now();

    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        mouseX = (e.clientX - rect.left) / rect.width - 0.5;
        mouseY = (e.clientY - rect.top) / rect.height - 0.5;
    });

    // Pause the rAF loop whenever the hero leaves the viewport
    if ('IntersectionObserver' in window) {
        new IntersectionObserver(([entry]) => {
            heroVisible = entry.isIntersecting;
            if (heroVisible) rafId = requestAnimationFrame(loop);
        }, { threshold: 0 }).observe(hero);
    }

    let rafId;
    function loop(now) {
        if (!heroVisible) return; // bail until hero scrolls back into view

        curX += (mouseX - curX) * 0.06;
        curY += (mouseY - curY) * 0.06;

        const t = (now - startTime) / 1000;
        const autoX = Math.sin(t * 0.4) * 15;
        const autoY = Math.cos(t * 0.3) * 10;

        scatter.style.transform =
            `translate3d(${curX * 30 + autoX}px, ${curY * 20 + autoY}px, 0)`;

        rafId = requestAnimationFrame(loop);
    }
    rafId = requestAnimationFrame(loop);
}

// Defer the hero animation until ALL hero images have loaded — otherwise
// the explosion measures incorrect element sizes (0×0) and bursts from wrong
// positions.
if (document.readyState === 'complete') {
    initHeroAnimation();
} else {
    window.addEventListener('load', initHeroAnimation);
}

// ============ SCROLL-REVEAL ANIMATIONS FOR ALL SECTIONS ============
// Each section gets its own choreographed entrance as it scrolls into view.
// Uses GSAP ScrollTrigger (already loaded for the hero animations).
if (window.gsap && window.ScrollTrigger) {

    // Universal trigger setup — animation runs once when section enters viewport
    const reveal = (selector, vars) => {
        document.querySelectorAll(selector).forEach((el) => {
            gsap.from(el, {
                ...vars,
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                },
            });
        });
    };

    // Every section's header (tag + h2 + p) fades up first
    reveal('.section-head', {
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: 'power3.out',
    });

    // ABOUT — 4 cards rise in a staggered cascade with subtle scale
    gsap.utils.toArray('.about-card').forEach((card, i) => {
        gsap.from(card, {
            opacity: 0,
            y: 60,
            scale: 0.92,
            duration: 0.8,
            ease: 'back.out(1.4)',
            delay: i * 0.1,
            scrollTrigger: {
                trigger: '.about__grid',
                start: 'top 80%',
                toggleActions: 'play none none none',
            },
        });
    });

    // LIVESTOCK — 4 large cards scale in from bottom with strong easing
    gsap.utils.toArray('.livestock-card').forEach((card, i) => {
        gsap.from(card, {
            opacity: 0,
            y: 80,
            scale: 0.85,
            rotation: i % 2 === 0 ? -3 : 3,
            duration: 1,
            ease: 'expo.out',
            delay: i * 0.12,
            scrollTrigger: {
                trigger: '.livestock__grid',
                start: 'top 80%',
                toggleActions: 'play none none none',
            },
        });
    });

    // PRODUCTS — staggered fade-up + rotation flip from below
    gsap.utils.toArray('.product').forEach((card, i) => {
        gsap.from(card, {
            opacity: 0,
            y: 70,
            rotationX: 30,
            transformPerspective: 800,
            duration: 0.9,
            ease: 'power3.out',
            delay: (i % 4) * 0.08, // stagger by column position
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
        });
    });

    // WHY-US — items slide in from the left, one after another
    gsap.utils.toArray('.why-item').forEach((item, i) => {
        gsap.from(item, {
            opacity: 0,
            x: -60,
            duration: 0.7,
            ease: 'power2.out',
            delay: i * 0.12,
            scrollTrigger: {
                trigger: '.why__list',
                start: 'top 75%',
                toggleActions: 'play none none none',
            },
        });
    });

    // WHY left column header — slide from left
    reveal('.why__left', {
        opacity: 0,
        x: -50,
        duration: 0.9,
        ease: 'power3.out',
    });

    // CTA box — dramatic scale-in
    reveal('.cta__box', {
        opacity: 0,
        scale: 0.85,
        y: 60,
        duration: 1,
        ease: 'expo.out',
    });

    // CONTACT — info and form fade in from opposite sides
    reveal('.contact__info', {
        opacity: 0,
        x: -50,
        duration: 0.9,
        ease: 'power3.out',
    });
    reveal('.contact__form', {
        opacity: 0,
        x: 50,
        duration: 0.9,
        ease: 'power3.out',
    });

    // FOOTER columns stagger up
    gsap.utils.toArray('.footer__col').forEach((col, i) => {
        gsap.from(col, {
            opacity: 0,
            y: 30,
            duration: 0.7,
            delay: i * 0.1,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.footer',
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
        });
    });
}

// ============ SMOOTH SCROLL FIX FOR HEADER ============
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const offset = 90;
            const targetPos = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({
                top: targetPos,
                behavior: 'smooth'
            });
        }
    });
});
