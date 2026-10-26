/* Vector product renders. Every product can be drawn in any of its finishes,
   so the site still looks right when a hotlinked Apple CDN image is unavailable. */

const APPLE_LOGO = 'M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z';

const appleLogo = (cls = '') => `<svg class="apple-logo ${cls}" viewBox="0 0 814 1000" aria-hidden="true"><path fill="currentColor" d="${APPLE_LOGO}"/></svg>`;
const logoAt = (x, y, h, fill) => `<path d="${APPLE_LOGO}" fill="${fill}" transform="translate(${x - h * 0.407} ${y - h / 2}) scale(${h / 1000})"/>`;

let _uid = 0;
const uid = p => `${p}${++_uid}`;

function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  const f = v => Math.max(0, Math.min(255, Math.round(amt < 0 ? v * (1 + amt) : v + (255 - v) * amt)));
  return '#' + [f(r), f(g), f(b)].map(v => v.toString(16).padStart(2, '0')).join('');
}
const isLight = hex => { const n = parseInt(hex.slice(1), 16); return ((n >> 16) * 299 + ((n >> 8) & 255) * 587 + (n & 255) * 114) / 1000 > 150; };

/* ---- shared pieces ---- */
function grad(id, c, dir = 'v') {
  const [x2, y2] = dir === 'v' ? [0, 1] : dir === 'd' ? [1, 1] : [1, 0];
  return `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}"><stop offset="0" stop-color="${shade(c, .18)}"/><stop offset=".55" stop-color="${c}"/><stop offset="1" stop-color="${shade(c, -.18)}"/></linearGradient>`;
}
function wallpaper(id, a, b, c) {
  return `<radialGradient id="${id}" cx=".3" cy=".25" r="1.1"><stop offset="0" stop-color="${a}"/><stop offset=".5" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></radialGradient>`;
}
function lens(cx, cy, r, ring = '#2a2a2c') {
  const g = uid('lg');
  return `<defs><radialGradient id="${g}" cx=".35" cy=".35" r=".7"><stop offset="0" stop-color="#4a5468"/><stop offset=".45" stop-color="#101218"/><stop offset="1" stop-color="#000"/></radialGradient></defs>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="${ring}" stroke="${shade(ring, .25)}" stroke-width="1.5"/>
  <circle cx="${cx}" cy="${cy}" r="${r * .72}" fill="#050506"/>
  <circle cx="${cx}" cy="${cy}" r="${r * .55}" fill="url(#${g})"/>
  <circle cx="${cx - r * .18}" cy="${cy - r * .2}" r="${r * .12}" fill="#9fb1d6" opacity=".55"/>`;
}
const WALLS = [['#ff9f6b', '#c2365a', '#2a1446'], ['#7fd1ff', '#3d5bd9', '#0c1440'], ['#ffe08a', '#ff7a59', '#5b1f4f'], ['#b7f5d0', '#2f9e8f', '#0b2d3b']];
function wallFor(color) {
  const n = parseInt(color.slice(1), 16);
  return WALLS[n % WALLS.length];
}

/* ---- phones ---- */
function phoneFront(x, y, w, h, frame, wall, opts = {}) {
  const wid = uid('w');
  const r = opts.r || w * .2;
  return `<defs>${wallpaper(wid, ...wall)}</defs>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${shade(frame, -.1)}"/>
  <rect x="${x + 2}" y="${y + 2}" width="${w - 4}" height="${h - 4}" rx="${r - 2}" fill="#050505"/>
  <rect x="${x + 9}" y="${y + 9}" width="${w - 18}" height="${h - 18}" rx="${r - 8}" fill="url(#${wid})"/>
  ${opts.island === false ? '' : `<rect x="${x + w / 2 - w * .15}" y="${y + 20}" width="${w * .3}" height="${w * .09}" rx="${w * .045}" fill="#000"/>`}
  <text x="${x + w / 2}" y="${y + h * .2}" text-anchor="middle" fill="#fff" opacity=".92" font-family="-apple-system,Helvetica,Arial" font-weight="600" font-size="${w * .25}">9:41</text>
  <text x="${x + w / 2}" y="${y + h * .1}" text-anchor="middle" fill="#fff" opacity=".8" font-family="-apple-system,Helvetica,Arial" font-weight="500" font-size="${w * .06}">Monday, October 26</text>`;
}

