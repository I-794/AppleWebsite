/* Marketing + store pages. */

const main = () => $('#main');
const pv = (id, ci = 0, cls = '') => visual(byId(id), ci, cls);

/* ---------- Home ---------- */
/* "rvg" = reveal group: the children rise in one after another when the block scrolls into view. */
const onDark = cls => (/\bdark\b/.test(cls) ? 'on-dark' : '');
function heroBlock({ id, cls = '', title, sub, ctas, ci = 0, eyebrow = '', note = '' }) {
  return `<section class="hero rvg ${cls}">
    ${eyebrow ? `<span class="badge-new">${eyebrow}</span>` : ''}
    <h2 class="h-hero">${title}</h2>
    <p class="sub" style="margin-top:6px">${sub}</p>
    <div class="ctas">${ctas}</div>
    ${note ? `<p class="small" style="margin-top:12px">${note}</p>` : ''}
    <div class="stage">${pv(id, ci, onDark(cls))}</div>
  </section>`;
}
function tileBlock({ id, cls = '', title, sub, ctas, ci = 0, eyebrow = '' }) {
  return `<div class="tile rvg ${cls}">
    ${eyebrow ? `<span class="badge-new">${eyebrow}</span>` : ''}
    <h2 class="h-2">${title}</h2>
    <p class="sub-sm">${sub}</p>
    <div class="ctas" style="margin-top:14px">${ctas}</div>
    <div class="stage">${pv(id, ci, onDark(cls))}</div>
  </div>`;
}

/* Swap the product visual inside `el` with a crossfade instead of a hard cut. */
function swapVisual(el, html) {
  $$('.fade-out', el).forEach(o => o.remove());
  const old = el.firstElementChild;
  el.insertAdjacentHTML('beforeend', html);
  const nu = el.lastElementChild;
  hydrateVisuals(el);
  if (!old) return;
  el.classList.add('xfade');
  old.classList.add('fade-out'); nu.classList.add('fade-in');
  setTimeout(() => { old.remove(); nu.classList.remove('fade-in'); if (!$('.fade-out', el)) el.classList.remove('xfade'); }, 460);
}

/* A "+" card grows from its spot on the page into a full sheet, then its text fades in. */
function expandCard(card, d) {
  const r = card.getBoundingClientRect();
  const bg = document.createElement('div');
  bg.className = 'xcard-bg';
  bg.innerHTML = `<div class="xcard ${d.light ? 'light' : ''}" role="dialog" aria-modal="true" style="top:${r.top}px;left:${r.left}px;width:${r.width}px;height:${r.height}px;background:${d.bg}">
    <button class="x" aria-label="Close">&#x2715;</button>
    <div class="xcard-body">${d.eyebrow ? `<p class="eyebrow">${d.eyebrow}</p>` : ''}<h2 class="h-1">${d.title}</h2><p class="body">${d.body}</p>${d.link ? `<a class="btn" href="${d.link}">${d.linkText || 'Learn more'}</a>` : ''}</div>
  </div>`;
  document.body.appendChild(bg);
  document.body.classList.add('no-scroll');
  const x = bg.firstElementChild;
  const place = () => {
    const W = Math.min(980, innerWidth - 40), H = Math.min(innerHeight - 80, 640);
    Object.assign(x.style, { top: (innerHeight - H) / 2 + 'px', left: (innerWidth - W) / 2 + 'px', width: W + 'px', height: H + 'px' });
  };
  requestAnimationFrame(() => requestAnimationFrame(() => { bg.classList.add('open'); x.classList.add('open'); place(); }));
  const close = () => {
    const r2 = card.getBoundingClientRect();
    x.classList.remove('open'); bg.classList.remove('open');
    Object.assign(x.style, { top: r2.top + 'px', left: r2.left + 'px', width: r2.width + 'px', height: r2.height + 'px' });
    document.body.classList.remove('no-scroll');
    window.removeEventListener('resize', place);
    setTimeout(() => bg.remove(), 560);
  };
  bg._close = close;
  window.addEventListener('resize', place);
  bg.addEventListener('click', e => {
    if (e.target.closest('a')) { bg.remove(); document.body.classList.remove('no-scroll'); return; }
    if (e.target === bg || e.target.closest('.x')) close();
  });
}
document.addEventListener('click', e => {
  const c = e.target.closest('[data-expand]');
  if (!c) return;
  e.preventDefault();
  expandCard(c, JSON.parse(decodeURIComponent(c.dataset.expand)));
});
const learnBuy = (id, buy = 'Buy') => `<a class="btn" href="#/p/${id}">Learn more</a><a class="btn ghost" href="#/buy/${id}">${buy}</a>`;

function posterArt(s, i) {
  return `<svg class="art" viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="pa${i}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${s.c1}"/><stop offset="1" stop-color="${shade(s.c1, -.6)}"/></linearGradient></defs>
  <rect width="160" height="90" fill="url(#pa${i})"/>
  <circle cx="${110 + (i * 7) % 30}" cy="${30 + (i * 11) % 30}" r="${26 + i % 3 * 8}" fill="${s.c2}" opacity=".55"/>
  <circle cx="${40 + (i * 13) % 40}" cy="${70 - (i * 5) % 20}" r="${14 + i % 4 * 5}" fill="${s.c2}" opacity=".25"/>
  <rect x="0" y="55" width="160" height="35" fill="url(#pa${i})" opacity=".6"/></svg>`;
}

