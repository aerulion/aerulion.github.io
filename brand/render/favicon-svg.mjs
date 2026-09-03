import {SILHOUETTE} from './morphing-logo.js';

const BOX = 0.86;
const VIEW = (2 * 24) / Math.sqrt(3);
const span = VIEW / BOX;
const pad = Number(((span - VIEW) / 2).toFixed(4));
const size = Number(span.toFixed(4));

process.stdout.write(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-pad} ${-pad} ${size} ${size}">` +
        `<path fill="#000" d="M${-pad} ${-pad}h${size}v${size}h${-size}z"/>` +
        `<path fill="#fff" d="${SILHOUETTE}"/></svg>\n`
);