function phoneBack(x, y, w, h, color, kind) {
  const g = uid('pb'), cl = uid('cl');
  const r = w * .2;
  const dark = shade(color, -.35);
  const logoFill = isLight(color) ? shade(color, -.12) : shade(color, .12);
  let cam = '';
  if (kind === 'pro') {
    const ph = h * .3;
    cam = `<g clip-path="url(#${cl})"><rect x="${x}" y="${y}" width="${w}" height="${ph}" fill="${shade(color, -.06)}"/>
    <rect x="${x}" y="${y + ph - 2}" width="${w}" height="3" fill="${shade(color, -.2)}" opacity=".6"/></g>
    <rect x="${x + w * .07}" y="${y + w * .07}" width="${w * .6}" height="${ph - w * .14}" rx="${w * .14}" fill="${shade(color, -.12)}" stroke="${shade(color, -.25)}" stroke-width="1"/>
    ${lens(x + w * .22, y + w * .22, w * .105)}${lens(x + w * .22, y + ph - w * .22, w * .105)}${lens(x + w * .5, y + ph / 2, w * .105)}
    <circle cx="${x + w * .82}" cy="${y + w * .2}" r="${w * .035}" fill="#f4ecd0" stroke="${dark}"/>
    <circle cx="${x + w * .82}" cy="${y + ph - w * .2}" r="${w * .03}" fill="#111"/>`;
  } else if (kind === 'air') {
    const ph = w * .3;
    cam = `<rect x="${x + w * .06}" y="${y + w * .08}" width="${w * .88}" height="${ph}" rx="${ph / 2}" fill="${shade(color, -.08)}" stroke="${shade(color, -.22)}"/>
    ${lens(x + w * .06 + ph / 2, y + w * .08 + ph / 2, ph * .36)}${lens(x + w * .06 + ph * 1.25, y + w * .08 + ph / 2, ph * .3)}
    <circle cx="${x + w * .8}" cy="${y + w * .08 + ph / 2}" r="${w * .03}" fill="#f4ecd0"/>`;
  } else if (kind === '17' || kind === '16') {
    const cw = w * .3, chh = w * .58;
    cam = `<rect x="${x + w * .07}" y="${y + w * .07}" width="${cw}" height="${chh}" rx="${cw / 2}" fill="${shade(color, -.06)}" stroke="${shade(color, -.2)}"/>
    ${lens(x + w * .07 + cw / 2, y + w * .07 + cw / 2, cw * .38)}${lens(x + w * .07 + cw / 2, y + w * .07 + chh - cw / 2, cw * .38)}
    <circle cx="${x + w * .07 + cw + w * .07}" cy="${y + w * .07 + chh / 2}" r="${w * .03}" fill="#f4ecd0"/>`;
  } else {
    const cw = w * .26;
    cam = `<rect x="${x + w * .08}" y="${y + w * .08}" width="${cw}" height="${cw}" rx="${cw * .32}" fill="${shade(color, -.06)}" stroke="${shade(color, -.2)}"/>
    ${lens(x + w * .08 + cw / 2, y + w * .08 + cw / 2, cw * .36)}`;
  }
  return `<defs>${grad(g, color, 'd')}<clipPath id="${cl}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/></clipPath></defs>
  <rect x="${x - 2}" y="${y - 2}" width="${w + 4}" height="${h + 4}" rx="${r + 2}" fill="${shade(color, -.3)}"/>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="url(#${g})"/>
  <rect x="${x + 3}" y="${y + 3}" width="${w - 6}" height="${h - 6}" rx="${r - 3}" fill="none" stroke="#fff" stroke-opacity=".25"/>
  ${cam}
  ${logoAt(x + w / 2, y + h * .52, w * .16, logoFill)}`;
}

function phonePair(color, kind) {
  const wall = wallFor(color);
  const front = phoneFront(30, 70, 220, 460, color, wall);
  const back = phoneBack(200, 30, 230, 480, color, kind);
  return `<svg viewBox="0 0 460 560" class="render">${front}${back}</svg>`;
}