route(/^\/$/, () => {
  main().innerHTML = `
  <div class="ribbon">Get up to $650 in credit toward iPhone Duo or iPhone 18 Pro when you trade in iPhone 13 or higher.* <a class="more" href="#/trade-in">Shop iPhone</a></div>
  ${heroBlock({ id: 'iphone-duo', cls: 'white', title: 'iPhone Duo', sub: 'Open up to new possibilities.', ctas: learnBuy('iphone-duo'), eyebrow: 'New' })}
  ${heroBlock({ id: 'iphone-18-pro', cls: 'dark', title: 'iPhone 18 Pro', sub: 'The ultimate pro.', ctas: learnBuy('iphone-18-pro'), ci: 3 })}
  ${heroBlock({ id: 'homeview', cls: 'white', title: 'HomeView', sub: 'Your home. In view.', ctas: learnBuy('homeview', 'Pre-order'), note: 'Available November 13', eyebrow: 'New' })}
  <section class="grid-tiles">
    ${tileBlock({ id: 'homepod-mini', cls: 'white', title: 'HomePod mini', sub: 'Big sound. Little glow.', ctas: learnBuy('homepod-mini', 'Pre-order'), ci: 2, eyebrow: 'New · Available October 30' })}
    ${tileBlock({ id: 'apple-tv-4k', cls: 'dark', title: `<span class="logo-word">${appleLogo()}TV 4K</span>`, sub: 'Now with Siri AI and a FaceTime camera.', ctas: learnBuy('apple-tv-4k', 'Pre-order'), eyebrow: 'New' })}
    ${tileBlock({ id: 'watch-series-12', title: `<span class="logo-word">${appleLogo()}WATCH</span>`, sub: 'Series 12', ctas: learnBuy('watch-series-12') })}
    ${tileBlock({ id: 'watch-ultra-4', cls: 'dark', title: `<span class="logo-word">${appleLogo()}WATCH</span>`, sub: 'Ultra 4. Adventure awaits.', ctas: learnBuy('watch-ultra-4') })}
    ${tileBlock({ id: 'airpods-5', cls: 'white', title: 'AirPods 5', sub: 'Iconic. Now supersonic.', ctas: learnBuy('airpods-5'), eyebrow: 'New' })}
    ${tileBlock({ id: 'airpods-pro-3', title: 'AirPods Pro 3', sub: 'The world\'s best in-ear Active Noise Cancellation.', ctas: learnBuy('airpods-pro-3') })}
    ${tileBlock({ id: 'macbook-neo', title: 'MacBook Neo', sub: 'Hello, Neo. From $699.', ctas: learnBuy('macbook-neo'), ci: 0 })}
    ${tileBlock({ id: 'macbook-air', cls: 'white', title: 'MacBook Air', sub: 'Sky blue. Sky high. Now with M5.', ctas: learnBuy('macbook-air') })}
    ${tileBlock({ id: 'ipad-air', cls: 'white', title: 'iPad Air', sub: 'Now supercharged by M4.', ctas: learnBuy('ipad-air'), ci: 1 })}
    <div class="tile rvg" style="background:linear-gradient(160deg,#f5f5f7,#e8f0ff)">
      <h2 class="h-2">Apple Trade In</h2>
      <p class="sub-sm">Get up to $650 in credit when you trade in iPhone 13 or higher.*</p>
      <div class="ctas" style="margin-top:14px"><a class="btn" href="#/trade-in">Get your estimate</a></div>
      <div class="stage" style="gap:0">${pv('iphone-17', 2)}${pv('iphone-18-pro', 2)}</div>
    </div>
    <div class="tile dark rvg" style="background:radial-gradient(circle at 50% 80%,#3a1c71,#000 70%)">
      <h2 class="h-2">Apple Intelligence</h2>
      <p class="sub-sm">Meet the all-new Siri. Built into iOS 27.</p>
      <div class="ctas" style="margin-top:14px"><a class="btn" href="#/info/apple-intelligence">Learn more</a></div>
      <div class="stage"><svg viewBox="0 0 300 300" style="width:260px"><defs><linearGradient id="siri" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff9a3c"/><stop offset=".35" stop-color="#ff3ea5"/><stop offset=".7" stop-color="#7a5cff"/><stop offset="1" stop-color="#22c1ff"/></linearGradient></defs><circle class="siri-ring" cx="150" cy="150" r="110" fill="none" stroke="url(#siri)" stroke-width="16"/><circle class="siri-glow" cx="150" cy="150" r="72" fill="url(#siri)" opacity=".35"/></svg></div>
    </div>
    ${tileBlock({ id: 'vision-pro', cls: 'dark', title: 'Apple Vision Pro', sub: 'Now with M5. You\'ve never seen everything like this.', ctas: learnBuy('vision-pro') })}
  </section>
  <section class="tvplus">
    <div class="wrap" style="display:flex;align-items:center;gap:6px;margin-bottom:24px"><span class="logo-word" style="display:flex;align-items:center;gap:4px;font-size:28px;font-weight:600">${appleLogo()}tv</span></div>
    <div class="track" id="tvtrack">${SHOWS.map((s, i) => `<a class="poster" href="#/entertainment">${posterArt(s, i)}<div><div class="t">${s.title}</div><div class="g">${s.genre} · <b>Stream now</b></div></div><span class="btn white">Watch now</span></a>`).join('')}</div>
    <div class="dots" id="tvdots">${SHOWS.map((_, i) => `<button aria-label="Show ${i + 1}" class="${i ? '' : 'on'}"></button>`).join('')}</div>
  </section>`;
  const track = $('#tvtrack'), dots = $$('#tvdots button');
  let idx = 0;
  const goTo = i => { idx = (i + SHOWS.length) % SHOWS.length; const el = track.children[idx]; track.scrollTo({ left: el.offsetLeft - (track.clientWidth - el.clientWidth) / 2, behavior: 'smooth' }); };
  dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));
  track.addEventListener('scroll', () => {
    const c = track.scrollLeft + track.clientWidth / 2;
    let best = 0, bd = 1e9;
    [...track.children].forEach((el, i) => { const d = Math.abs(el.offsetLeft + el.clientWidth / 2 - c); if (d < bd) { bd = d; best = i; } });
    idx = best; dots.forEach((d, i) => d.classList.toggle('on', i === best));
  }, { passive: true });
  const auto = setInterval(() => { if (!document.body.contains(track)) return clearInterval(auto); if (!track.matches(':hover')) goTo(idx + 1); }, 5000);
  return { title: null, crumb: 'Home' };
});

