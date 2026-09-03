import {mkdirSync, writeFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {spawn} from 'node:child_process';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 9333;
const HERE = dirname(fileURLToPath(import.meta.url));

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const chrome = spawn(
    CHROME,
    [
        '--headless=new',
        '--disable-gpu',
        '--hide-scrollbars',
        '--allow-file-access-from-files',
        '--no-first-run',
        '--disable-extensions',
        `--remote-debugging-port=${PORT}`,
        'about:blank'
    ],
    {stdio: 'ignore'}
);

const endpoint = async () => {
    for (let i = 0; i < 100; i++) {
        try {
            const res = await fetch(`http://127.0.0.1:${PORT}/json/version`);
            return (await res.json()).webSocketDebuggerUrl;
        } catch {
            await sleep(100);
        }
    }
    throw new Error('Chrome did not open a debugging port');
};

const ws = new WebSocket(await endpoint());
await new Promise((r) => ws.addEventListener('open', r, {once: true}));

let nextId = 0;
const pending = new Map();
const events = new Map();

ws.addEventListener('message', (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id !== undefined) {
        const slot = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.error) slot.reject(new Error(msg.error.message));
        else slot.resolve(msg.result);
        return;
    }
    const waiters = events.get(msg.method);
    if (waiters) {
        events.delete(msg.method);
        for (const resolve of waiters) resolve(msg.params);
    }
});

const send = (method, params = {}, sessionId) =>
    new Promise((resolve, reject) => {
        const id = ++nextId;
        pending.set(id, {resolve, reject});
        ws.send(JSON.stringify({id, method, params, sessionId}));
    });

const once = (method) =>
    new Promise((resolve) => {
        if (!events.has(method)) events.set(method, []);
        events.get(method).push(resolve);
    });

const {targetId} = await send('Target.createTarget', {url: 'about:blank'});
const {sessionId} = await send('Target.attachToTarget', {targetId, flatten: true});
const call = (method, params) => send(method, params, sessionId);

await call('Page.enable');
await call('Runtime.enable');

const metrics = (width, height, scale) =>
    call('Emulation.setDeviceMetricsOverride', {
        width,
        height,
        deviceScaleFactor: scale,
        mobile: false,
        screenWidth: width,
        screenHeight: height
    });

const open = async (page, query = '') => {
    const loaded = once('Page.loadEventFired');
    await call('Page.navigate', {url: `${pathToFileURL(resolve(HERE, page)).href}${query}`});
    await loaded;
    await call('Runtime.evaluate', {expression: 'document.fonts.ready', awaitPromise: true});
};

const capture = async (file) => {
    const {data} = await call('Page.captureScreenshot', {format: 'png', fromSurface: true});
    mkdirSync(dirname(file), {recursive: true});
    writeFileSync(file, Buffer.from(data, 'base64'));
};

const phase = (t) =>
    call('Runtime.evaluate', {expression: `window.render(${t})`, awaitPromise: true, returnByValue: true});

for (const job of JSON.parse(process.argv[2])) {
    const {page, width, height, scale, out} = job;
    await metrics(width, height, scale);
    await open(page, job.query ?? '');

    if (job.frames === undefined) {
        await capture(resolve(HERE, out));
        continue;
    }

    for (let i = 0; i < job.frames; i++) {
        await phase(i / job.frames);
        await capture(resolve(HERE, out.replace('%d', String(i).padStart(4, '0'))));
    }
}

ws.close();
chrome.kill();