function duo(color) {
  const wall = ['#ffd9a0', '#e2597a', '#2b1550'];
  const wid = uid('w'), g = uid('g');
  return `<svg viewBox="0 0 640 560" class="render"><defs>${wallpaper(wid, ...wall)}${grad(g, color, 'd')}</defs>
  <rect x="26" y="40" width="440" height="480" rx="46" fill="${shade(color, -.25)}"/>
  <rect x="30" y="44" width="432" height="472" rx="42" fill="#050505"/>
  <rect x="40" y="54" width="412" height="452" rx="34" fill="url(#${wid})"/>
  <line x1="246" y1="54" x2="246" y2="506" stroke="#fff" stroke-opacity=".08" stroke-width="3"/>
  <text x="140" y="140" text-anchor="middle" fill="#fff" font-family="-apple-system,Helvetica" font-weight="600" font-size="58">9:41</text>
  ${[0, 1, 2, 3].map(i => [0, 1, 2, 3].map(j => `<rect x="${268 + j * 44}" y="${90 + i * 54}" width="32" height="32" rx="9" fill="#fff" opacity="${.18 + ((i + j) % 3) * .08}"/>`).join('')).join('')}
  <rect x="70" y="190" width="150" height="150" rx="26" fill="#fff" opacity=".16"/>
  <rect x="70" y="360" width="340" height="110" rx="26" fill="#fff" opacity=".12"/>
  <rect x="466" y="36" width="11" height="488" rx="5" fill="${shade(color, -.15)}"/>
  ${phoneBack(400, 60, 214, 450, color, '17')}
  </svg>`;
}

/* ---- laptops & desktops ---- */
function laptop(color, kind) {
  const wid = uid('w'), g = uid('g');
  const wall = kind === 'neo' ? ['#fff3a3', shade(color, -.2), shade(color, -.6)] : kind === 'pro' ? ['#ff9f4a', '#b2264f', '#14093a'] : ['#cfe8ff', '#4d79d6', '#151b4a'];
  const bez = kind === 'neo' ? 22 : 14;
  return `<svg viewBox="0 0 800 520" class="render"><defs>${wallpaper(wid, ...wall)}${grad(g, color, 'v')}</defs>
  <rect x="96" y="16" width="608" height="398" rx="22" fill="${shade(color, -.2)}"/>
  <rect x="100" y="20" width="600" height="390" rx="19" fill="#0a0a0a"/>
  <rect x="${100 + bez}" y="${20 + bez}" width="${600 - bez * 2}" height="${390 - bez * 2 - 6}" rx="6" fill="url(#${wid})"/>
  ${kind === 'neo' ? '' : `<rect x="370" y="20" width="60" height="16" rx="6" fill="#0a0a0a"/>`}
  <rect x="${100 + bez}" y="${20 + bez}" width="${600 - bez * 2}" height="14" fill="#000" opacity=".25"/>
  ${[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => `<rect x="${290 + i * 25}" y="${360 - (kind === 'neo' ? 12 : 0)}" width="19" height="19" rx="5" fill="#fff" opacity=".55"/>`).join('')}
  <rect x="300" y="${110 + (kind === 'neo' ? 10 : 0)}" width="200" height="130" rx="10" fill="#fff" opacity=".18"/>
  <path d="M36 414 H764 Q768 414 766 420 L752 444 Q748 450 740 450 H60 Q52 450 48 444 L34 420 Q32 414 36 414Z" fill="url(#${g})"/>
  <path d="M36 414 H764 L762 419 H38Z" fill="${shade(color, -.28)}"/>
  <path d="M340 414 H460 Q458 424 448 424 H352 Q342 424 340 414Z" fill="${shade(color, -.22)}"/>
  </svg>`;
}

function imac(color, dark) {
  const wid = uid('w'), g = uid('g');
  return `<svg viewBox="0 0 600 560" class="render"><defs>${wallpaper(wid, shade(dark, .6), dark, shade(dark, -.55))}${grad(g, color, 'v')}</defs>
  <path d="M250 430 L230 520 H370 L350 430Z" fill="${shade(color, -.08)}"/>
  <rect x="200" y="516" width="200" height="10" rx="4" fill="${shade(color, -.2)}"/>
  <rect x="20" y="20" width="560" height="420" rx="20" fill="url(#${g})"/>
  <rect x="20" y="20" width="560" height="340" rx="20" fill="#f5f5f7"/>
  <rect x="34" y="34" width="532" height="316" rx="4" fill="url(#${wid})"/>
  <rect x="20" y="340" width="560" height="100" rx="0" fill="url(#${g})"/>
  <rect x="20" y="420" width="560" height="20" rx="10" fill="url(#${g})"/>
  </svg>`;
}

function macMini(color, tall) {
  const h = tall ? 150 : 70;
  return `<svg viewBox="0 0 600 420" class="render">
  <path d="M120 ${260 - h} L300 ${190 - h} L480 ${260 - h} L300 ${330 - h}Z" fill="${shade(color, .1)}"/>
  <path d="M120 ${260 - h} L300 ${330 - h} L300 330 L120 260Z" fill="${shade(color, -.08)}"/>
  <path d="M480 ${260 - h} L300 ${330 - h} L300 330 L480 260Z" fill="${shade(color, -.18)}"/>
  ${logoAt(300, 260 - h, 34, shade(color, -.08))}
  ${tall ? [0, 1, 2].map(i => `<rect x="${150 + i * 30}" y="${255 - i * 10}" width="16" height="9" rx="3" transform="skewY(22)" fill="#333"/>`).join('') : `<rect x="160" y="250" width="16" height="9" rx="3" transform="skewY(22)" fill="#333"/><rect x="190" y="262" width="16" height="9" rx="3" transform="skewY(22)" fill="#333"/>`}
  </svg>`;
}