/* ---------- Category pages ---------- */
/* [eyebrow, title, background, accent, body text shown when the card expands] */
const GET_TO_KNOW = {
  iphone: [
    ['Apple Intelligence', 'Meet the all-new Siri.', '#1a1033', '#ff6ad5', 'Siri understands what is on your screen and takes action across your apps, with personal context that stays private thanks to on-device processing and Private Cloud Compute.'],
    ['Cutting-Edge Cameras', 'Picture your best photos and videos.', '#0b0b0d', '#ffb340', '48MP Fusion cameras capture incredible detail in any light, and Camera Control gets you from pocket to photo in a flash.'],
    ['Chip and Battery Life', 'Fast that lasts.', '#101a2e', '#4cc2ff', 'A20-class chips built on 2-nanometer technology deliver blazing performance and all-day battery life, so iPhone keeps up with everything you do.'],
    ['Innovation', 'Beautiful and durable, by design.', '#2b2b2e', '#d7d7db', 'Grade 5 titanium and Ceramic Shield 2 make iPhone tougher than ever, in a design that feels as good as it looks.'],
    ['Environment', 'Recycled. Reused. Repeat.', '#0e2a1c', '#7ee08b', 'iPhone is made with recycled aluminum, cobalt, and rare earth elements as part of Apple 2030, our plan to be carbon neutral across our entire footprint.'],
    ['Privacy', 'Your data. Just where you want it.', '#0d1b3d', '#6da8ff', 'From Face ID to Mail Privacy Protection, iPhone is designed to keep your personal data on your device and out of anyone else\'s hands.']
  ],
  mac: [
    ['Performance', 'Apple silicon. Built for Apple Intelligence.', '#120d2a', '#a77bff', 'M5 brings a next-generation GPU with a Neural Accelerator in every core, so Apple Intelligence and pro apps run faster than ever on Mac.'],
    ['Mac + iPhone', 'Mirror your iPhone right on your Mac.', '#0b1530', '#4cc2ff', 'iPhone Mirroring lets you see and control your iPhone right from your Mac, and Continuity makes handing off work between devices feel like magic.'],
    ['Compatibility', 'Your favorite apps run beautifully.', '#2a1410', '#ff8c5a', 'Microsoft 365, Adobe Creative Cloud, and thousands of other apps run natively on Apple silicon, right alongside the apps that come built in.'],
    ['macOS 27', 'Smarter, more personal.', '#0b2a2a', '#59e3d1', 'A smarter Spotlight, Live Translation, and a new Siri that works across your apps make macOS 27 the most personal Mac experience yet.'],
    ['Privacy', 'Privacy is built in.', '#0d1b3d', '#6da8ff', 'Every Mac has hardware-level security built in, from Touch ID to secure boot, and apps must ask before they can access your data.']
  ],
  ipad: [
    ['Productivity', 'Work anywhere, any way.', '#141414', '#ffb340', 'With Stage Manager, Split View, and Magic Keyboard, iPad is a laptop when you need one and a tablet when you don\'t.'],
    ['Creativity', 'Draw, design, and edit with Apple Pencil.', '#2a0f2c', '#ff6ad5', 'Apple Pencil Pro responds to squeeze, roll, and hover, so sketching, painting, and markup feel completely natural.'],
    ['Learning', 'A world of learning in your hands.', '#0b2a1a', '#7ee08b', 'Interactive textbooks, Freeform, and built-in accessibility features make iPad the perfect companion for every kind of learner.'],
    ['iPadOS 27', 'Powerful new windowing.', '#0b1530', '#4cc2ff', 'Resizable windows, a menu bar, and new multitasking gestures make iPadOS 27 feel more powerful than ever.']
  ],
  watch: [
    ['Health', 'Hypertension notifications and Sleep Score.', '#2a0d12', '#ff5a6a', 'Hypertension notifications, Sleep Score, and Vitals keep you informed about your body around the clock.'],
    ['Fitness', 'Workout Buddy, powered by Apple Intelligence.', '#0f2a0b', '#a5ff4c', 'Workout Buddy uses Apple Intelligence to give you real-time encouragement based on your own fitness history.'],
    ['Safety', 'Crash and Fall Detection.', '#2a1a0b', '#ffb340', 'Crash Detection, Fall Detection, and Emergency SOS can call for help even when you can\'t reach your phone.'],
    ['Connectivity', '5G and satellite on Ultra 4.', '#0b1530', '#4cc2ff', 'Ultra 4 adds satellite connectivity, so you can send messages and share your location even with no cell service.']
  ],
  airpods: [
    ['Live Translation', 'Understand more languages, hands-free.', '#0b1530', '#4cc2ff', 'AirPods translate conversations in real time, so you can understand and be understood across languages.'],
    ['Hearing Health', 'Hearing Test and Hearing Aid features.', '#0f2a1c', '#7ee08b', 'Take a clinically validated Hearing Test, then turn AirPods Pro into a hearing aid with a tap.'],
    ['Spatial Audio', 'Sound all around you.', '#1a1033', '#c38bff', 'Personalized Spatial Audio with dynamic head tracking puts you right in the middle of the music.']
  ],
  'tv-home': [
    ['Siri AI at home', 'Ask about anything happening at home.', '#1a1033', '#ff6ad5', 'Ask Siri who is at the door, whether the garage is closed, or what is playing in the kitchen, and get an answer instantly.'],
    ['Home Collection', 'New smart home accessories, starting in December.', '#2a2010', '#ffcf5a', 'A new family of smart home accessories, from thermostats to cameras, arrives starting in December.'],
    ['Apple TV app', 'Every show and movie, in one place.', '#0b0b0d', '#ffffff', 'Every show, movie, and live sports event, all in one app, across every Apple device and your TV.']
  ],
  vision: [
    ['Entertainment', 'Your own private theater.', '#0b0b0d', '#4cc2ff', 'Watch movies on a screen that feels 100 feet wide, with Spatial Audio that surrounds you.'],
    ['Productivity', 'An infinite canvas for your apps.', '#141414', '#d7d7db', 'Place your apps anywhere in your space and work at any scale, from a single Mac display to a wall of windows.'],
    ['Spatial Photos', 'Relive your memories.', '#2a1410', '#ff8c5a', 'Relive your memories at life-size scale, with spatial photos and videos captured on iPhone or Apple Vision Pro.']
  ],
  accessories: [
    ['MagSafe', 'Snap on and charge fast.', '#141414', '#ff8c5a', 'Snap on a case, wallet, or charger with perfectly aligned magnets, and charge at up to 25W.'],
    ['Engraving', 'Make it personal. Free.', '#0b1530', '#4cc2ff', 'Add names, initials, emoji, or numbers to AirPods, iPad, Apple Pencil, and AirTag for free.']
  ]
};
/* [title, one-liner, icon, body text shown when the card expands] */
const WHY = [
  ['Free delivery', 'And free returns within 14 days.', '&#x1F69A;', 'Get free delivery on every order, or pick up at an Apple Store. Returns are free within 14 days of delivery.'],
  ['Apple Trade In', 'Get credit toward a new device.', '&#x267B;', 'Trade in your eligible device and get credit toward your next purchase, or recycle it for free.'],
  ['Pay monthly at 0% APR', 'With Apple Card Monthly Installments.', '&#x1F4B3;', 'Apple Card Monthly Installments split your purchase into interest-free payments, with 3% Daily Cash back.'],
  ['Personal Setup', 'Online sessions with a Specialist.', '&#x1F4AC;', 'Book a free online session and a Specialist will walk you through setting up your new device.'],
  ['Shop live with a Specialist', 'Get advice from an expert.', '&#x1F465;', 'Chat or video call with a Specialist for personalized advice before you buy.'],
  ['Engraving', 'Free on select products.', '&#x270E;', 'Personalize AirPods, iPad, Apple Pencil, and AirTag with free engraving.']
];
const expandAttr = d => `data-expand="${encodeURIComponent(JSON.stringify(d))}"`;

function chapterNav(cat) {
  return `<nav class="chapternav"><ul>${byCat(cat).map(p => `<li><a href="#/p/${p.id}"><span class="ic">${visual(p, 0)}</span>${p.name}${p.isNew ? '<span class="new">New</span>' : ''}</a></li>`).join('')}
  ${cat !== 'accessories' && cat !== 'vision' ? `<li><a href="#/compare/${cat}"><span class="ic"><svg viewBox="0 0 54 54" width="54"><rect x="8" y="12" width="16" height="30" rx="4" fill="none" stroke="#1d1d1f" stroke-width="2"/><rect x="30" y="12" width="16" height="30" rx="4" fill="none" stroke="#1d1d1f" stroke-width="2"/></svg></span>Compare</a></li>` : ''}
  <li><a href="#/accessories"><span class="ic">${pv('magsafe-charger')}</span>Accessories</a></li><li><a href="#/store"><span class="ic">${ICON_BAG.replace('viewBox="0 0 14 44"', 'viewBox="0 12 14 18" width="40"')}</span>Shop ${CATEGORIES[cat].name}</a></li></ul></nav>`;
}
function lineupCard(p) {
  return `<div class="lineup-card reveal">
    <a href="#/p/${p.id}" style="width:100%;display:grid;place-items:center">${visual(p, 0)}</a>
    <div class="swatches">${p.colors.map(c => `<span class="swatch" title="${c.name}" style="background:${c.hex}"></span>`).join('')}</div>
    ${p.isNew ? '<span class="badge-new">New</span>' : ''}
    <h3 class="h-3">${p.name}</h3>
    <p class="tag">${p.tagline}</p>
    <p class="price">${fromPrice(p)}</p>
    <div class="ctas">${p.category === 'accessories' ? `<a class="btn" href="#/buy/${p.id}">Buy</a>` : `<a class="btn" href="#/p/${p.id}">Learn more</a><a class="more" href="#/buy/${p.id}">Buy</a>`}</div>
  </div>`;
}
function featureCards(list) {
  return `<div class="scroller">${list.map(([eb, t, bg, ac, body]) => { const grad = `radial-gradient(circle at 70% 85%,${ac}55,${bg} 60%)`; return `<a class="card feature" href="#/info/apple-intelligence" style="background:${grad}" ${expandAttr({ eyebrow: eb, title: t, body, bg: grad })}><p class="eyebrow">${eb}</p><h3 class="h-3">${t}</h3>
    <div class="visual"><svg viewBox="0 0 300 300"><circle cx="150" cy="170" r="${90}" fill="${ac}" opacity=".22"/><circle cx="150" cy="170" r="54" fill="${ac}" opacity=".5"/></svg></div><span class="plus">+</span></a>`; }).join('')}</div>`;
}
function whyCards() {
  return `<div class="scroller">${WHY.map(([t, d, ic, body]) => { const link = `#/info/${t.toLowerCase().replace(/[^a-z]+/g, '-')}`; return `<a class="card info" href="${link}" ${expandAttr({ title: t, body, bg: '#fff', light: true, link })}><div class="ic">${ic}</div><p class="ptitle">${t}</p><p class="muted" style="margin-top:8px">${d}</p><span class="plus" style="background:#e8e8ed;color:#1d1d1f">+</span></a>`; }).join('')}</div>`;
}

