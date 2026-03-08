
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');

    // ── Dark / Light Mode ──
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
        themeToggle.textContent = '☀️';
    }

    themeToggle.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark');
        themeToggle.textContent = isDark ? '☀️' : '🌙';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // ── Mobile Drawer ──
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const drawerClose = document.getElementById('drawer-close');
    const drawerOverlay = document.getElementById('drawer-overlay');

    function openDrawer() {
        mobileDrawer.classList.add('open');
        drawerOverlay.classList.add('open');
    }
    function closeDrawer() {
        mobileDrawer.classList.remove('open');
        drawerOverlay.classList.remove('open');
    }

    mobileMenuBtn.addEventListener('click', openDrawer);
    drawerClose.addEventListener('click', closeDrawer);
    drawerOverlay.addEventListener('click', closeDrawer);
    mobileDrawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));

    // ── Category Tab Active State ──
    const catBtns = document.querySelectorAll('.cat-btn');
    catBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            catBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const target = document.getElementById(btn.dataset.target);
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Update active category on scroll
    const sections = ['charts-section', 'disqus-section', 'contact-section'];
    window.addEventListener('scroll', () => {
        let current = sections[0];
        sections.forEach(id => {
            const el = document.getElementById(id);
            if (el && el.getBoundingClientRect().top <= 140) current = id;
        });
        catBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.target === current);
        });
    }, { passive: true });

    // ── Contact Form (Formspree) ──
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector('.submit-btn');
        submitBtn.disabled = true;
        formStatus.textContent = '전송 중...';

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                formStatus.textContent = '문의가 성공적으로 전송되었습니다. 감사합니다!';
                contactForm.reset();
            } else {
                formStatus.textContent = '전송에 실패했습니다. 잠시 후 다시 시도해 주세요.';
            }
        } catch {
            formStatus.textContent = '네트워크 오류가 발생했습니다. 다시 시도해 주세요.';
        } finally {
            submitBtn.disabled = false;
        }
    });

});