function display(color) {
  const wid = uid('w');
  return `<svg viewBox="0 0 600 520" class="render"><defs>${wallpaper(wid, '#ffcf7a', '#e0567c', '#271340')}</defs>
  <path d="M260 340 L240 490 H360 L340 340Z" fill="${shade(color, -.1)}"/>
  <rect x="210" y="486" width="180" height="10" rx="4" fill="${shade(color, -.25)}"/>
  <rect x="20" y="20" width="560" height="340" rx="16" fill="${shade(color, -.15)}"/>
  <rect x="24" y="24" width="552" height="332" rx="13" fill="#0a0a0a"/>
  <rect x="38" y="38" width="524" height="304" rx="4" fill="url(#${wid})"/>
  </svg>`;
}

/* ---- iPad ---- */
function tablet(color, kind) {
  const wid = uid('w');
  const [w, h] = kind === 'mini' ? [300, 450] : [380, 520];
  const x = (460 - w) / 2, y = 20;
  const bez = kind === 'pro' ? 12 : 18;
  const wall = kind === 'pro' ? ['#ffb36b', '#d23d6a', '#1b0d3a'] : ['#c6f0ff', shade(color, -.25), shade(color, -.65)];
  return `<svg viewBox="0 0 460 560" class="render"><defs>${wallpaper(wid, ...wall)}</defs>
  <rect x="${x - 3}" y="${y - 3}" width="${w + 6}" height="${h + 6}" rx="34" fill="${shade(color, -.2)}"/>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="31" fill="${color}"/>
  <rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${h - 8}" rx="28" fill="#0a0a0a"/>
  <rect x="${x + bez}" y="${y + bez}" width="${w - bez * 2}" height="${h - bez * 2}" rx="${22 - (18 - bez) / 2}" fill="url(#${wid})"/>
  <text x="${x + w / 2}" y="${y + h * .2}" text-anchor="middle" fill="#fff" font-family="-apple-system,Helvetica" font-weight="600" font-size="${w * .2}">9:41</text>
  ${[0, 1, 2, 3].map(i => `<rect x="${x + bez + 22 + i * (w - bez * 2 - 44) / 4 + 6}" y="${y + h - bez - 70}" width="${(w - bez * 2 - 44) / 4 - 12}" height="${(w - bez * 2 - 44) / 4 - 12}" rx="12" fill="#fff" opacity=".22"/>`).join('')}
  </svg>`;
}