['mac', 'ipad', 'iphone', 'watch', 'vision', 'airpods', 'tv-home', 'accessories'].forEach(cat => {
  route(new RegExp(`^/${cat}$`), () => {
    const C = CATEGORIES[cat];
    const items = byCat(cat);
    main().innerHTML = `${chapterNav(cat)}
    <div class="wrap-wide"><div class="cat-head"><h1 class="h-hero">${C.title}</h1><p class="sub">${C.hero}</p></div></div>
    <section class="section" style="padding-top:20px"><div class="wrap-wide">
      <div class="section-title"><h2 class="h-1">${cat === 'accessories' ? 'Shop accessories.' : 'Explore the lineup.'}</h2>${cat !== 'accessories' && cat !== 'vision' ? `<a class="more" href="#/compare/${cat}">Compare all models</a>` : ''}</div>
      <div class="lineup">${items.map(lineupCard).join('')}</div></div></section>
    ${GET_TO_KNOW[cat] ? `<section class="section gray"><div class="wrap-wide"><h2 class="h-1">Get to know ${C.title}.</h2></div>${featureCards(GET_TO_KNOW[cat])}</section>` : ''}
    <section class="section"><div class="wrap-wide"><h2 class="h-1">Why Apple is the best place to buy ${C.title}.</h2><div class="ctas" style="justify-content:flex-start"><a class="more" href="#/store">Shop ${C.title}</a></div></div>${whyCards()}</section>
    ${cat !== 'accessories' ? `<section class="section gray"><div class="wrap-wide"><h2 class="h-1">${C.title} essentials.</h2></div><div class="scroller">${byCat('accessories').slice(0, 6).map(p => productCard(p)).join('')}</div></section>` : ''}`;
    return { title: C.title, crumb: C.title };
  });
});

function productCard(p, cls = '') {
  return `<a class="card tall light ${cls}" href="#/buy/${p.id}">${p.isNew ? '<p class="new">New</p>' : ''}<p class="ptitle">${p.name}</p><p class="pprice">${p.category === 'accessories' ? money(p.price) : fromPrice(p)}</p>${visual(p, 0)}<div class="swatches" style="margin:10px 0 0">${p.colors.length > 1 ? p.colors.map(c => `<span class="swatch" style="background:${c.hex}"></span>`).join('') : ''}</div></a>`;
}

/* ---------- Product marketing page ---------- */
route(/^\/p\/([\w-]+)$/, id => {
  const p = byId(id);
  if (!p) return notFound();
  if (p.category === 'accessories') { go('/buy/' + id); return {}; }
  const dark = ['iphone-18-pro', 'macbook-pro', 'vision-pro', 'watch-ultra-4', 'apple-tv-4k'].includes(id);
  main().innerHTML = `
  <nav class="localnav ${dark ? 'dark' : ''}"><div class="wrap"><a class="title" href="#/p/${id}">${p.name}</a>
    <div class="menu"><a href="#/p/${id}">Overview</a><a href="#specs">Tech Specs</a>${['iphone', 'mac', 'ipad', 'watch'].includes(p.category) ? `<a href="#/compare/${p.category}">Compare</a>` : ''}<a class="btn" href="#/buy/${id}">Buy</a></div></div></nav>
  <section class="p-hero ${dark ? 'dark' : ''}">
    <div class="wrap rvg">${p.isNew ? '<span class="badge-new">New</span>' : ''}<h1 class="h-hero">${p.name}</h1><p class="sub" style="margin-top:8px">${p.tagline}</p>
    <p class="price-line">${fromPrice(p)}</p>
    <div class="ctas"><a class="btn lg" href="#/buy/${id}">Buy</a>${p.category === 'iphone' ? '<a class="btn ghost lg" href="#/trade-in">Trade in</a>' : ''}</div></div>
    ${visual(p, Math.min(p.colors.length - 1, dark ? p.colors.length - 1 : 0), `reveal scale ${dark ? 'on-dark' : ''}`)}
    <div class="wrap" style="padding:60px 22px 90px"><h2 class="h-2 reveal" style="max-width:720px;margin:0 auto">${p.headline}</h2></div>
  </section>
  <section class="section ${dark ? 'dark' : 'gray'}"><div class="wrap"><h2 class="h-1 reveal" style="margin-bottom:50px">Get the highlights.</h2>
    <div class="highlights">${(p.highlights || []).map(h => `<div class="reveal"><div class="k">${h.k}</div><p class="v">${h.v}</p></div>`).join('')}</div>
    ${p.colors.length > 1 ? `<div style="margin-top:70px" class="reveal"><p class="h-4" style="margin-bottom:20px">Available in ${p.colors.length} finishes.</p><div class="color-row" id="pcolors">${p.colors.map((c, i) => `<button class="color-btn ${i ? '' : 'on'}" data-i="${i}" title="${c.name}" style="background:${c.hex}"></button>`).join('')}</div><p class="color-name" id="pcname">${p.colors[0].name}</p><div id="pcvis" style="max-width:520px;margin:30px auto 0">${visual(p, 0)}</div></div>` : ''}
  </div></section>
  ${(p.features || []).map((f, i) => `<section class="feature-block ${f.dark ? 'dark' : ''}"><div class="wrap"><p class="eyebrow reveal">${f.eyebrow}</p><h2 class="h-1 reveal">${f.title}</h2><p class="body reveal">${f.text}</p>${i % 2 === 0 ? `<div class="reveal scale">${visual(p, (i + 1) % p.colors.length, f.dark ? 'on-dark' : '')}</div>` : ''}</div></section>`).join('')}
  <section class="section" id="specs"><div class="wrap"><h2 class="h-1" style="margin-bottom:40px">Tech Specs</h2>
    <div class="specs-table">${Object.entries(p.specs || {}).map(([k, v]) => `<div>${k}</div><div>${v}</div>`).join('')}<div>Colors</div><div>${p.colors.map(c => c.name).join(', ')}</div><div>Price</div><div>${fromPrice(p)}</div></div>
  </div></section>
  <section class="section gray center"><div class="wrap"><h2 class="h-1">Buy ${p.name}.</h2><p class="sub-sm muted" style="margin-top:10px">${fromPrice(p)}</p><div class="ctas"><a class="btn lg" href="#/buy/${id}">Buy</a>${['iphone', 'mac', 'ipad', 'watch'].includes(p.category) ? `<a class="btn ghost lg" href="#/compare/${p.category}">Compare models</a>` : ''}</div></div></section>`;
  $('a[href="#specs"]')?.addEventListener('click', e => { e.preventDefault(); $('#specs').scrollIntoView({ behavior: 'smooth' }); });
  $$('#pcolors .color-btn').forEach(b => b.addEventListener('click', () => {
    $$('#pcolors .color-btn').forEach(x => x.classList.remove('on')); b.classList.add('on');
    const i = +b.dataset.i; $('#pcname').textContent = p.colors[i].name;
    swapVisual($('#pcvis'), visual(p, i));
  }));
  return { title: p.name, dark, crumb: `${CATEGORIES[p.category].name} › ${p.name}` };
});

