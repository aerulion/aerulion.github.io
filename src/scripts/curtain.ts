/* On the duration scale in global.css: md, md, xl. */
const SEEN_KEY = 'aerulion:seen';
const NAV_HOLD = 500;
const LIFT = 500;
const INTRO_HOLD = 1000;

export function mountCurtain(curtain: HTMLElement) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const label = curtain.querySelector<HTMLElement>('[data-curtain-label]');
    const construct = curtain.querySelector('.curtain-construct');

    const cover = () => {
        curtain.dataset.state = 'active';
        requestAnimationFrame(() => construct?.classList.add('is-drawn'));
    };

    const lift = () => {
        curtain.dataset.state = 'lifting';
        window.setTimeout(() => {
            delete curtain.dataset.state;
            construct?.classList.remove('is-drawn');
        }, LIFT);
    };

    const routeFor = (event: MouseEvent): URL | null => {
        if (event.defaultPrevented || event.button !== 0) return null;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null;

        const link = (event.target as Element | null)?.closest?.('a');
        if (!link?.href) return null;
        if (link.target === '_blank' || link.hasAttribute('download')) return null;
        if (link.getAttribute('href')?.startsWith('#')) return null;

        const url = new URL(link.href, location.href);
        if (url.origin !== location.origin) return null;
        if (url.pathname === location.pathname) return null;
        return url;
    };

    document.addEventListener('click', (event) => {
        const url = routeFor(event);
        if (!url) return;

        event.preventDefault();
        if (label) label.textContent = `Routing / ${url.pathname}`;

        cover();
        window.setTimeout(() => {
            location.href = url.href;
        }, NAV_HOLD);
    });

    if (sessionStorage.getItem(SEEN_KEY) === '1') {
        window.addEventListener('pageshow', (event) => {
            if (event.persisted) lift();
        });
        return;
    }

    sessionStorage.setItem(SEEN_KEY, '1');
    cover();
    window.setTimeout(lift, INTRO_HOLD);
}