/* ---- Watch ---- */
function watch(color, kind) {
  const g = uid('g'), band = kind === 'ultra' ? (isLight(color) ? '#e2672a' : '#3b4d3a') : shade(color, isLight(color) ? -.04 : .12);
  const cx = 150;
  const ultra = kind === 'ultra';
  const cw = ultra ? 180 : 160, ch = ultra ? 210 : 196, cr = ultra ? 40 : 52;
  const x = cx - cw / 2, y = 150;
  const time = `<text x="${cx}" y="${y + ch * .42}" text-anchor="middle" fill="${ultra ? '#ff7b1c' : '#fff'}" font-family="-apple-system,Helvetica" font-weight="${ultra ? 700 : 300}" font-size="${ultra ? 54 : 50}">10:09</text>`;
  const rings = [['#fa114f', 26], ['#92e82a', 19], ['#1eeaef', 12]].map(([c, r]) => `<circle cx="${cx}" cy="${y + ch * .7}" r="${r}" fill="none" stroke="${c}" stroke-opacity=".25" stroke-width="6"/><circle cx="${cx}" cy="${y + ch * .7}" r="${r}" fill="none" stroke="${c}" stroke-width="6" stroke-linecap="round" stroke-dasharray="${r * 6.28 * .72} 999" transform="rotate(-90 ${cx} ${y + ch * .7})"/>`).join('');
  return `<svg viewBox="0 0 300 520" class="render"><defs>${grad(g, color, 'h')}</defs>
  <rect x="${cx - 62}" y="0" width="124" height="${y + 20}" rx="18" fill="${band}"/>
  <rect x="${cx - 62}" y="${y + ch - 20}" width="124" height="${520 - y - ch + 20}" rx="18" fill="${band}"/>
  ${kind === 'ultra' ? '' : [0, 1, 2, 3, 4, 5].map(i => `<circle cx="${cx}" cy="${y + ch + 50 + i * 40}" r="5" fill="${shade(band, -.2)}"/>`).join('')}
  <rect x="${x - 3}" y="${y - 3}" width="${cw + 6}" height="${ch + 6}" rx="${cr + 3}" fill="${shade(color, -.3)}"/>
  <rect x="${x}" y="${y}" width="${cw}" height="${ch}" rx="${cr}" fill="url(#${g})"/>
  <rect x="${x + (ultra ? 14 : 8)}" y="${y + (ultra ? 14 : 8)}" width="${cw - (ultra ? 28 : 16)}" height="${ch - (ultra ? 28 : 16)}" rx="${cr - 8}" fill="#000"/>
  ${time}${ultra ? `<text x="${cx}" y="${y + ch * .7}" text-anchor="middle" fill="#ff7b1c" font-family="-apple-system,Helvetica" font-size="15" font-weight="600">WAYFINDER · 72°</text><circle cx="${cx}" cy="${y + ch * .82}" r="12" fill="none" stroke="#ff7b1c" stroke-width="2"/>` : rings}
  <rect x="${x + cw - 2}" y="${y + 46}" width="${ultra ? 16 : 12}" height="${ultra ? 40 : 34}" rx="5" fill="${shade(color, -.1)}" stroke="${shade(color, -.3)}"/>
  <rect x="${x + cw}" y="${y + 110}" width="6" height="34" rx="3" fill="${shade(color, -.2)}"/>
  ${ultra ? `<rect x="${x - 10}" y="${y + 50}" width="10" height="44" rx="4" fill="#ff6a13"/>` : ''}
  </svg>`;
}

/* ---- AirPods ---- */
function bud(x, y, s, flip, pro) {
  const t = `translate(${x} ${y}) scale(${flip ? -s : s} ${s})`;
  return `<g transform="${t}">
    <rect x="-9" y="20" width="18" height="${pro ? 70 : 90}" rx="9" fill="#f2f2f4" stroke="#d2d2d7"/>
    <ellipse cx="4" cy="16" rx="26" ry="24" fill="#fafafa" stroke="#d2d2d7"/>
    ${pro ? `<ellipse cx="-12" cy="14" rx="12" ry="14" fill="#e6e6ea"/>` : ''}
    <ellipse cx="14" cy="10" rx="8" ry="6" fill="#2a2a2c" opacity=".85"/>
    <rect x="-5" y="${pro ? 82 : 102}" width="10" height="6" rx="3" fill="#c7c7cc"/>
  </g>`;
}
function airpods(kind) {
  const g = uid('g');
  return `<svg viewBox="0 0 460 460" class="render"><defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e3e3e8"/></linearGradient></defs>
  <rect x="80" y="210" width="${kind === 'pro' ? 230 : 210}" height="${kind === 'pro' ? 170 : 190}" rx="60" fill="url(#${g})" stroke="#d2d2d7" stroke-width="2"/>
  <line x1="80" y1="${kind === 'pro' ? 262 : 270}" x2="${kind === 'pro' ? 310 : 290}" y2="${kind === 'pro' ? 262 : 270}" stroke="#d2d2d7" stroke-width="2"/>
  <circle cx="${kind === 'pro' ? 195 : 185}" cy="320" r="4" fill="#b0e57c"/>
  ${bud(320, 120, 1.25, false, kind === 'pro')}${bud(390, 150, 1.25, true, kind === 'pro')}
  </svg>`;
}
function airpodsMax(color) {
  const g = uid('g');
  return `<svg viewBox="0 0 460 480" class="render"><defs>${grad(g, color, 'h')}</defs>
  <path d="M90 250 Q90 40 230 40 Q370 40 370 250" fill="none" stroke="#c8c8cc" stroke-width="16"/>
  <path d="M110 230 Q110 70 230 70 Q350 70 350 230" fill="none" stroke="${shade(color, .2)}" stroke-width="30" stroke-linecap="round"/>
  ${[110, 350].map(cx => `<rect x="${cx - 18}" y="200" width="36" height="50" rx="10" fill="#d1d1d6"/>`).join('')}
  <rect x="40" y="240" width="130" height="190" rx="54" fill="url(#${g})"/>
  <rect x="290" y="240" width="130" height="190" rx="54" fill="url(#${g})"/>
  <rect x="160" y="270" width="18" height="40" rx="7" fill="${shade(color, -.15)}"/>
  <circle cx="300" cy="280" r="10" fill="${shade(color, -.15)}"/>
  </svg>`;
}