/* ---------- Buy / configurator ---------- */
route(/^\/buy\/([\w-]+)$/, id => {
  const p = byId(id);
  if (!p) return notFound();
  const steps = [];
  const modelOpt = p.options.find(o => o.key === 'model');
  if (modelOpt) steps.push(modelOpt);
  if (p.colors.length > 1) steps.push({ key: 'color', label: 'Finish.', sub: 'Pick your favorite.', color: true });
  p.options.filter(o => o.key !== 'model' && o.key !== 'applecare').forEach(o => steps.push(o));
  if (p.category === 'iphone') steps.push({ key: 'tradein', label: 'Apple Trade In.', sub: 'Get credit toward iPhone.', tradein: true });
  const ac = p.options.find(o => o.key === 'applecare');
  if (ac) steps.push(ac);

  const sel = {};
  if (p.colors.length === 1) sel.color = 0;
  let engraving = '', trade = null;

  const priceNow = () => {
    let unit = p.price;
    p.options.forEach(o => { if (o.key !== 'applecare' && sel[o.key] != null) unit += o.choices.find(c => c.id === sel[o.key]).price; });
    const acc = sel.applecare === 'ac' ? ac.choices[0] : null;
    return { unit, ac: acc };
  };
  const done = () => steps.every(s => s.color ? sel.color != null : s.tradein ? sel.tradein != null && (sel.tradein === 'no' || trade) : sel[s.key] != null) && (sel.engrave !== 'yes' || engraving.trim());
  const nextIdx = () => steps.findIndex(s => s.color ? sel.color == null : s.tradein ? sel.tradein == null : sel[s.key] == null);

  const ship = new Date(Date.now() + 2 * 864e5).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  main().innerHTML = `<div class="wrap-wide" style="max-width:1260px">
    <div class="buy-head"><div>${p.isNew ? '<span class="badge-new">New</span>' : ''}<h1 class="h-1">Buy ${p.name}</h1><p class="muted" style="margin-top:6px">${fromPrice(p)}</p></div>
      <div class="small" style="text-align:right">Get 3% Daily Cash with Apple Card<br><a href="#/info/apple-card">Learn more</a></div></div>
    <div class="buy-grid">
      <div class="buy-gallery"><div id="bvis">${visual(p, sel.color ?? 0)}</div><p class="cap" id="bcap"></p></div>
      <div id="opts"></div>
    </div></div>
    <div class="summary-bar"><div class="wrap" style="max-width:1260px">
      <div class="delivery-info"><div><b>Delivery:</b>In stock · Ships by ${ship} · Free</div><div><b>Pickup:</b><a href="#/stores">Check availability</a></div></div>
      <div style="display:flex;align-items:center;gap:24px"><div style="text-align:right"><div class="total" id="btotal"></div><div class="monthly" id="bmonthly"></div></div><button class="btn lg" id="addbag" disabled>Add to Bag</button></div>
    </div></div>`;

  let wasLocked = null;
  const renderOpts = () => {
    const ni = nextIdx();
    const lockedNow = steps.map((s, i) => ni !== -1 && i > ni);
    $('#opts').innerHTML = steps.map((s, i) => {
      const locked = lockedNow[i];
      let body = '';
      if (s.color) {
        body = `<p class="color-name" style="margin-bottom:14px">${sel.color != null ? p.colors[sel.color].name : 'Select a finish'}</p><div class="color-row">${p.colors.map((c, ci) => `<button class="color-btn ${sel.color === ci ? 'on' : ''}" data-color="${ci}" aria-label="${c.name}" title="${c.name}" style="background:linear-gradient(135deg,${shade(c.hex, .15)},${c.hex} 50%,${c.dark || shade(c.hex, -.2)})"></button>`).join('')}</div>`;
      } else if (s.tradein) {
        body = `<button class="choice ${sel.tradein === 'yes' ? 'on' : ''}" data-k="tradein" data-v="yes"><span><span class="l">Select a smartphone</span><span class="d" style="display:block">Answer a few questions to get your estimate.</span></span></button>
          <button class="choice ${sel.tradein === 'no' ? 'on' : ''}" data-k="tradein" data-v="no"><span class="l">No trade-in</span></button>
          ${sel.tradein === 'yes' ? `<div class="tradein-box ${trade ? '' : 'slide-open'}"><div class="field"><select id="tdev"><option value="">Choose your model</option>${TRADE_IN.map(t => `<option value="${t.id}" ${trade && trade.id === t.id ? 'selected' : ''}>${t.name}</option>`).join('')}</select><label>Smartphone</label></div>
          <label class="checkbox"><input type="checkbox" id="tgood" ${!trade || trade.good ? 'checked' : ''}> It turns on and is in good condition</label>
          ${trade ? `<p><b>Estimated credit: ${money(trade.value, false)}</b></p><p class="small">Applied to your total at checkout.</p>` : ''}</div>` : ''}`;
      } else {
        body = s.choices.map(c => `<button class="choice ${sel[s.key] === c.id ? 'on' : ''}" data-k="${s.key}" data-v="${c.id}"><span><span class="l">${c.label}</span>${c.desc ? `<span class="d" style="display:block">${c.desc}</span>` : ''}</span><span class="r">${s.key === 'applecare' ? (c.price ? `${money(c.price)}<br>or ${money(c.monthly)}/mo.` : '') : c.price ? `+ ${money(c.price, false)}` : s.key === 'model' || s.key === 'storage' ? `From ${money(p.price + c.price, false)}` : ''}</span></button>`).join('');
        if (s.engraving && sel.engrave === 'yes') body += `<div class="field engrave-input ${engraving ? '' : 'slide-open'}"><input id="engr" maxlength="20" placeholder=" " value="${esc(engraving)}"><label>Engraving text (up to 20 characters)</label></div>`;
      }
      // A step that just unlocked slides open, like the next question appearing on apple.com.
      const unlock = wasLocked && wasLocked[i] && !locked;
      return `<div class="opt ${locked ? 'locked' : ''} ${unlock ? 'unlock' : ''}"><h3>${s.label} <span>${s.sub || ''}</span></h3>${body}</div>`;
    }).join('');
    wasLocked = lockedNow;
    const { unit, ac: acc } = priceNow();
    const total = unit + (acc ? acc.price : 0) - (trade ? trade.value : 0);
    $('#btotal').textContent = money(total);
    const term = p.monthlyTerm || 24;
    $('#bmonthly').textContent = `or ${money(Math.max(0, total) / term)}/mo. for ${term} mo.`;
    $('#addbag').disabled = !done();
    const cfg = describe();
    $('#bcap').textContent = cfg;
  };
  const describe = () => [sel.color != null && p.colors.length > 1 ? p.colors[sel.color].name : null, ...p.options.filter(o => o.key !== 'applecare' && o.key !== 'engrave' && sel[o.key]).map(o => o.choices.find(c => c.id === sel[o.key]).label)].filter(Boolean).join(' · ');

  $('#opts').addEventListener('click', e => {
    const cb = e.target.closest('[data-color]');
    if (cb) {
      sel.color = +cb.dataset.color;
      swapVisual($('#bvis'), visual(p, sel.color));
      return renderOpts();
    }
    const ch = e.target.closest('.choice');
    if (ch) {
      sel[ch.dataset.k] = ch.dataset.v;
      if (ch.dataset.k === 'tradein' && ch.dataset.v === 'no') trade = null;
      renderOpts();
    }
  });
  $('#opts').addEventListener('input', e => {
    if (e.target.id === 'engr') { engraving = e.target.value; $('#addbag').disabled = !done(); }
  });
  $('#opts').addEventListener('change', e => {
    if (e.target.id === 'tdev' || e.target.id === 'tgood') {
      const t = TRADE_IN.find(x => x.id === $('#tdev').value);
      const good = $('#tgood').checked;
      trade = t ? { id: t.id, name: t.name, good, value: good ? t.value : Math.round(t.value * .4) } : null;
      renderOpts();
    }
  });
  $('#addbag').addEventListener('click', () => {
    if (!done()) return;
    const { unit, ac: acc } = priceNow();
    const cfg = describe();
    const item = {
      id: p.id, name: p.name + (modelOpt && sel.model ? '' : ''), color: sel.color ?? 0,
      model: modelOpt ? modelOpt.choices.find(c => c.id === sel.model).label : p.name,
      cfg, unit, qty: 1, engraving: sel.engrave === 'yes' ? engraving.trim() : '',
      ac: acc ? { name: acc.label, price: acc.price } : null,
      tradeIn: trade, sig: `${p.id}|${sel.color}|${JSON.stringify(sel)}|${engraving}|${trade ? trade.id : ''}`
    };
    if (modelOpt) item.name = item.model;
    Bag.add(item);
    showAdded(item, $('#addbag'));
  });
  renderOpts();
  return { title: `Buy ${p.name}`, crumb: `Store › ${p.name}` };
});

