const REVEAL_STAGGER = 80;
const MAX_STAGGERED = 3;
const WIPE_MS = 800;
const SETTLE_GRACE = 260;
const SETTLE_AFTER = MAX_STAGGERED * REVEAL_STAGGER + WIPE_MS + SETTLE_GRACE;

export function mountReveals() {
    document.documentElement.classList.add('motion-ready');

    const reveals = document.querySelectorAll<HTMLElement>('[data-reveal]');
    const draws = document.querySelectorAll<HTMLElement>('[data-draw]');

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion || !('IntersectionObserver' in window)) {
        reveals.forEach((el) => el.classList.add('is-revealed', 'is-settled'));
        draws.forEach((el) => el.classList.add('is-drawn'));
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                if (entry.target.hasAttribute('data-draw')) {
                    entry.target.classList.add('is-drawn');
                } else {
                    const target = entry.target;
                    target.classList.add('is-revealed');
                    window.setTimeout(() => target.classList.add('is-settled'), SETTLE_AFTER);
                }
                observer.unobserve(entry.target);
            }
        },
        {rootMargin: '0px 0px -10% 0px', threshold: 0.05}
    );

    reveals.forEach((el, index) => {
        el.style.setProperty('--reveal-delay', `${Math.min(index, MAX_STAGGERED) * REVEAL_STAGGER}ms`);
        observer.observe(el);
    });
    draws.forEach((el) => observer.observe(el));
}