/* ---- Home ---- */
function mesh(cx, cy, rx, ry, color, n = 14) {
  let d = '';
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    const px = cx - rx + (2 * rx) * (j + .5) / n, py = cy - ry + (2 * ry) * (i + .5) / n;
    if (((px - cx) / rx) ** 2 + ((py - cy) / ry) ** 2 < .92) d += `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="1.6" fill="${shade(color, -.18)}"/>`;
  }
  return d;
}
function homepodMini(color) {
  const g = uid('g'), gl = uid('gl');
  return `<svg viewBox="0 0 400 400" class="render"><defs><radialGradient id="${g}" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="${shade(color, .25)}"/><stop offset="1" stop-color="${shade(color, -.25)}"/></radialGradient>
  <radialGradient id="${gl}"><stop offset="0" stop-color="#fff"/><stop offset=".4" stop-color="#ff5fd2"/><stop offset=".75" stop-color="#5a6bff" stop-opacity=".8"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></radialGradient></defs>
  <ellipse cx="200" cy="340" rx="120" ry="16" fill="#000" opacity=".12"/>
  <path d="M60 170 Q60 340 200 340 Q340 340 340 170 Q340 120 200 120 Q60 120 60 170Z" fill="url(#${g})"/>
  ${mesh(200, 240, 135, 95, color, 26)}
  <ellipse cx="200" cy="150" rx="140" ry="34" fill="${shade(color, .05)}"/>
  <ellipse cx="200" cy="148" rx="80" ry="18" fill="url(#${gl})"/>
  </svg>`;
}
function homepod(color) {
  const g = uid('g'), gl = uid('gl');
  return `<svg viewBox="0 0 400 520" class="render"><defs>${grad(g, color, 'h')}<radialGradient id="${gl}"><stop offset="0" stop-color="#fff"/><stop offset=".5" stop-color="#ff5fd2"/><stop offset="1" stop-color="#5a6bff" stop-opacity=".3"/></radialGradient></defs>
  <rect x="80" y="70" width="240" height="410" rx="110" fill="url(#${g})"/>
  ${mesh(200, 290, 115, 190, color, 30)}
  <ellipse cx="200" cy="90" rx="110" ry="24" fill="${shade(color, -.05)}"/>
  <ellipse cx="200" cy="90" rx="62" ry="13" fill="url(#${gl})"/>
  </svg>`;
}
function appletv() {
  return `<svg viewBox="0 0 520 420" class="render">
  <rect x="40" y="160" width="300" height="140" rx="28" fill="#1d1d1f"/>
  <rect x="40" y="140" width="300" height="40" rx="28" fill="#2c2c2e"/>
  <path d="M60 160 H320" stroke="#3a3a3c" stroke-width="2"/>
  ${logoAt(170, 230, 40, '#3a3a3c')}<text x="200" y="244" fill="#3a3a3c" font-family="-apple-system,Helvetica" font-weight="600" font-size="38">tv</text>
  <rect x="390" y="60" width="80" height="320" rx="20" fill="#d9dadc"/>
  <circle cx="430" cy="120" r="32" fill="#c8c9cc" stroke="#b0b1b4"/>
  ${[180, 220, 260].map(y => `<circle cx="412" cy="${y}" r="10" fill="#1d1d1f"/><circle cx="448" cy="${y}" r="10" fill="#1d1d1f"/>`).join('')}
  </svg>`;
}
function homeview(color) {
  const wid = uid('w'), g = uid('g');
  return `<svg viewBox="0 0 520 460" class="render"><defs>${wallpaper(wid, '#ffd59a', '#e46a8a', '#2a1548')}${grad(g, color, 'h')}</defs>
  <rect x="140" y="330" width="240" height="100" rx="40" fill="url(#${g})"/>
  ${mesh(260, 385, 110, 36, color, 30)}
  <rect x="60" y="30" width="400" height="300" rx="34" fill="${shade(color, -.2)}"/>
  <rect x="66" y="36" width="388" height="288" rx="28" fill="#060606"/>
  <rect x="80" y="50" width="360" height="260" rx="18" fill="url(#${wid})"/>
  <text x="110" y="110" fill="#fff" font-family="-apple-system,Helvetica" font-weight="600" font-size="44">9:41</text>
  <text x="110" y="136" fill="#fff" opacity=".8" font-family="-apple-system,Helvetica" font-size="15">Living Room · 71°</text>
  ${[0, 1, 2].map(i => `<rect x="${110 + i * 106}" y="200" width="92" height="80" rx="16" fill="#fff" opacity="${.16 + i * .05}"/>`).join('')}
  </svg>`;
}
function vision() {
  const g = uid('g'), gl = uid('gl');
  return `<svg viewBox="0 0 600 380" class="render"><defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f2f2f4"/><stop offset="1" stop-color="#9a9ca1"/></linearGradient>
  <linearGradient id="${gl}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3b4256"/><stop offset=".35" stop-color="#05060a"/><stop offset=".7" stop-color="#14182a"/><stop offset="1" stop-color="#4b5470"/></linearGradient></defs>
  <path d="M60 210 Q20 260 70 300 L120 320" fill="none" stroke="#8e8f94" stroke-width="40" stroke-linecap="round"/>
  <path d="M540 210 Q580 260 530 300 L480 320" fill="none" stroke="#8e8f94" stroke-width="40" stroke-linecap="round"/>
  <path d="M80 130 Q80 70 170 66 L430 66 Q520 70 520 130 L520 230 Q520 290 450 292 Q370 294 330 250 Q300 226 270 250 Q230 294 150 292 Q80 290 80 230Z" fill="url(#${g})"/>
  <path d="M92 134 Q92 82 172 78 L428 78 Q508 82 508 134 L508 224 Q508 278 448 280 Q374 282 336 240 Q300 210 264 240 Q226 282 152 280 Q92 278 92 224Z" fill="url(#${gl})"/>
  <path d="M120 100 Q300 86 480 100" stroke="#fff" stroke-opacity=".25" stroke-width="6" fill="none" stroke-linecap="round"/>
  <rect x="440" y="58" width="44" height="12" rx="6" fill="#c0c1c5"/>
  </svg>`;
}