function showAdded(item, fromBtn) {
  const p = byId(item.id);
  const recs = byCat('accessories').filter(a => a.id !== p.id).slice(0, 3);
  modal(`<div class="center"><div style="width:180px;margin:0 auto">${visual(p, item.color)}</div>
    <h2 class="h-3" style="margin-top:14px">${esc(item.name)} has been added to your bag.</h2><p class="muted" style="margin-top:6px">${esc(item.cfg)}</p>
    <div class="ctas" style="margin-top:22px"><a class="btn lg" href="#/bag">Review Bag</a><button class="btn ghost lg" data-close>Continue Shopping</button></div>
    <p class="h-4" style="margin-top:34px">Complete your setup</p><div style="display:flex;gap:12px;justify-content:center;margin-top:14px">${recs.map(r => `<a href="#/buy/${r.id}" style="width:120px;font-size:12px;color:var(--text)">${visual(r, 0)}<div>${esc(r.name)}</div><div class="muted">${money(r.price)}</div></a>`).join('')}</div></div>`, (m, close) => {
    hydrateVisuals(m);
    m.addEventListener('click', e => { if (e.target.closest('[data-close]') || e.target.closest('a')) close(); });
  }, { from: fromBtn });
}

/* ---------- Store ---------- */
route(/^\/store$/, () => {
  const user = store.get('user', null);
  const cats = [['Mac', 'macbook-air', 'mac'], ['iPhone', 'iphone-18-pro', 'iphone'], ['iPad', 'ipad-pro', 'ipad'], ['Apple Watch', 'watch-series-12', 'watch'], ['Apple Vision Pro', 'vision-pro', 'vision'], ['AirPods', 'airpods-pro-3', 'airpods'], ['AirTag', 'airtag', 'p/airtag'], ['Apple TV 4K', 'apple-tv-4k', 'p/apple-tv-4k'], ['HomePod', 'homepod-mini', 'p/homepod-mini'], ['Accessories', 'magsafe-charger', 'accessories'], ['Apple Gift Card', 'airtag', 'info/gift-cards']];
  const latest = ['iphone-duo', 'iphone-18-pro', 'homeview', 'homepod-mini', 'apple-tv-4k', 'watch-series-12', 'watch-ultra-4', 'airpods-5', 'macbook-neo', 'ipad-air'].map(byId);
  main().innerHTML = `<div class="wrap-wide" style="max-width:1260px"><div class="store-head"><h1 class="h-hero">Store. <span>The best way to buy the products you love.</span></h1>
    <div class="side"><b>Need shopping help?</b><br><a class="more" href="#/support">Ask a Specialist</a><br><br><b>Visit an Apple Store</b><br><a class="more" href="#/stores">Find one near you</a></div></div></div>
    <div class="store-cats">${cats.map(([n, id, href]) => `<a href="#/${href}"><span class="ic">${pv(id)}</span>${n}</a>`).join('')}</div>
    <div class="wrap-wide" style="max-width:1260px"><p class="store-sec-title">The latest. <span>Take a look at what's new right now.</span></p></div>
    <div class="scroller">${latest.map(p => productCard(p)).join('')}</div>
    <div class="wrap-wide" style="max-width:1260px"><p class="store-sec-title">Help is here. <span>Whenever and however you need it.</span></p></div>
    ${whyCards()}
    <div class="wrap-wide" style="max-width:1260px"><p class="store-sec-title">Accessories. <span>Essentials that pair perfectly with your favorite devices.</span></p></div>
    <div class="scroller">${byCat('accessories').map(p => productCard(p)).join('')}</div>
    <div class="wrap-wide" style="max-width:1260px"><p class="store-sec-title">Loud and clear. <span>Unparalleled choices for rich, high-quality sound.</span></p></div>
    <div class="scroller">${byCat('airpods').concat(byCat('tv-home')).map(p => productCard(p)).join('')}</div>
    <div class="wrap-wide" style="max-width:1260px"><p class="store-sec-title">Special stores. <span>Exclusive savings for businesses, education, and more.</span></p></div>
    <div class="scroller">${[['Education', 'Save on a new Mac or iPad with education pricing.', '#0b1530'], ['Business', 'From enterprise to small business, we can help.', '#141414'], ['Certified Refurbished', 'Like new, with a one-year warranty.', '#0f2a1c']].map(([t, d, bg]) => `<a class="card feature" style="height:420px;background:${bg}" href="#/info/${t.toLowerCase().replace(/ /g, '-')}"><h3 class="h-3">${t}</h3><p style="margin-top:10px;opacity:.85">${d}</p><span class="plus">+</span></a>`).join('')}</div>
    ${user ? '' : '<div class="wrap center" style="padding:20px 22px 70px"><a class="btn ghost" href="#/account">Sign in for the best experience</a></div>'}`;
  return { title: 'Store', crumb: 'Store' };
});

/* ---------- Entertainment ---------- */
const SERVICES = [
  ['Apple One', 'Bundle up to six Apple services. And enjoy more for less.', 19.95, 'linear-gradient(135deg,#ff375f,#5e5ce6)'],
  ['Apple TV', 'Award-winning series, compelling dramas, and more.', 12.99, '#000'],
  ['Apple Music', 'Over 100 million songs. Ad-free.', 10.99, 'linear-gradient(135deg,#fa2d48,#fb5c74)'],
  ['Apple Arcade', 'Play 200+ games. No ads or in-app purchases.', 6.99, 'linear-gradient(135deg,#ff2d55,#ff9500)'],
  ['Apple Fitness+', 'Workouts and meditations for everyone.', 9.99, 'linear-gradient(135deg,#a4e534,#1db954)'],
  ['Apple News+', 'Hundreds of magazines and top newspapers.', 12.99, 'linear-gradient(135deg,#fa2d48,#c41e3a)'],
  ['iCloud+', 'Plenty of storage and premium features.', 0.99, 'linear-gradient(135deg,#3a9bff,#0a60ff)'],
  ['Apple Podcasts', 'Millions of free shows.', 0, 'linear-gradient(135deg,#b14bff,#7a1fcf)']
];
route(/^\/entertainment$/, () => {
  const subs = store.get('subs', []);
  main().innerHTML = `<section class="hero dark rvg" style="min-height:420px;padding-bottom:60px"><h1 class="h-hero">Entertainment</h1><p class="sub" style="margin-top:8px">All your entertainment.<br>All in one place.</p><div class="ctas"><button class="btn lg" data-sub="Apple One">Try Apple One free</button></div></section>
  <section class="tvplus" style="padding-top:20px"><div class="track">${SHOWS.map((s, i) => `<div class="poster">${posterArt(s, i)}<div><div class="t">${s.title}</div><div class="g">${s.genre}</div></div><button class="btn white" data-sub="Apple TV">Stream now</button></div>`).join('')}</div></section>
  <section class="section gray"><div class="wrap-wide" style="max-width:1260px"><h2 class="h-1" style="margin-bottom:30px">Explore the services.</h2>
  <div class="svc-grid">${SERVICES.map(([n, d, pr, bg]) => `<div class="svc" style="background:${bg}"><h3 class="h-3">${appleLogo('inline')} ${n.replace('Apple ', '')}</h3><p style="opacity:.9">${d}</p><p style="margin:16px 0 20px;font-weight:600">${pr ? `${money(pr)}/mo.` : 'Free'}${pr ? ' after free trial' : ''}</p>
  ${subs.includes(n) ? `<button class="btn white" data-cancel="${n}">Subscribed &#x2713; · Cancel</button>` : `<button class="btn white" data-sub="${n}">${pr ? 'Try it free' : 'Listen now'}</button>`}</div>`).join('')}</div></div></section>`;
  main().onclick = function h(e) {
    const s = e.target.closest('[data-sub]'), c = e.target.closest('[data-cancel]');
    if (!s && !c) return;
    if (c) { store.set('subs', store.get('subs', []).filter(x => x !== c.dataset.cancel)); toast(`${c.dataset.cancel} subscription canceled.`); return navigate(); }
    const name = s.dataset.sub, svc = SERVICES.find(x => x[0] === name);
    modal(`<h2 class="h-3">${name}</h2><p class="muted" style="margin:8px 0 22px">${svc[1]}</p><p>${svc[2] ? `1 month free, then ${money(svc[2])}/month. Cancel anytime.` : 'Free to use.'}</p>
      <div class="field" style="margin-top:20px"><input id="semail" type="email" placeholder=" " value="${esc(store.get('user', {})?.email || '')}"><label>Apple Account email</label><p class="msg">Enter a valid email address.</p></div>
      <button class="btn block" id="sgo">Start ${svc[2] ? 'Free Trial' : ''}</button>`, (m, close) => {
      $('#sgo', m).addEventListener('click', () => {
        const em = $('#semail', m);
        if (!/^\S+@\S+\.\S+$/.test(em.value)) return em.parentElement.classList.add('err');
        const list = store.get('subs', []); if (!list.includes(name)) list.push(name); store.set('subs', list);
        close(); toast(`You're subscribed to ${name}. Enjoy!`); navigate();
      });
    });
  };
  return { title: 'Entertainment', dark: true, crumb: 'Entertainment' };
});

