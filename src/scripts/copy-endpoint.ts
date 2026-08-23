const RESET = 2200;

export function mountCopyEndpoints() {
    const buttons = document.querySelectorAll<HTMLButtonElement>('[data-copy]');

    for (const button of buttons) {
        const note = button.querySelector<HTMLElement>('[data-copy-note]');
        const value = button.dataset.copy;
        if (!note || !value) continue;

        const original = note.textContent ?? '';
        let timer = 0;

        button.addEventListener('click', async () => {
            let message = 'Handle copied';
            try {
                await navigator.clipboard.writeText(value);
            } catch {
                message = 'Copy failed';
            }
            note.textContent = message;
            window.clearTimeout(timer);
            timer = window.setTimeout(() => {
                note.textContent = original;
            }, RESET);
        });
    }
}