/* ---- accessories ---- */
function accessory(type, color) {
  const g = uid('g');
  const defs = `<defs>${grad(g, color, 'd')}</defs>`;
  const s = body => `<svg viewBox="0 0 400 400" class="render">${defs}${body}</svg>`;
  switch (type) {
    case 'pencil': return s(`<g transform="rotate(-38 200 200)"><rect x="40" y="186" width="300" height="28" rx="6" fill="url(#${g})" stroke="#d2d2d7"/><path d="M340 186 L380 200 L340 214Z" fill="#e8e8ea"/><path d="M366 195 L380 200 L366 205Z" fill="#555"/><rect x="40" y="186" width="20" height="28" rx="6" fill="#e5e5ea"/></g>`);
    case 'airtag': return s(`<circle cx="200" cy="200" r="130" fill="#c9cacd"/><circle cx="200" cy="200" r="122" fill="#fafafa" stroke="#e1e1e5" stroke-width="4"/>${logoAt(200, 200, 70, '#e6e6ea')}`);
    case 'charger': return s(`<path d="M200 300 Q200 380 320 380" fill="none" stroke="#f2f2f4" stroke-width="12" stroke-linecap="round"/><circle cx="200" cy="180" r="130" fill="#d4d5d8"/><circle cx="200" cy="180" r="118" fill="#fbfbfd"/><circle cx="200" cy="180" r="86" fill="none" stroke="#ececf0" stroke-width="3"/>`);
    case 'folio': return s(`<rect x="70" y="40" width="260" height="330" rx="40" fill="url(#${g})"/><rect x="200" y="40" width="4" height="330" fill="${shade(color, -.2)}"/><rect x="92" y="62" width="70" height="120" rx="30" fill="${shade(color, -.18)}"/>`);
    case 'case': return s(`<rect x="110" y="30" width="180" height="340" rx="40" fill="url(#${g})"/><rect x="122" y="42" width="156" height="110" rx="26" fill="${shade(color, -.15)}"/><circle cx="200" cy="230" r="44" fill="none" stroke="${shade(color, -.1)}" stroke-width="3"/>`);
    case 'keyboard': return s(`<rect x="30" y="120" width="340" height="200" rx="24" fill="url(#${g})"/>${[0, 1, 2, 3, 4].map(r => Array.from({ length: 12 }, (_, i) => `<rect x="${48 + i * 26.5}" y="${138 + r * 24}" width="22" height="19" rx="4" fill="${shade(color, isLight(color) ? -.12 : .12)}"/>`).join('')).join('')}<rect x="140" y="262" width="120" height="48" rx="8" fill="${shade(color, isLight(color) ? -.06 : .08)}"/>`);
    case 'mac-keyboard': return s(`<rect x="20" y="140" width="360" height="140" rx="16" fill="#e8e8ea"/>${[0, 1, 2, 3, 4].map(r => Array.from({ length: 13 }, (_, i) => `<rect x="34 " y="0" width="21" height="19" rx="4" transform="translate(${i * 25.6} ${156 + r * 23})" fill="${color}"/>`).join('')).join('')}`);
    case 'mouse': return s(`<path d="M200 50 Q300 50 300 160 L300 260 Q300 350 200 350 Q100 350 100 260 L100 160 Q100 50 200 50Z" fill="url(#${g})" stroke="${shade(color, -.15)}"/>${logoAt(200, 250, 36, shade(color, -.1))}`);
    case 'adapter': return s(`<path d="M120 120 L250 90 L320 140 L320 280 L190 320 L120 270Z" fill="#fbfbfd" stroke="#d2d2d7"/><path d="M120 120 L190 170 L320 140" fill="none" stroke="#e1e1e5"/><path d="M190 170 L190 320" stroke="#e1e1e5"/><rect x="225" y="200" width="44" height="16" rx="8" transform="skewY(-14)" fill="#333"/>`);
    case 'band': return s(`<ellipse cx="200" cy="200" rx="130" ry="150" fill="none" stroke="${color}" stroke-width="44"/><ellipse cx="200" cy="200" rx="130" ry="150" fill="none" stroke="#fff" stroke-opacity=".15" stroke-width="6"/>`);
    default: return s(`<rect x="80" y="80" width="240" height="240" rx="40" fill="url(#${g})"/>`);
  }
}