/* ---------- Support ---------- */
const FAQS = [
  ['How do I check my order status?', 'Go to Account › Orders. You will see each order with live status and estimated delivery.'],
  ['What is the return policy?', 'You can return eligible items purchased from Apple within 14 days of delivery for a full refund.'],
  ['How does Apple Trade In work?', 'Select your current device when you buy, answer a few questions, and the credit is applied to your purchase.'],
  ['Can I change or cancel my order?', 'Orders that are still processing can be canceled from the order details page.'],
  ['Which promo codes work?', 'Try STUDENT10 for 10% education savings, APPLE20 for $20 off, or FREESHIP for free express delivery.'],
  ['How do I reset my Apple Account password?', 'Visit Manage Your Apple Account and choose Forgot password.'],
  ['Is my iPhone covered by AppleCare+?', 'Check coverage with your serial number. AppleCare+ can be added within 60 days of purchase.']
];
route(/^\/support$/, () => {
  const tiles = [['iPhone', 'iphone-18-pro'], ['Mac', 'macbook-air'], ['iPad', 'ipad-air'], ['Watch', 'watch-series-12'], ['Vision', 'vision-pro'], ['AirPods', 'airpods-pro-3'], ['TV', 'apple-tv-4k'], ['HomePod', 'homepod-mini']];
  main().innerHTML = `<section class="section center" style="padding-bottom:30px"><div class="wrap"><h1 class="h-hero">Apple Support</h1>
    <div class="support-grid">${tiles.map(([n, id]) => `<a href="#/p/${id}">${pv(id)}${n}</a>`).join('')}</div>
    <div class="support-search"><div class="field"><input id="fq" placeholder=" "><label>Search Support</label></div></div></div></section>
  <section class="section"><div class="wrap"><h2 class="h-2" style="margin-bottom:20px">Popular topics</h2><div class="faq" id="faqs"></div>
    <div class="ctas" style="justify-content:flex-start;margin-top:40px"><button class="btn lg" id="contact">Contact Apple Support</button><a class="btn ghost lg" href="#/stores">Book a Genius Bar appointment</a></div></div></section>`;
  const drawFaq = (q = '') => { $('#faqs').innerHTML = FAQS.filter(f => (f[0] + f[1]).toLowerCase().includes(q.toLowerCase())).map(([t, a]) => `<details><summary>${t}</summary><p>${a}</p></details>`).join('') || '<p class="muted">No results. Try different words.</p>'; };
  drawFaq();
  $('#fq').addEventListener('input', e => drawFaq(e.target.value));
  $('#contact').addEventListener('click', () => modal(`<h2 class="h-3">Contact Apple Support</h2><p class="muted" style="margin:6px 0 20px">Tell us what's going on and we'll get back to you.</p>
    <div class="field"><select id="cprod">${tiles.map(t => `<option>${t[0]}</option>`).join('')}</select><label>Product</label></div>
    <div class="field"><input id="cname" placeholder=" "><label>Name</label><p class="msg">Required.</p></div>
    <div class="field"><input id="cemail" type="email" placeholder=" "><label>Email</label><p class="msg">Enter a valid email.</p></div>
    <div class="field"><input id="cmsg" placeholder=" "><label>Describe the issue</label><p class="msg">Required.</p></div>
    <button class="btn block" id="csend">Submit</button>`, (m, close) => $('#csend', m).addEventListener('click', () => {
      let ok = true;
      [['#cname', v => v.trim()], ['#cemail', v => /^\S+@\S+\.\S+$/.test(v)], ['#cmsg', v => v.trim()]].forEach(([s, t]) => { const f = $(s, m); const good = !!t(f.value); f.parentElement.classList.toggle('err', !good); ok = ok && good; });
      if (ok) { close(); toast(`Case #${Math.floor(1e8 + Math.random() * 9e8)} created. We'll email you soon.`); }
    })));
  return { title: 'Support', crumb: 'Support' };
});

