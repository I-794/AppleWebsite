/* Core: helpers, storage, bag, global nav, footer, router. */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const money = (n, cents = true) => (n < 0 ? '-' : '') + '$' + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: cents ? 2 : 0, maximumFractionDigits: cents ? 2 : 0 });
const fromPrice = p => `From ${money(p.price, false)}${p.monthly ? ` or ${money(p.price / (p.monthlyTerm || 24))}/mo. for ${p.monthlyTerm || 24} mo.` : ''}`;
const go = path => { location.hash = path; };

const store = {
  get(k, d) { try { const v = localStorage.getItem('apple_' + k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem('apple_' + k, JSON.stringify(v)); } catch { /* storage unavailable */ } }
};

function toast(msg) {
  let t = $('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove('show'), 2600);
}

/* opts.from: an element the sheet should appear to grow out of (e.g. the button that opened it). */
function modal(html, onMount, opts = {}) {
  const bg = document.createElement('div');
  bg.className = 'modal-bg';
  bg.innerHTML = `<div class="modal" role="dialog" aria-modal="true"><button class="x" aria-label="Close">&#x2715;</button>${html}</div>`;
  const close = () => { bg.classList.add('closing'); setTimeout(() => bg.remove(), 180); document.body.classList.remove('no-scroll'); };
  bg.addEventListener('click', e => { if (e.target === bg || e.target.closest('.x')) close(); });
  document.body.appendChild(bg);
  document.body.classList.add('no-scroll');
  const m = bg.querySelector('.modal');
  if (opts.from && opts.from.getBoundingClientRect) {
    const b = opts.from.getBoundingClientRect();
    m.style.transformOrigin = `${b.left + b.width / 2 - m.offsetLeft}px ${b.top + b.height / 2 - m.offsetTop}px`;
    m.classList.add('grow');
  }
  onMount && onMount(m, close);
  return close;
}

/* ===== Bag ===== */
const Bag = {
  items: store.get('bag', []),
  promo: store.get('promo', null),
  save() { store.set('bag', this.items); store.set('promo', this.promo); updateBadge(); },
  add(item) {
    const same = this.items.find(i => i.sig === item.sig);
    if (same) same.qty = Math.min(10, same.qty + item.qty);
    else this.items.push({ ...item, key: Date.now().toString(36) + Math.random().toString(36).slice(2, 6) });
    this.save();
  },
  remove(key) { this.items = this.items.filter(i => i.key !== key); this.save(); },
  setQty(key, q) { const i = this.items.find(i => i.key === key); if (i) { i.qty = q; this.save(); } },
  clear() { this.items = []; this.promo = null; this.save(); },
  count() { return this.items.reduce((a, i) => a + i.qty, 0); },
  totals(state, shipFee = 0) {
    const sub = this.items.reduce((a, i) => a + (i.unit + (i.ac ? i.ac.price : 0)) * i.qty, 0);
    const trade = this.items.reduce((a, i) => a + (i.tradeIn ? i.tradeIn.value : 0), 0);
    let disc = 0, ship = shipFee;
    const pr = this.promo && PROMOS[this.promo];
    if (pr) { if (pr.pct) disc = Math.round(sub * pr.pct) / 100; if (pr.amt) disc = Math.min(pr.amt, sub); if (pr.ship) ship = 0; }
    const taxable = Math.max(0, sub - disc - trade);
    const rate = state ? (TAX_RATES[state] ?? 0) : null;
    const tax = rate == null ? null : Math.round(taxable * rate * 100) / 100;
    return { sub, trade, disc, ship, tax, total: taxable + ship + (tax || 0), promo: pr };
  }
};
let _lastCount = null;
function updateBadge() {
  const n = Bag.count();
  const grew = _lastCount != null && n > _lastCount;
  _lastCount = n;
  $$('.gn-bag').forEach(b => {
    b.querySelector('.badge')?.remove();
    if (n) b.insertAdjacentHTML('beforeend', `<span class="badge ${grew ? 'pop' : ''}">${n}</span>`);
    if (grew) { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
  });
}

/* ===== Global nav ===== */
const ICON_SEARCH = '<svg viewBox="0 0 15 44" aria-hidden="true"><path fill="currentColor" d="M14.298,27.202l-3.87-3.87c0.701-0.929,1.122-2.081,1.122-3.332c0-3.06-2.489-5.55-5.55-5.55c-3.06,0-5.55,2.49-5.55,5.55 c0,3.061,2.49,5.55,5.55,5.55c1.251,0,2.403-0.421,3.332-1.122l3.87,3.87c0.151,0.151,0.35,0.228,0.548,0.228 s0.396-0.076,0.548-0.228C14.601,27.995,14.601,27.505,14.298,27.202z M1.55,20c0-2.454,1.997-4.45,4.45-4.45 c2.454,0,4.45,1.997,4.45,4.45S8.454,24.45,6,24.45C3.546,24.45,1.55,22.454,1.55,20z"/></svg>';
const ICON_BAG = '<svg viewBox="0 0 14 44" aria-hidden="true"><path fill="currentColor" d="m11.3535 16.0283h-1.0205a3.4229 3.4229 0 0 0 -3.333-2.9648 3.4229 3.4229 0 0 0 -3.333 2.9648h-1.02a2.1184 2.1184 0 0 0 -2.117 2.1162v7.7155a2.1186 2.1186 0 0 0 2.1162 2.1167h8.707a2.1186 2.1186 0 0 0 2.1168-2.1167v-7.7155a2.1184 2.1184 0 0 0 -2.1165-2.1162zm-4.3535-1.8652a2.3169 2.3169 0 0 1 2.2222 1.8652h-4.4444a2.3169 2.3169 0 0 1 2.2222-1.8652zm5.37 11.6969a1.0182 1.0182 0 0 1 -1.0166 1.0171h-8.7069a1.0182 1.0182 0 0 1 -1.0165-1.0171v-7.7155a1.0178 1.0178 0 0 1 1.0166-1.0166h8.707a1.0178 1.0178 0 0 1 1.0164 1.0166z"/></svg>';
const ICON_MENU = '<svg viewBox="0 0 18 44" width="18" aria-hidden="true"><path fill="currentColor" d="M2 17h14v1.2H2zM2 25.8h14V27H2z"/></svg>';

const NAV = ['store', 'mac', 'ipad', 'iphone', 'watch', 'vision', 'airpods', 'tv-home', 'entertainment', 'accessories', 'support'];
const FLY = {
  store: [['Shop', [['Shop the Latest', '#/store'], ['Mac', '#/buy/macbook-air'], ['iPad', '#/buy/ipad-air'], ['iPhone', '#/buy/iphone-18-pro'], ['Apple Watch', '#/buy/watch-series-12'], ['Apple Vision Pro', '#/buy/vision-pro'], ['Accessories', '#/accessories']]], ['Quick Links', [['Find a Store', '#/stores'], ['Order Status', '#/account'], ['Apple Trade In', '#/trade-in'], ['Financing', '#/info/financing'], ['Personal Setup', '#/info/personal-setup']]], ['Shop Special Stores', [['Certified Refurbished', '#/info/refurbished'], ['Education', '#/info/education'], ['Business', '#/info/business'], ['Veterans and Military', '#/info/military'], ['Government', '#/info/government']]]],
  entertainment: [['Explore Entertainment', [['Apple One', '#/entertainment'], ['Apple TV', '#/entertainment'], ['Apple Music', '#/entertainment'], ['Apple Arcade', '#/entertainment'], ['Apple Fitness+', '#/entertainment'], ['Apple News+', '#/entertainment'], ['Apple Podcasts', '#/entertainment'], ['Apple Books', '#/entertainment'], ['App Store', '#/entertainment']]], ['Support', [['Apple TV Support', '#/support'], ['Apple Music Support', '#/support']]]],
  support: [['Explore Support', [['iPhone', '#/support'], ['Mac', '#/support'], ['iPad', '#/support'], ['Watch', '#/support'], ['Apple Vision Pro', '#/support'], ['AirPods', '#/support'], ['Music', '#/support'], ['TV', '#/support']]], ['Get Help', [['Community', '#/support'], ['Check Coverage', '#/support'], ['Repair', '#/support'], ['Contact Us', '#/support']]], ['Helpful Topics', [['Get AppleCare', '#/support'], ['Apple Account and Password', '#/support'], ['Billing & Subscriptions', '#/support'], ['Accessibility', '#/info/accessibility']]]]
};
function flyFor(cat) {
  if (FLY[cat]) return FLY[cat];
  const items = byCat(cat);
  const name = CATEGORIES[cat].title;
  return [
    [`Explore ${name}`, [[`Explore All ${name}`, `#/${cat}`], ...items.slice(0, 7).map(p => [p.name, `#/p/${p.id}`]), ...(cat !== 'accessories' ? [[`Compare ${name}`, `#/compare/${cat}`]] : [])]],
    [`Shop ${name}`, [[`Shop ${name}`, `#/store`], ...items.slice(0, 3).map(p => [`Buy ${p.name}`, `#/buy/${p.id}`]), [`${name} Accessories`, '#/accessories'], ['Apple Trade In', '#/trade-in'], ['Financing', '#/info/financing']]],
    [`More from ${name}`, [[`${name} Support`, '#/support'], ['AppleCare', '#/info/applecare'], [cat === 'iphone' ? 'iOS 27' : cat === 'mac' ? 'macOS 27' : cat === 'ipad' ? 'iPadOS 27' : cat === 'watch' ? 'watchOS 27' : 'Apple Intelligence', '#/info/apple-intelligence'], ['Apps by Apple', '#/entertainment'], ['iCloud+', '#/entertainment']]]
  ];
}
function flyHTML(cols, cat) {
  let i = 0;
  const st = () => `style="--i:${i++}"`;
  const items = cat && byCat(cat);
  const list = items && items.length ? `<div class="col fly-products"><h4>${cols[0][0]}</h4>
    ${items.map(p => `<a class="fly-prod" href="#/p/${p.id}" ${st()}><span class="fp-img">${visual(p, 0)}</span><span><span class="fp-name">${p.name}</span>${p.isNew ? '<span class="fp-new">New</span>' : ''}</span></a>`).join('')}
    <a class="fly-all" href="#/${cat}" ${st()}>Explore All ${CATEGORIES[cat].title} &rsaquo;</a>${cat !== 'accessories' && cat !== 'vision' ? `<a class="fly-all" href="#/compare/${cat}" ${st()}>Compare ${CATEGORIES[cat].title} &rsaquo;</a>` : ''}</div>` : '';
  const rest = list ? cols.slice(1) : cols;
  return `<div class="cols">${list}${rest.map(([h, links], ci) => `<div class="col ${!list && ci === 0 ? 'big' : ''}"><h4 ${st()}>${h}</h4>${links.map(([t, u]) => `<a href="${u}" ${st()}>${t}</a>`).join('')}</div>`).join('')}</div>`;
}

function mobileMenuHTML() {
  return `<div class="m-panels"><div class="m-panel m-root">${NAV.map((c, i) => `<button class="m-cat" data-mcat="${c}" style="--i:${i}">${CATEGORIES[c].name}<span>&rsaquo;</span></button>`).join('')}</div><div class="m-panel m-sub" id="msub"></div></div>`;
}
function mobileSubHTML(cat) {
  const items = byCat(cat);
  const cols = flyFor(cat);
  let i = 0;
  return `<button class="m-back" data-mback>&lsaquo; Back</button><h4>${cols[0][0]}</h4>
    ${items.length ? items.map(p => `<a class="fly-prod" href="#/p/${p.id}" style="--i:${i++}"><span class="fp-img">${visual(p, 0)}</span><span><span class="fp-name">${p.name}</span>${p.isNew ? '<span class="fp-new">New</span>' : ''}</span></a>`).join('') + `<a class="fly-all" href="#/${cat}" style="--i:${i++}">Explore All ${CATEGORIES[cat].title} &rsaquo;</a>`
      : cols[0][1].map(([t, u]) => `<a class="m-link" href="${u}" style="--i:${i++}">${t}</a>`).join('')}
    ${cols.slice(1).map(([h, links]) => `<h4 style="margin-top:26px">${h}</h4>${links.map(([t, u]) => `<a class="m-small" href="${u}">${t}</a>`).join('')}`).join('')}`;
}

function renderNav() {
  const gn = $('#gn');
  gn.innerHTML = `<ul class="gn-list">
    <li><a class="gn-icon" href="#/" aria-label="Apple">${appleLogo()}</a></li>
    ${NAV.map(c => `<li class="gn-item desk"><a class="gn-link" data-fly="${c}" href="#/${c}" aria-expanded="false">${CATEGORIES[c].name}</a></li>`).join('')}
    <li><a class="gn-icon" href="#" data-search aria-label="Search apple.com">${ICON_SEARCH}</a></li>
    <li><a class="gn-icon gn-bag" href="#/bag" data-bag aria-label="Shopping Bag">${ICON_BAG}</a></li>
    <li class="gn-mobile"><button class="gn-icon" data-menu aria-label="Menu">${ICON_MENU}</button></li>
  </ul>
  <div class="gn-flyout" id="fly"><div class="fly-inner" id="flyin"></div></div>
  <div class="bag-pop" id="bagpop"></div>`;
  const fly = $('#fly'), inner = $('#flyin'), scrim = $('#scrim');
  let timer, closeTimer;
  const fit = () => { if (fly.classList.contains('open')) fly.style.height = (fly.classList.contains('mobile') ? window.innerHeight - gn.getBoundingClientRect().bottom : inner.offsetHeight) + 'px'; };
  // Expand smoothly from the current height to the new content's height.
  const open = (html, after, key = '') => {
    clearTimeout(timer); clearTimeout(closeTimer);
    $('#bagpop').classList.remove('open');
    if (fly.dataset.key !== key || !fly.classList.contains('open')) {
      inner.innerHTML = html;
      inner.classList.remove('anim'); void inner.offsetWidth; inner.classList.add('anim');
      hydrateVisuals(inner);
    }
    fly.dataset.key = key;
    fly.classList.toggle('mobile', key === 'menu');
    fly.classList.add('open'); scrim.classList.add('open');
    $$('[data-fly]', gn).forEach(a => a.setAttribute('aria-expanded', a.dataset.fly === key));
    requestAnimationFrame(fit);
    after && after();
  };
  const close = () => {
    clearTimeout(timer);
    delete fly.dataset.sticky;
    fly.style.height = '0px';
    fly.classList.remove('open'); scrim.classList.remove('open'); $('#bagpop').classList.remove('open');
    $$('[data-fly]', gn).forEach(a => a.setAttribute('aria-expanded', 'false'));
    document.body.classList.remove('no-scroll');
    closeTimer = setTimeout(() => { if (!fly.classList.contains('open')) { inner.innerHTML = ''; fly.dataset.key = ''; } }, 320);
  };
  window.closeNav = close;
  window.addEventListener('resize', fit);
  $$('[data-fly]', gn).forEach(a => {
    const cat = a.dataset.fly;
    a.addEventListener('mouseenter', () => { if (fly.dataset.sticky && fly.dataset.key === 'search') return; timer = setTimeout(() => open(flyHTML(flyFor(cat), cat), null, cat), fly.classList.contains('open') ? 60 : 180); });
    a.addEventListener('mouseleave', () => clearTimeout(timer));
    // Clicking a category opens (or closes) its product list instead of jumping straight to the page.
    a.addEventListener('click', e => {
      e.preventDefault();
      if (fly.classList.contains('open') && fly.dataset.key === cat && fly.dataset.sticky) return close();
      fly.dataset.sticky = 1;
      open(flyHTML(flyFor(cat), cat), null, cat);
    });
  });
  gn.addEventListener('mouseleave', () => { if (!fly.dataset.sticky) close(); });
  fly.addEventListener('click', e => {
    const mc = e.target.closest('[data-mcat]');
    if (mc) {
      $('#msub').innerHTML = mobileSubHTML(mc.dataset.mcat);
      hydrateVisuals($('#msub'));
      $('#msub').classList.remove('anim'); void $('#msub').offsetWidth; $('#msub').classList.add('anim');
      $('.m-panels', fly).classList.add('sub');
      $('#msub').scrollTop = 0;
      return;
    }
    if (e.target.closest('[data-mback]')) return $('.m-panels', fly).classList.remove('sub');
    if (e.target.closest('a')) close();
  });
  scrim.addEventListener('click', close);

  $('[data-search]', gn).addEventListener('click', e => {
    e.preventDefault();
    if (fly.classList.contains('open') && fly.dataset.key === 'search') return close();
    fly.dataset.sticky = 1;
    open(`<div class="gn-search">${ICON_SEARCH.replace('viewBox="0 0 15 44"', 'viewBox="0 13 15 18"')}<input id="q" placeholder="Search apple.com" autocomplete="off"></div>
      <div class="wrap"><div class="cols" style="padding:0"><div class="col" id="sres" style="width:100%"></div></div></div>`, () => {
      const q = $('#q'); q.focus();
      const show = () => {
        const v = q.value.trim().toLowerCase();
        const res = $('#sres');
        if (!v) { res.innerHTML = `<h4>Quick Links</h4>${[['Find a Store', '#/stores'], ['Apple Vision Pro', '#/p/vision-pro'], ['AirPods', '#/airpods'], ['Apple Intelligence', '#/info/apple-intelligence'], ['Apple Trade In', '#/trade-in']].map(([t, u]) => `<a href="${u}">&rarr;&nbsp; ${t}</a>`).join('')}`; return; }
        const hits = searchProducts(v).slice(0, 7);
        res.innerHTML = `<h4>Suggested Links</h4><div class="search-results">${hits.length ? hits.map(p => `<a href="#/p/${p.id}"><span class="thumb">${visual(p, 0)}</span>${esc(p.name)}</a>`).join('') : '<p class="small">No suggestions.</p>'}</div><a href="#/search/${encodeURIComponent(v)}">See all results for "${esc(v)}"</a>`;
        hydrateVisuals(res);
        fit();
      };
      q.addEventListener('input', show);
      q.addEventListener('keydown', e => { if (e.key === 'Enter' && q.value.trim()) { close(); go('/search/' + encodeURIComponent(q.value.trim())); } if (e.key === 'Escape') close(); });
      show();
    }, 'search');
  });

  const bagBtn = $('[data-bag]', gn);
  bagBtn.addEventListener('click', e => {
    e.preventDefault();
    const pop = $('#bagpop');
    if (pop.classList.contains('open')) { close(); return; }
    close();
    const user = store.get('user', null);
    pop.innerHTML = Bag.count() ? `<h4>Bag</h4>${Bag.items.slice(0, 3).map(i => `<div class="mini"><span class="visual-wrap">${visual(byId(i.id), i.color)}</span>${esc(i.name)}</div>`).join('').replace(/visual-wrap/g, '')}
      ${Bag.items.length > 3 ? `<p class="small">${Bag.items.length - 3} more items in your Bag</p>` : ''}
      <a class="btn block" style="margin:14px 0" href="#/bag">Review Bag</a>` : `<h4>Your Bag is empty.</h4><p class="small" style="margin-bottom:16px">${user ? '' : '<a href="#/account">Sign in</a> to see if you have any saved items'}</p>`;
    pop.innerHTML += `<p class="small" style="margin:6px 0 4px">My Profile</p>
      <a class="lnk" href="#/account">&#x25A2; Orders</a><a class="lnk" href="#/info/saves">&#x2661; Your Saves</a><a class="lnk" href="#/account">&#x2699; Account</a>
      <a class="lnk" href="#/account" data-signout>&#x263A; ${user ? 'Sign out ' + esc(user.first || '') : 'Sign in'}</a>`;
    pop.classList.add('open'); scrim.classList.add('open');
    hydrateVisuals(pop);
    pop.onclick = ev => {
      const so = ev.target.closest('[data-signout]');
      if (so && user) { ev.preventDefault(); store.set('user', null); toast('You have been signed out.'); }
      if (ev.target.closest('a')) close();
    };
  });

  $('[data-menu]', gn).addEventListener('click', () => {
    if (fly.classList.contains('open')) return close();
    fly.dataset.sticky = 1;
    open(mobileMenuHTML(), () => document.body.classList.add('no-scroll'), 'menu');
  });
  updateBadge();
}

function searchProducts(v) {
  const words = v.toLowerCase().split(/\s+/).filter(Boolean);
  return PRODUCTS.map(p => {
    const hay = `${p.name} ${p.category} ${CATEGORIES[p.category]?.name || ''} ${p.tagline || ''} ${p.headline || ''}`.toLowerCase();
    const score = words.reduce((s, w) => s + (p.name.toLowerCase().includes(w) ? 3 : hay.includes(w) ? 1 : 0), 0);
    return { p, score };
  }).filter(x => x.score >= words.length).sort((a, b) => b.score - a.score).map(x => x.p);
}

/* ===== Footer ===== */
const FOOT = [
  [['Shop and Learn', [['Store', '#/store'], ['Mac', '#/mac'], ['iPad', '#/ipad'], ['iPhone', '#/iphone'], ['Watch', '#/watch'], ['Vision', '#/vision'], ['AirPods', '#/airpods'], ['TV & Home', '#/tv-home'], ['AirTag', '#/p/airtag'], ['Accessories', '#/accessories'], ['Gift Cards', '#/info/gift-cards']]], ['Apple Wallet', [['Wallet', '#/info/wallet'], ['Apple Card', '#/info/apple-card'], ['Apple Pay', '#/info/apple-pay'], ['Apple Cash', '#/info/apple-cash']]]],
  [['Account', [['Manage Your Apple Account', '#/account'], ['Apple Store Account', '#/account'], ['iCloud.com', '#/info/icloud']]], ['Entertainment', [['Apple One', '#/entertainment'], ['Apple TV', '#/entertainment'], ['Apple Music', '#/entertainment'], ['Apple Arcade', '#/entertainment'], ['Apple Fitness+', '#/entertainment'], ['Apple News+', '#/entertainment'], ['Apple Podcasts', '#/entertainment'], ['Apple Books', '#/entertainment'], ['App Store', '#/entertainment']]]],
  [['Apple Store', [['Find a Store', '#/stores'], ['Genius Bar', '#/stores'], ['Today at Apple', '#/info/today-at-apple'], ['Group Reservations', '#/stores'], ['Apple Camp', '#/info/apple-camp'], ['Apple Store App', '#/info/store-app'], ['Certified Refurbished', '#/info/refurbished'], ['Apple Trade In', '#/trade-in'], ['Financing', '#/info/financing'], ['Carrier Deals at Apple', '#/info/carrier-deals'], ['Order Status', '#/account'], ['Shopping Help', '#/support']]]],
  [['For Business', [['Apple and Business', '#/info/business'], ['Shop for Business', '#/info/business']]], ['For Education', [['Apple and Education', '#/info/education'], ['Shop for K-12', '#/info/education'], ['Shop for College', '#/info/education']]], ['For Healthcare', [['Apple in Healthcare', '#/info/healthcare'], ['Mac in Healthcare', '#/info/healthcare'], ['Health on Apple Watch', '#/info/healthcare']]], ['For Government', [['Shop for Government', '#/info/government'], ['Shop for Veterans and Military', '#/info/military']]]],
  [['Apple Values', [['Accessibility', '#/info/accessibility'], ['Education', '#/info/education'], ['Environment', '#/info/environment'], ['Inclusion and Diversity', '#/info/inclusion'], ['Privacy', '#/info/privacy'], ['Racial Equity and Justice', '#/info/racial-equity'], ['Supply Chain Innovation', '#/info/supply-chain']]], ['About Apple', [['Newsroom', '#/info/newsroom'], ['Apple Leadership', '#/info/leadership'], ['Career Opportunities', '#/info/careers'], ['Investors', '#/info/investors'], ['Ethics & Compliance', '#/info/ethics'], ['Events', '#/info/events'], ['Contact Apple', '#/support']]]]
];
function renderFooter() {
  $('#gf').innerHTML = `<div class="wrap">
    <div class="notes">
      <p>* Trade-in values will vary based on the condition, year, and configuration of your eligible trade-in device. Not all devices are eligible for credit. You must be at least the age of majority to be eligible to trade in for credit or for an Apple Gift Card.</p>
      <p>1. Monthly pricing is after purchase using Apple Card Monthly Installments with 0% APR. Taxes and shipping not included.</p>
      <p>Siri AI available in beta with iOS 27 on supported devices set to English. Feature availability varies by region and language.</p>
      <p><b>Fan-made recreation for a school project.</b> This site is not affiliated with, endorsed by, or connected to Apple Inc. Product names and images belong to Apple. No real orders are placed and no payment information is sent anywhere; everything stays in your browser.</p>
    </div>
    <div class="bc">${appleLogo()} <span>&rsaquo;</span> <span id="bc-page">Home</span></div>
    <div class="cols">${FOOT.map(col => `<div>${col.map(([h, links]) => `<div class="fcol"><h3>${h}</h3><ul>${links.map(([t, u]) => `<li><a href="${u}">${t}</a></li>`).join('')}</ul></div>`).join('')}</div>`).join('')}</div>
    <p class="more-ways">More ways to shop: <a href="#/stores">Find an Apple Store</a> or <a href="#/stores">other retailer</a> near you. Or call 1-800-MY-APPLE (1-800-692-7753).</p>
    <div class="legal"><span>Copyright &copy; 2026 Apple Inc. All rights reserved.</span>
      <span><a href="#/info/privacy">Privacy Policy</a><a href="#/info/terms">Terms of Use</a><a href="#/info/sales-policy">Sales and Refunds</a><a href="#/info/legal">Legal</a><a href="#/info/sitemap">Site Map</a></span>
      <a href="#/info/choose-country">United States</a></div>
  </div>`;
  $$('.gf .fcol h3').forEach(h => h.addEventListener('click', () => h.parentElement.classList.toggle('open')));
}

/* ===== Router ===== */
const ROUTES = [];
const route = (re, fn) => ROUTES.push([re, fn]);

function navigate() {
  const hash = decodeURIComponent(location.hash.replace(/^#/, '')) || '/';
  window.closeNav && window.closeNav();
  document.body.classList.remove('no-scroll');
  $$('.modal-bg, .apple-pay-sheet, .xcard-bg').forEach(m => m.remove());
  const main = $('#main');
  main.onclick = null;
  main.onchange = null;
  const gn = $('#gn');
  for (const [re, fn] of ROUTES) {
    const m = hash.match(re);
    if (m) {
      const out = fn(...m.slice(1)) || {};
      gn.classList.toggle('dark', !!out.dark);
      gn.style.display = out.chromeless ? 'none' : '';
      $('#gf').style.display = out.chromeless ? 'none' : '';
      document.title = (out.title ? `${out.title} - ` : '') + 'Apple Store Recreation (Fan Project)';
      $('#bc-page') && ($('#bc-page').textContent = out.crumb || out.title || 'Home');
      break;
    }
  }
  if (!sessionStorage.getItem('keepScroll')) window.scrollTo(0, 0);
  sessionStorage.removeItem('keepScroll');
  main.classList.remove('page-in'); void main.offsetWidth; main.classList.add('page-in');
  hydrateVisuals(main);
  observeReveal(main);
  main.focus({ preventScroll: true });
}

/* .reveal: a single element fades up when scrolled into view.
   .rvg: a group (hero, tile) whose children rise in one after another. */
function observeReveal(root) {
  const els = $$('.reveal, .rvg', root);
  if (!('IntersectionObserver' in window)) return els.forEach(e => e.classList.add('in'));
  const io = new IntersectionObserver(entries => entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: .1 });
  els.forEach(e => io.observe(e));
}

window.addEventListener('hashchange', navigate);
document.addEventListener('DOMContentLoaded', () => {
  renderNav();
  renderFooter();
  navigate();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') { window.closeNav && window.closeNav(); $$('.modal-bg').forEach(m => m.remove()); $$('.xcard-bg').forEach(m => m._close ? m._close() : m.remove()); document.body.classList.remove('no-scroll'); } });