/* ---- dispatcher ---- */
function renderProduct(p, colorIdx = 0) {
  const c = (p.colors[colorIdx] || p.colors[0]);
  const hex = c.hex, dark = c.dark || shade(hex, -.3);
  switch (p.render) {
    case 'phone-pro': return phonePair(hex, 'pro');
    case 'phone-air': return phonePair(hex, 'air');
    case 'phone-17': return phonePair(hex, '17');
    case 'phone-16': return phonePair(hex, '16');
    case 'phone-e': return phonePair(hex, 'e');
    case 'phone-duo': return duo(hex);
    case 'laptop-neo': return laptop(hex, 'neo');
    case 'laptop-air': return laptop(hex, 'air');
    case 'laptop-pro': return laptop(hex, 'pro');
    case 'imac': return imac(hex, dark);
    case 'mac-mini': return macMini(hex, false);
    case 'mac-studio': return macMini(hex, true);
    case 'display': return display(hex);
    case 'tablet-pro': return tablet(hex, 'pro');
    case 'tablet-air': return tablet(hex, 'air');
    case 'tablet': return tablet(hex, 'base');
    case 'tablet-mini': return tablet(hex, 'mini');
    case 'watch': case 'watch-se': return watch(hex, 'std');
    case 'watch-ultra': return watch(hex, 'ultra');
    case 'airpods': return airpods('std');
    case 'airpods-pro': return airpods('pro');
    case 'airpods-max': return airpodsMax(hex);
    case 'homepod-mini': return homepodMini(hex);
    case 'homepod': return homepod(hex);
    case 'appletv': return appletv();
    case 'homeview': return homeview(hex);
    case 'vision': return vision();
    default: return accessory(p.render, hex);
  }
}

/* A product visual: draws the vector render immediately, then swaps in the
   real Apple CDN photo for that finish if it loads. */
const _imgOk = new Map();
function visual(p, colorIdx = 0, cls = '') {
  const src = p.imgs && p.imgs[colorIdx];
  return `<div class="visual ${cls}" ${src ? `data-src="${src}"` : ''}>${renderProduct(p, colorIdx)}</div>`;
}
function hydrateVisuals(root = document) {
  root.querySelectorAll('.visual[data-src]').forEach(el => {
    const src = el.dataset.src;
    el.removeAttribute('data-src');
    const swap = () => { el.innerHTML = `<img src="${src}" alt="" loading="lazy" referrerpolicy="no-referrer">`; el.classList.add('photo'); };
    if (_imgOk.get(src) === true) return swap();
    if (_imgOk.get(src) === false) return;
    const im = new Image();
    im.referrerPolicy = 'no-referrer';
    im.onload = () => { const ok = im.naturalWidth > 50; _imgOk.set(src, ok); if (ok && el.isConnected) swap(); };
    im.onerror = () => _imgOk.set(src, false);
    im.src = src;
  });
}