/* ---------- Find a store ---------- */
route(/^\/stores$/, () => {
  main().innerHTML = `<section class="section"><div class="wrap"><h1 class="h-1">Find a Store</h1><p class="sub-sm muted" style="margin:10px 0 30px">Shop, get support, or join a free session at Today at Apple.</p>
    <div class="field"><input id="sz" placeholder=" "><label>Search by ZIP code, city, or store name</label></div><div class="store-list" id="sl"></div></div></section>`;
  const draw = (q = '') => {
    const list = STORES.filter(s => `${s.name} ${s.city} ${s.zip}`.toLowerCase().includes(q.toLowerCase()));
    $('#sl').innerHTML = list.map(s => `<div class="st"><div><p class="h-4">${s.name}</p><p class="muted">${s.addr}, ${s.city} ${s.zip}</p><p class="small" style="color:var(--green);margin-top:4px">Open today · 10:00 a.m. – 8:00 p.m.</p></div><div style="display:flex;flex-direction:column;gap:8px;align-items:flex-end"><button class="btn" data-book="${s.id}">Genius Bar</button><a class="more" href="#/info/today-at-apple">Today at Apple</a></div></div>`).join('') || '<p class="muted" style="padding:20px 0">No stores found.</p>';
  };
  draw();
  $('#sz').addEventListener('input', e => draw(e.target.value));
  $('#sl').addEventListener('click', e => {
    const b = e.target.closest('[data-book]'); if (!b) return;
    const s = STORES.find(x => x.id === b.dataset.book);
    const days = [1, 2, 3].map(d => new Date(Date.now() + d * 864e5));
    modal(`<h2 class="h-3">Genius Bar at ${s.name}</h2><p class="muted" style="margin:6px 0 20px">Choose a time.</p>
      <div class="field"><select id="gday">${days.map(d => `<option>${d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</option>`).join('')}</select><label>Day</label></div>
      <div class="field"><select id="gtime">${['10:00 a.m.', '11:30 a.m.', '1:15 p.m.', '3:40 p.m.', '5:20 p.m.'].map(t => `<option>${t}</option>`).join('')}</select><label>Time</label></div>
      <div class="field"><input id="gname" placeholder=" "><label>Your name</label><p class="msg">Required.</p></div>
      <button class="btn block" id="gok">Reserve</button>`, (m, close) => $('#gok', m).addEventListener('click', () => {
        if (!$('#gname', m).value.trim()) return $('#gname', m).parentElement.classList.add('err');
        close(); toast(`Reserved: ${$('#gday', m).value}, ${$('#gtime', m).value}.`);
      }));
  });
  return { title: 'Find a Store', crumb: 'Find a Store' };
});

/* ---------- Trade In ---------- */
route(/^\/trade-in$/, () => {
  main().innerHTML = `<section class="hero white rvg" style="min-height:auto;padding-bottom:60px"><h1 class="h-hero">Apple Trade In</h1><p class="sub" style="margin-top:8px">Get credit toward your next Apple device.*</p></section>
  <section class="section gray"><div class="wrap" style="max-width:680px"><h2 class="h-3" style="margin-bottom:22px">Get your estimate.</h2>
    <div class="field"><select id="tid"><option value="">Choose a device</option>${TRADE_IN.map(t => `<option value="${t.id}">${t.name}</option>`).join('')}</select><label>Device</label></div>
    <label class="checkbox"><input type="checkbox" id="tg" checked> It's in good condition and turns on</label>
    <div id="tres" style="margin-top:20px"></div></div></section>
  <section class="section"><div class="wrap"><h2 class="h-2" style="margin-bottom:30px">Trade-in values</h2><div class="specs-table">${TRADE_IN.map(t => `<div>${t.name}</div><div>Up to ${money(t.value, false)}</div>`).join('')}</div></div></section>`;
  const upd = () => {
    const t = TRADE_IN.find(x => x.id === $('#tid').value);
    $('#tres').innerHTML = t ? `<p class="h-2">${money($('#tg').checked ? t.value : Math.round(t.value * .4), false)}</p><p class="muted">Estimated trade-in value. Apply it when you buy a new iPhone.</p><div class="ctas" style="justify-content:flex-start"><a class="btn" href="#/buy/iphone-18-pro">Buy iPhone 18 Pro</a><a class="btn ghost" href="#/buy/iphone-duo">Buy iPhone Duo</a></div>` : '';
  };
  $('#tid').addEventListener('change', upd); $('#tg').addEventListener('change', upd);
  return { title: 'Apple Trade In', crumb: 'Apple Trade In' };
});

/* ---------- Compare ---------- */
route(/^\/compare\/([\w-]+)$/, cat => {
  const items = byCat(cat);
  if (!items.length) return notFound();
  let picks = items.slice(0, 3).map(p => p.id);
  const draw = () => {
    const ps = picks.map(byId);
    const keys = [...new Set(ps.flatMap(p => Object.keys(p.specs || {})))];
    main().innerHTML = `<section class="section"><div class="wrap-wide" style="max-width:1100px"><h1 class="h-1 center" style="margin-bottom:40px">Compare ${CATEGORIES[cat].title} models</h1>
    <div class="compare"><table><thead><tr><td></td>${ps.map((p, i) => `<th><select data-col="${i}">${items.map(o => `<option value="${o.id}" ${o.id === p.id ? 'selected' : ''}>${o.name}</option>`).join('')}</select>${visual(p, 0)}<div class="swatches">${p.colors.map(c => `<span class="swatch" style="background:${c.hex}"></span>`).join('')}</div><p style="font-weight:400">From ${money(p.price, false)}</p><div class="ctas" style="margin-top:10px"><a class="btn" href="#/buy/${p.id}">Buy</a><a class="more" href="#/p/${p.id}">Learn more</a></div></th>`).join('')}</tr></thead>
    <tbody><tr><td class="label">Tagline</td>${ps.map(p => `<td>${p.tagline}</td>`).join('')}</tr>${keys.map(k => `<tr><td class="label">${k}</td>${ps.map(p => `<td>${p.specs?.[k] || '<span class="muted">&mdash;</span>'}</td>`).join('')}</tr>`).join('')}
    <tr><td class="label">Finishes</td>${ps.map(p => `<td>${p.colors.map(c => c.name).join(', ')}</td>`).join('')}</tr></tbody></table></div></div></section>`;
    $$('select[data-col]').forEach(s => s.addEventListener('change', () => { picks[+s.dataset.col] = s.value; draw(); hydrateVisuals(main()); }));
  };
  draw();
  return { title: `Compare ${CATEGORIES[cat].title}`, crumb: `${CATEGORIES[cat].name} › Compare` };
});

/* ---------- Search ---------- */
route(/^\/search\/(.+)$/, q => {
  const hits = searchProducts(q);
  main().innerHTML = `<section class="section"><div class="wrap"><p class="muted">Results for</p><h1 class="h-1">&ldquo;${esc(q)}&rdquo;</h1>
    <div class="lineup" style="margin-top:40px">${hits.length ? hits.map(lineupCard).join('') : '<p class="sub-sm">Sorry, no matches were found. Try a new search.</p>'}</div></div></section>`;
  $$('.reveal', main()).forEach(e => e.classList.add('in'));
  return { title: 'Search', crumb: 'Search' };
});

/* ---------- Generic info pages (footer links etc.) ---------- */
const INFO = {
  'apple-intelligence': ['Apple Intelligence', 'Meet the all-new Siri. It understands what\'s on your screen, takes action across your apps, and keeps your information private with on-device processing and Private Cloud Compute. Available with iOS 27, iPadOS 27, and macOS 27 on supported devices.'],
  privacy: ['Privacy', 'Privacy is a fundamental human right. It\'s also one of our core values. This recreation stores your bag, orders, and account only in your browser\'s localStorage. Nothing is sent to a server.'],
  environment: ['Environment', 'Apple 2030 is our plan to be carbon neutral across our entire footprint by the end of the decade.'],
  accessibility: ['Accessibility', 'Technology is most powerful when it empowers everyone. VoiceOver, Magnifier, Live Captions, and more come built in.'],
  education: ['Apple and Education', 'Save on Mac and iPad with education pricing. Use the code STUDENT10 at checkout in this demo.'],
  'apple-card': ['Apple Card', 'Get up to 3% Daily Cash back with every purchase. Pay for new Apple products over time, interest-free.'],
  financing: ['Financing', 'Pay over time, interest-free, with Apple Card Monthly Installments.'],
  'gift-cards': ['Apple Gift Card', 'For everything Apple. Use it for products, accessories, apps, games, music, and more.']
};
route(/^\/info\/([\w-]+)$/, slug => {
  const title = INFO[slug]?.[0] || slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
  const text = INFO[slug]?.[1] || `Learn more about ${title} at Apple. This page is part of a fan-made recreation of apple.com built for a school project.`;
  main().innerHTML = `<section class="hero white rvg" style="min-height:auto;padding:90px 22px 80px"><h1 class="h-hero">${esc(title)}</h1><p class="sub-sm muted" style="max-width:680px;margin-top:20px">${esc(text)}</p><div class="ctas"><a class="btn" href="#/store">Shop the Store</a><a class="btn ghost" href="#/support">Get Support</a></div></section>`;
  return { title, crumb: title };
});

function notFound() {
  main().innerHTML = `<section class="empty"><h1 class="h-1">The page you're looking for can't be found.</h1><div class="ctas"><a class="btn" href="#/">Go to Home</a></div></section>`;
  return { title: 'Page Not Found' };
}
route(/.*/, notFound);
