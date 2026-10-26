/* Bag, checkout, orders, and account. Everything is stored locally in the browser. */

const STATES = Object.keys(TAX_RATES);
const TEST_CARDS = ['4242424242424242', '4000056655665556', '5555555555554444', '378282246310005', '6011111111111117'];
const luhn = num => { let s = 0, alt = false; for (let i = num.length - 1; i >= 0; i--) { let d = +num[i]; if (alt) { d *= 2; if (d > 9) d -= 9; } s += d; alt = !alt; } return num.length >= 13 && s % 10 === 0; };
const cardBrand = n => /^3[47]/.test(n) ? 'AMEX' : /^4/.test(n) ? 'VISA' : /^(5[1-5]|2[2-7])/.test(n) ? 'MASTERCARD' : /^6(011|5)/.test(n) ? 'DISCOVER' : '';
const SHIP_OPTS = [
  { id: 'std', label: 'Standard Delivery', desc: 'Delivers in 2–4 business days', fee: 0, days: 3 },
  { id: 'exp', label: 'Express Delivery', desc: 'Delivers in 1–2 business days', fee: 9.95, days: 1 },
  { id: 'courier', label: 'Courier', desc: 'Delivers today within 2 hours, in select areas', fee: 14.95, days: 0 }
];
const CO = {
  data: JSON.parse(sessionStorage.getItem('apple_co') || '{}'),
  save() { sessionStorage.setItem('apple_co', JSON.stringify(this.data)); },
  reset() { this.data = {}; this.save(); }
};
const shipFee = () => CO.data.mode === 'pickup' ? 0 : (SHIP_OPTS.find(s => s.id === CO.data.ship) || SHIP_OPTS[0]).fee;
const taxState = () => CO.data.mode === 'pickup' ? (STORES.find(s => s.id === CO.data.store)?.city.split(', ')[1]) : CO.data.addr?.state;

function totalsHTML(t, opts = {}) {
  return `<div class="ln"><span>Subtotal</span><span>${money(t.sub)}</span></div>
  ${t.trade ? `<div class="ln"><span>Trade-in credit</span><span style="color:var(--green)">-${money(t.trade)}</span></div>` : ''}
  ${t.disc ? `<div class="ln"><span>${t.promo.label}</span><span style="color:var(--green)">-${money(t.disc)}</span></div>` : ''}
  <div class="ln"><span>Shipping</span><span>${t.ship ? money(t.ship) : 'FREE'}</span></div>
  <div class="ln"><span>${opts.final ? 'Tax' : 'Estimated tax'}</span><span>${t.tax == null ? 'Calculated at checkout' : money(t.tax)}</span></div>
  <div class="ln grand"><span>Total</span><span>${money(t.total)}</span></div>
  <p class="small" style="text-align:right;margin-top:6px">or ${money(t.total / 12)}/mo. for 12 mo. with Apple Card Monthly Installments</p>`;
}

/* ---------- Bag ---------- */
route(/^\/bag$/, () => {
  const draw = () => {
    if (!Bag.items.length) {
      main().innerHTML = `<section class="empty"><div class="wrap"><h1 class="h-1">Your bag is empty.</h1><p class="sub-sm" style="margin-top:14px">Free delivery and free returns.</p>
      ${store.get('user', null) ? '' : '<p style="margin-top:14px"><a href="#/account">Sign in</a> to see if you have any saved items.</p>'}<div class="ctas"><a class="btn lg" href="#/store">Continue Shopping</a></div></div></section>`;
      return;
    }
    const t = Bag.totals(null, 0);
    main().innerHTML = `<div class="wrap"><div class="bag-head"><h1 class="h-1">Review your bag.</h1><p class="sub-sm" style="margin-top:12px">Free delivery and free returns.</p><div class="ctas"><a class="btn lg" href="#/checkout">Check Out</a></div></div>
      ${Bag.items.map(i => {
        const p = byId(i.id);
        return `<div class="bag-item"><a href="#/p/${i.id}">${visual(p, i.color)}</a><div>
          <div class="top"><div><p class="name">${esc(i.name)}</p><p class="cfg">${esc(i.cfg)}</p>${i.engraving ? `<p class="cfg">Engraving: &ldquo;${esc(i.engraving)}&rdquo;</p>` : ''}</div>
          <div class="qty"><select data-qty="${i.key}" aria-label="Quantity">${Array.from({ length: 10 }, (_, n) => `<option ${n + 1 === i.qty ? 'selected' : ''}>${n + 1}</option>`).join('')}</select></div>
          <div><p class="price">${money(i.unit * i.qty)}</p><button class="rm" data-rm="${i.key}">Remove</button></div></div>
          <div class="lines">
            ${i.ac ? `<p>${esc(i.ac.name)} &middot; ${money(i.ac.price * i.qty)} <button class="more" style="color:var(--link)" data-rmac="${i.key}">Remove</button></p>` : (p.options.find(o => o.key === 'applecare') ? `<p><button class="more" style="color:var(--link)" data-addac="${i.key}">Add AppleCare+ for ${money(p.options.find(o => o.key === 'applecare').choices[0].price)}</button></p>` : '')}
            ${i.tradeIn ? `<p>Trade-in: ${esc(i.tradeIn.name)} &middot; <span style="color:var(--green)">-${money(i.tradeIn.value)}</span></p>` : ''}
            <p style="margin-top:8px">&#x1F4E6; Delivers in 2–4 business days &middot; Free &nbsp; &#x1F3EC; <a href="#/stores">Pick up at an Apple Store</a></p>
          </div></div></div>`;
      }).join('')}
      <div class="totals">
        <div class="promo"><div class="field"><input id="promo" placeholder=" " value="${esc(Bag.promo || '')}"><label>Promo code</label><p class="msg">This code isn't valid.</p></div><button class="btn ghost" id="applyp">${Bag.promo ? 'Remove' : 'Apply'}</button></div>
        ${totalsHTML(t)}
        <div style="margin-top:30px;display:grid;gap:12px"><a class="btn block" href="#/checkout">Check Out</a><button class="apple-pay" id="ap">${appleLogo()}Pay</button></div>
        <p class="small center" style="margin-top:14px">Need some help? <a href="#/support">Chat now</a> or call 1-800-MY-APPLE.</p>
      </div></div>`;
  };
  draw();
  main().onclick = e => {
    const rm = e.target.closest('[data-rm]'), rmac = e.target.closest('[data-rmac]'), addac = e.target.closest('[data-addac]');
    if (rm) { Bag.remove(rm.dataset.rm); toast('Item removed from your bag.'); }
    else if (rmac) { Bag.items.find(i => i.key === rmac.dataset.rmac).ac = null; Bag.save(); }
    else if (addac) { const it = Bag.items.find(i => i.key === addac.dataset.addac); const c = byId(it.id).options.find(o => o.key === 'applecare').choices[0]; it.ac = { name: c.label, price: c.price }; Bag.save(); }
    else if (e.target.id === 'applyp') {
      if (Bag.promo) { Bag.promo = null; Bag.save(); }
      else {
        const code = $('#promo').value.trim().toUpperCase();
        if (!PROMOS[code]) { $('#promo').parentElement.classList.add('err'); return; }
        Bag.promo = code; Bag.save(); toast(`${PROMOS[code].label} applied.`);
      }
    } else if (e.target.closest('#ap')) { return applePay(); }
    else return;
    draw(); hydrateVisuals(main());
  };
  main().onchange = e => { if (e.target.dataset.qty) { Bag.setQty(e.target.dataset.qty, +e.target.value); draw(); hydrateVisuals(main()); } };
  return { title: 'Bag', crumb: 'Bag' };
});

/* ---------- Apple Pay (simulated) ---------- */
function applePay() {
  const user = store.get('user', null);
  const addr = CO.data.addr || { first: user?.first || 'Alex', last: user?.last || 'Appleseed', street: '1 Infinite Loop', city: 'Cupertino', state: 'CA', zip: '95014', email: user?.email || 'alex@example.com', phone: '4085551234' };
  const t = Bag.totals(addr.state, 0);
  const bg = document.createElement('div'); bg.className = 'modal-bg';
  document.body.appendChild(bg);
  const sheet = document.createElement('div'); sheet.className = 'apple-pay-sheet';
  sheet.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center"><span style="display:flex;align-items:center;gap:3px;font-size:20px;font-weight:600">${appleLogo()}Pay</span><button class="more" style="color:var(--link)" data-x>Cancel</button></div>
    <div class="row"><span class="muted">CARD</span><span>Apple Card ···· 1234</span></div>
    <div class="row"><span class="muted">SHIPPING</span><span style="text-align:right">${esc(addr.first)} ${esc(addr.last)}<br>${esc(addr.street)}, ${esc(addr.city)}, ${esc(addr.state)} ${esc(addr.zip)}</span></div>
    <div class="row"><span class="muted">METHOD</span><span>Standard Delivery · Free</span></div>
    <div class="row"><span class="muted">CONTACT</span><span>${esc(addr.email)}</span></div>
    <div class="row" style="border:0;font-size:17px"><span>PAY APPLE STORE (DEMO)</span><b>${money(t.total)}</b></div>
    <div class="side-btn" id="apstat">Confirm with Side Button<br><button class="btn" style="margin-top:12px" id="apgo">Double-click to pay</button></div>`;
  document.body.appendChild(sheet);
  const close = () => { sheet.remove(); bg.remove(); };
  bg.onclick = close;
  sheet.querySelector('[data-x]').onclick = close;
  sheet.querySelector('#apgo').onclick = () => {
    $('#apstat').innerHTML = '<div class="faceid"></div>Face ID';
    setTimeout(() => {
      $('#apstat').innerHTML = '<div style="font-size:34px;color:var(--green)">&#x2713;</div>Done';
      setTimeout(() => { close(); placeOrder({ mode: 'ship', ship: 'std', addr, pay: { type: 'applepay', label: 'Apple Pay · Apple Card ···· 1234' } }); }, 700);
    }, 1300);
  };
}

/* ---------- Checkout ---------- */
const STEPS = [['signin', 'Sign In'], ['delivery', 'Delivery'], ['payment', 'Payment'], ['review', 'Review']];
function coShell(step, inner) {
  const si = STEPS.findIndex(s => s[0] === step);
  const t = Bag.totals(step === 'review' || step === 'payment' ? taxState() : null, shipFee());
  return `<header class="co-head"><div class="wrap" style="max-width:1100px"><a href="#/" aria-label="Apple">${appleLogo()}</a>
    <div class="co-steps">${STEPS.map(([k, n], i) => `<span class="${i === si ? 'on' : i < si ? 'done' : ''}">${i ? '›&nbsp;' : ''}${n}</span>`).join('')}</div>
    <a href="#/bag" class="small">Bag Total ${money(t.total)}</a></div></header>
  <div class="co-grid"><div>${inner}</div>
  <aside class="co-side"><p class="h-4" style="margin-bottom:10px">Order Summary</p>${Bag.items.map(i => `<div class="it">${visual(byId(i.id), i.color)}<div style="flex:1"><b>${esc(i.name)}</b><div class="muted">${esc(i.cfg)}</div>${i.qty > 1 ? `<div class="muted">Qty ${i.qty}</div>` : ''}</div><b>${money(i.unit * i.qty + (i.ac ? i.ac.price * i.qty : 0))}</b></div>`).join('')}
  <div class="totals" style="padding:16px 0 0">${totalsHTML(t)}</div></aside></div>`;
}

route(/^\/checkout(?:\/(\w+))?$/, (step = 'signin') => {
  if (!Bag.items.length) { go('/bag'); return {}; }
  const user = store.get('user', null);
  if (step === 'signin' && user) { CO.data.email = user.email; CO.save(); step = 'delivery'; }
  const order = STEPS.map(s => s[0]);
  if (order.indexOf(step) > 1 && !CO.data.deliveryDone) step = 'delivery';
  if (step === 'review' && !CO.data.pay) step = 'payment';
  const views = { signin: coSignin, delivery: coDelivery, payment: coPayment, review: coReview };
  (views[step] || coSignin)();
  return { title: 'Secure Checkout', chromeless: true };
});

function coSignin() {
  main().innerHTML = coShell('signin', `<h1 class="h-2">Ready to check out?</h1>
    <p class="h-4" style="margin:0 0 16px">Sign in with your Apple Account.</p>
    <div class="field"><input id="se" type="email" placeholder=" "><label>Email or Phone Number</label><p class="msg">Enter a valid email.</p></div>
    <div class="field"><input id="sp" type="password" placeholder=" "><label>Password</label><p class="msg">Password must be at least 8 characters.</p></div>
    <label class="checkbox"><input type="checkbox" checked> Remember me</label>
    <button class="btn block" id="sgo">Sign In</button>
    <p class="h-4" style="margin-top:44px">Or continue as a guest.</p><p class="muted" style="margin-bottom:16px">You'll have a chance to create an Apple Account later.</p>
    <div class="field"><input id="ge" type="email" placeholder=" " value="${esc(CO.data.email || '')}"><label>Email</label><p class="msg">Enter a valid email.</p></div>
    <button class="btn block ghost" id="ggo">Continue as Guest</button>`);
  const valid = el => { const ok = /^\S+@\S+\.\S+$/.test(el.value.trim()); el.parentElement.classList.toggle('err', !ok); return ok; };
  $('#sgo').onclick = () => {
    const ok1 = valid($('#se')); const ok2 = $('#sp').value.length >= 8; $('#sp').parentElement.classList.toggle('err', !ok2);
    if (!ok1 || !ok2) return;
    const email = $('#se').value.trim();
    store.set('user', { email, first: email.split('@')[0].replace(/^\w/, c => c.toUpperCase()), last: '' });
    CO.data.email = email; CO.save(); toast('Signed in.'); go('/checkout/delivery');
  };
  $('#ggo').onclick = () => { if (!valid($('#ge'))) return; CO.data.email = $('#ge').value.trim(); CO.save(); go('/checkout/delivery'); };
}

function addressFields(prefix, a = {}) {
  const f = (id, label, val = '', type = 'text', msg = 'Required.') => `<div class="field"><input id="${prefix}${id}" type="${type}" placeholder=" " value="${esc(val)}"><label>${label}</label><p class="msg">${msg}</p></div>`;
  return `<div class="row2">${f('first', 'First Name', a.first)}${f('last', 'Last Name', a.last)}</div>
    ${f('street', 'Street Address', a.street)}${f('apt', 'Apt, Suite, Building (Optional)', a.apt)}
    <div class="row3">${f('city', 'City', a.city)}<div class="field"><select id="${prefix}state">${STATES.map(s => `<option ${a.state === s ? 'selected' : ''}>${s}</option>`).join('')}</select><label>State</label></div>${f('zip', 'ZIP Code', a.zip, 'text', 'Enter a 5-digit ZIP.')}</div>`;
}
function readAddress(prefix) {
  const g = id => $('#' + prefix + id).value.trim();
  const a = { first: g('first'), last: g('last'), street: g('street'), apt: g('apt'), city: g('city'), state: $('#' + prefix + 'state').value, zip: g('zip') };
  let ok = true;
  [['first', a.first], ['last', a.last], ['street', a.street], ['city', a.city], ['zip', /^\d{5}$/.test(a.zip)]].forEach(([k, v]) => { const el = $('#' + prefix + k).parentElement; el.classList.toggle('err', !v); ok = ok && !!v; });
  return ok ? a : null;
}

function coDelivery() {
  const d = CO.data;
  d.mode = d.mode || 'ship'; d.ship = d.ship || 'std';
  const draw = () => {
    main().innerHTML = coShell('delivery', `<h1 class="h-2">How would you like to get your order?</h1>
      <div class="row2"><label class="radio-card ${d.mode === 'ship' ? 'on' : ''}"><input type="radio" name="mode" value="ship" ${d.mode === 'ship' ? 'checked' : ''}><div class="grow"><p class="rt">I'd like it delivered</p><p class="small">Free standard delivery</p></div></label>
      <label class="radio-card ${d.mode === 'pickup' ? 'on' : ''}"><input type="radio" name="mode" value="pickup" ${d.mode === 'pickup' ? 'checked' : ''}><div class="grow"><p class="rt">I'll pick it up</p><p class="small">At an Apple Store, usually today</p></div></label></div>
      ${d.mode === 'ship' ? `<p class="h-4">Where should we send your order?</p>${addressFields('a', d.addr || {})}
        <p class="h-4">What's your contact information?</p>
        <div class="field"><input id="cemail" type="email" placeholder=" " value="${esc(d.email || '')}"><label>Email Address</label><p class="msg">Enter a valid email.</p></div>
        <div class="field"><input id="cphone" type="tel" placeholder=" " value="${esc(d.phone || '')}"><label>Phone Number</label><p class="msg">Enter a 10-digit phone number.</p></div>
        <p class="h-4">Delivery options</p>${SHIP_OPTS.map(s => `<label class="radio-card ${d.ship === s.id ? 'on' : ''}"><input type="radio" name="ship" value="${s.id}" ${d.ship === s.id ? 'checked' : ''}><div class="grow"><p class="rt">${s.label}</p><p class="small">${s.desc} · Arrives ${eta(s.days)}</p></div><b>${s.fee ? money(s.fee) : 'FREE'}</b></label>`).join('')}`
      : `<p class="h-4">Choose a store.</p>${STORES.map(s => `<label class="radio-card ${d.store === s.id ? 'on' : ''}"><input type="radio" name="store" value="${s.id}" ${d.store === s.id ? 'checked' : ''}><div class="grow"><p class="rt">${s.name}</p><p class="small">${s.addr}, ${s.city} · Available today</p></div></label>`).join('')}
        <p class="h-4">Who's picking up?</p><div class="row2"><div class="field"><input id="pfirst" placeholder=" " value="${esc(d.pickup?.first || '')}"><label>First Name</label><p class="msg">Required.</p></div><div class="field"><input id="plast" placeholder=" " value="${esc(d.pickup?.last || '')}"><label>Last Name</label><p class="msg">Required.</p></div></div>
        <div class="field"><input id="cemail" type="email" placeholder=" " value="${esc(d.email || '')}"><label>Email Address</label><p class="msg">Enter a valid email.</p></div>
        <div class="field"><input id="cphone" type="tel" placeholder=" " value="${esc(d.phone || '')}"><label>Phone Number</label><p class="msg">Enter a 10-digit phone number.</p></div>
        <p class="msg" id="storemsg" style="color:var(--red);display:none">Please choose a store.</p>`}
      <button class="btn block" id="dgo" style="margin-top:20px">Continue to Payment</button>`);
    hydrateVisuals(main());
  };
  draw();
  main().onchange = e => {
    if (e.target.name === 'mode') { stash(); d.mode = e.target.value; draw(); }
    else if (e.target.name === 'ship') { stash(); d.ship = e.target.value; draw(); }
    else if (e.target.name === 'store') { stash(); d.store = e.target.value; draw(); }
  };
  // keep typed values when the form re-renders
  const stash = () => {
    const v = id => $('#' + id)?.value;
    if (d.mode === 'ship' && $('#afirst')) d.addr = { first: v('afirst'), last: v('alast'), street: v('astreet'), apt: v('aapt'), city: v('acity'), state: v('astate'), zip: v('azip') };
    if (d.mode === 'pickup' && $('#pfirst')) d.pickup = { first: v('pfirst'), last: v('plast') };
    if ($('#cemail')) d.email = v('cemail');
    if ($('#cphone')) d.phone = v('cphone');
  };
  main().onclick = e => {
    if (e.target.id !== 'dgo') return;
    stash();
    let ok = true;
    if (d.mode === 'ship') { const a = readAddress('a'); if (a) d.addr = a; else ok = false; }
    else {
      if (!d.store) { $('#storemsg').style.display = 'block'; ok = false; }
      ['pfirst', 'plast'].forEach(id => { const good = !!$('#' + id).value.trim(); $('#' + id).parentElement.classList.toggle('err', !good); ok = ok && good; });
    }
    const em = /^\S+@\S+\.\S+$/.test(d.email || ''); $('#cemail').parentElement.classList.toggle('err', !em);
    const ph = (d.phone || '').replace(/\D/g, '').length === 10; $('#cphone').parentElement.classList.toggle('err', !ph);
    if (!ok || !em || !ph) { $('.field.err, #storemsg[style*="block"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
    d.deliveryDone = true; CO.save(); go('/checkout/payment');
  };
}
const eta = days => { const d = new Date(Date.now() + days * 864e5); return days === 0 ? 'today' : d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }); };

function coPayment() {
  const d = CO.data;
  d.payType = d.payType || 'card';
  const needsBilling = () => d.mode === 'pickup' || d.billSame === false;
  const draw = () => {
    main().innerHTML = coShell('payment', `<h1 class="h-2">How do you want to pay?</h1>
      ${[['card', 'Credit or Debit Card', 'Visa, Mastercard, Amex, Discover'], ['applepay', 'Apple Pay', 'Pay with Face ID or Touch ID'], ['gift', 'Apple Gift Card', 'Redeem a gift card code']].map(([id, t, s]) => `<label class="radio-card ${d.payType === id ? 'on' : ''}"><input type="radio" name="pt" value="${id}" ${d.payType === id ? 'checked' : ''}><div class="grow"><p class="rt">${t}</p><p class="small">${s}</p></div></label>`).join('')}
      <div class="notice">Demo checkout: card details are only checked for format in your browser. Only test cards work (4242 4242 4242 4242, 5555 5555 5555 4444, 3782 822463 10005). Never enter a real card.</div>
      ${d.payType === 'card' ? `<p class="h-4">Enter your card information.</p>
        <div class="field"><input id="cn" inputmode="numeric" autocomplete="off" placeholder=" " maxlength="23"><label>Card Number</label><span class="card-brand" id="cb"></span><p class="msg">Demo only: use a test card such as 4242 4242 4242 4242.</p></div>
        <div class="row2"><div class="field"><input id="cx" inputmode="numeric" placeholder=" " maxlength="5"><label>Expiration MM/YY</label><p class="msg">Enter a valid future date.</p></div>
        <div class="field"><input id="cv" inputmode="numeric" placeholder=" " maxlength="4"><label>Security Code</label><p class="msg">Enter a valid security code.</p></div></div>
        <div class="field"><input id="cname" placeholder=" " autocomplete="off"><label>Name on Card</label><p class="msg">Required.</p></div>` : ''}
      ${d.payType === 'gift' ? `<div class="field"><input id="gc" placeholder=" " maxlength="16"><label>Gift Card PIN (starts with X)</label><p class="msg">Enter a valid 16-character code that starts with X.</p></div><p class="small">Demo gift cards carry a $10,000 balance.</p>` : ''}
      ${d.payType === 'applepay' ? '<p class="muted" style="margin:10px 0">You will confirm with Apple Pay when you place your order.</p>' : ''}
      <p class="h-4">Billing address</p>
      ${d.mode === 'ship' ? `<label class="checkbox"><input type="checkbox" id="bsame" ${d.billSame !== false ? 'checked' : ''}> Same as delivery address</label>` : ''}
      ${needsBilling() ? addressFields('b', d.bill || {}) : `<p class="muted">${esc(d.addr.first)} ${esc(d.addr.last)}, ${esc(d.addr.street)}, ${esc(d.addr.city)}, ${esc(d.addr.state)} ${esc(d.addr.zip)}</p>`}
      <button class="btn block" id="pgo" style="margin-top:24px">Review Your Order</button>`);
    hydrateVisuals(main());
    const cn = $('#cn');
    if (cn) {
      cn.addEventListener('input', () => { const raw = cn.value.replace(/\D/g, '').slice(0, 19); const amex = /^3[47]/.test(raw); cn.value = amex ? raw.replace(/^(\d{0,4})(\d{0,6})(\d{0,5}).*/, (m, a, b, c) => [a, b, c].filter(Boolean).join(' ')) : raw.replace(/(\d{4})(?=\d)/g, '$1 '); $('#cb').textContent = cardBrand(raw); });
      $('#cx').addEventListener('input', e => { let v = e.target.value.replace(/\D/g, '').slice(0, 4); if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2); e.target.value = v; });
      $('#cv').addEventListener('input', e => { e.target.value = e.target.value.replace(/\D/g, ''); });
    }
  };
  draw();
  main().onchange = e => {
    if (e.target.name === 'pt') { d.payType = e.target.value; draw(); }
    if (e.target.id === 'bsame') { d.billSame = e.target.checked; draw(); }
  };
  main().onclick = e => {
    if (e.target.id !== 'pgo') return;
    let ok = true, pay;
    const bad = (el, cond) => { el.parentElement.classList.toggle('err', !cond); ok = ok && cond; };
    if (d.payType === 'card') {
      const num = $('#cn').value.replace(/\D/g, ''), brand = cardBrand(num);
      bad($('#cn'), luhn(num) && !!brand && TEST_CARDS.includes(num));
      const [mm, yy] = $('#cx').value.split('/').map(Number);
      const exp = mm >= 1 && mm <= 12 && yy >= 0 && new Date(2000 + yy, mm, 1) > new Date();
      bad($('#cx'), !!exp);
      bad($('#cv'), new RegExp(brand === 'AMEX' ? '^\\d{4}$' : '^\\d{3}$').test($('#cv').value));
      bad($('#cname'), !!$('#cname').value.trim());
      pay = { type: 'card', label: `${brand || 'Card'} ···· ${num.slice(-4)}` };
    } else if (d.payType === 'gift') {
      const code = $('#gc').value.trim().toUpperCase();
      bad($('#gc'), /^X[A-Z0-9]{15}$/.test(code));
      pay = { type: 'gift', label: `Apple Gift Card ···· ${code.slice(-4)}` };
    } else pay = { type: 'applepay', label: 'Apple Pay · Apple Card ···· 1234' };
    if (needsBilling()) { const b = readAddress('b'); if (b) d.bill = b; else ok = false; }
    if (!ok) { $('.field.err')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
    d.pay = pay; CO.save(); go('/checkout/review');
  };
}

function coReview() {
  const d = CO.data;
  const st = STORES.find(s => s.id === d.store);
  const t = Bag.totals(taxState(), shipFee());
  const shipLabel = d.mode === 'pickup' ? `Pickup at ${st.name}, ${st.city}<br>${esc(d.pickup.first)} ${esc(d.pickup.last)} · Ready today` : `${esc(d.addr.first)} ${esc(d.addr.last)}<br>${esc(d.addr.street)}${d.addr.apt ? ', ' + esc(d.addr.apt) : ''}<br>${esc(d.addr.city)}, ${d.addr.state} ${d.addr.zip}<br>${SHIP_OPTS.find(s => s.id === d.ship).label} · Arrives ${eta(SHIP_OPTS.find(s => s.id === d.ship).days)}`;
  main().innerHTML = coShell('review', `<h1 class="h-2">Review your order.</h1>
    <div class="review-block"><div><h4>${d.mode === 'pickup' ? 'Pickup' : 'Delivery'}</h4><p>${shipLabel}</p></div><a href="#/checkout/delivery">Edit</a></div>
    <div class="review-block"><div><h4>Contact</h4><p>${esc(d.email)}<br>${esc(d.phone)}</p></div><a href="#/checkout/delivery">Edit</a></div>
    <div class="review-block"><div><h4>Payment</h4><p>${esc(d.pay.label)}</p></div><a href="#/checkout/payment">Edit</a></div>
    <div class="review-block" style="display:block"><h4>Items</h4>${Bag.items.map(i => `<p class="muted" style="margin-top:6px">${i.qty} × ${esc(i.name)}${i.cfg ? ` — ${esc(i.cfg)}` : ''}${i.engraving ? ` — Engraved &ldquo;${esc(i.engraving)}&rdquo;` : ''}${i.ac ? ` — ${esc(i.ac.name)}` : ''}</p>`).join('')}</div>
    <div class="totals" style="max-width:none;padding-top:10px">${totalsHTML(t, { final: true })}</div>
    <label class="checkbox"><input type="checkbox" id="terms"> I agree to the Sales and Refund Policy and Terms and Conditions.</label>
    <p class="msg" id="termsmsg" style="color:var(--red);display:none;font-size:12px">Please accept the terms to continue.</p>
    <button class="btn block" id="place" style="margin-top:18px">${d.pay.type === 'applepay' ? `Pay with ${appleLogo('inline')} Pay` : 'Place Your Order'}</button>`);
  $('#place .apple-logo')?.setAttribute('style', 'width:14px;height:17px;display:inline-block;filter:invert(1)');
  main().onclick = e => {
    if (!e.target.closest('#place')) return;
    if (!$('#terms').checked) { $('#termsmsg').style.display = 'block'; return; }
    const btn = $('#place'); btn.disabled = true; btn.textContent = 'Placing your order…';
    setTimeout(() => placeOrder({ mode: d.mode, ship: d.ship, addr: d.addr, store: d.store, pickup: d.pickup, email: d.email, phone: d.phone, pay: d.pay }), 900);
  };
}

function placeOrder(info) {
  const state = info.mode === 'pickup' ? STORES.find(s => s.id === info.store).city.split(', ')[1] : info.addr.state;
  const fee = info.mode === 'pickup' ? 0 : SHIP_OPTS.find(s => s.id === info.ship).fee;
  const t = Bag.totals(state, fee);
  const no = 'W' + Math.floor(1e9 + Math.random() * 9e9);
  const order = { no, date: Date.now(), items: Bag.items.map(i => ({ ...i })), totals: t, ...info, email: info.email || info.addr?.email, status: 'placed' };
  const orders = store.get('orders', []); orders.unshift(order); store.set('orders', orders);
  Bag.clear(); CO.reset();
  go('/order/' + no);
}

/* ---------- Order status ---------- */
const STAGES = ['Processing', 'Preparing to Ship', 'Shipped', 'Delivered'];
function orderStage(o) {
  if (o.status === 'canceled') return -1;
  const mins = (Date.now() - o.date) / 6e4;
  return mins < 3 ? 0 : mins < 15 ? 1 : mins < 60 ? 2 : 3;
}
route(/^\/order\/(\w+)$/, no => {
  const o = store.get('orders', []).find(x => x.no === no);
  if (!o) return notFound();
  const stg = orderStage(o);
  const fresh = Date.now() - o.date < 6e4;
  const where = o.mode === 'pickup' ? `Pickup at ${STORES.find(s => s.id === o.store).name}` : `${esc(o.addr.street)}, ${esc(o.addr.city)}, ${o.addr.state} ${o.addr.zip}`;
  main().innerHTML = `<section class="confirm"><div class="wrap" style="max-width:760px">
    ${fresh ? `<div class="check">&#x2713;</div><h1 class="h-1">Thank you. Your order has been placed.</h1><p class="sub-sm muted" style="margin-top:10px">We'll send a confirmation email to ${esc(o.email || 'you')} shortly.</p>` : `<h1 class="h-1">Order Details</h1>`}
    <p class="order-no">Order number: <b>${o.no}</b></p><p class="small">Placed ${new Date(o.date).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })}</p>
    <div class="order-card"><p class="status" style="${stg < 0 ? 'color:var(--red)' : ''}">${stg < 0 ? 'Canceled' : STAGES[stg]}</p><p class="muted">${where}</p>
      ${stg >= 0 ? `<div class="progress">${STAGES.map((_, i) => `<i class="${i <= stg ? 'on' : ''}"></i>`).join('')}</div><div style="display:flex;justify-content:space-between" class="small">${STAGES.map(s => `<span>${s}</span>`).join('')}</div>` : ''}
      ${o.items.map(i => `<div class="it" style="display:flex;gap:16px;align-items:center;margin-top:18px"><div style="width:80px">${visual(byId(i.id), i.color)}</div><div style="flex:1"><b>${esc(i.name)}</b><p class="small">${esc(i.cfg)}</p><p class="small">Qty ${i.qty}</p></div><b>${money((i.unit + (i.ac ? i.ac.price : 0)) * i.qty)}</b></div>`).join('')}
      <div class="totals" style="max-width:none">${totalsHTML(o.totals, { final: true })}</div>
      <p class="small">Paid with ${esc(o.pay.label)}</p></div>
    <div class="ctas">${stg === 0 ? '<button class="btn ghost" id="cancel">Cancel Order</button>' : ''}<a class="btn" href="#/account">View All Orders</a><a class="btn ghost" href="#/store">Continue Shopping</a></div>
  </div></section>`;
  $('#cancel')?.addEventListener('click', () => {
    modal(`<h2 class="h-3">Cancel this order?</h2><p class="muted" style="margin:10px 0 24px">Your payment method will not be charged.</p><div class="ctas" style="justify-content:flex-start"><button class="btn" id="cy">Cancel Order</button><button class="btn ghost" data-n>Keep Order</button></div>`, (m, close) => {
      $('#cy', m).onclick = () => { const all = store.get('orders', []); all.find(x => x.no === no).status = 'canceled'; store.set('orders', all); close(); toast('Your order was canceled.'); navigate(); };
      $('[data-n]', m).onclick = close;
    });
  });
  return { title: 'Order Status', crumb: 'Order Status' };
});

/* ---------- Account ---------- */
route(/^\/account$/, () => {
  const user = store.get('user', null);
  if (!user) {
    main().innerHTML = `<section class="section"><div class="wrap" style="max-width:480px;text-align:center"><div style="width:60px;height:72px;margin:0 auto 20px">${appleLogo()}</div><h1 class="h-2">Sign in for faster checkout.</h1><p class="muted" style="margin:12px 0 30px">Sign in to the Apple Store</p>
      <div style="text-align:left"><div class="field"><input id="ae" type="email" placeholder=" "><label>Email or Phone Number</label><p class="msg">Enter a valid email.</p></div>
      <div class="field"><input id="ap1" type="password" placeholder=" "><label>Password</label><p class="msg">At least 8 characters.</p></div>
      <div class="field" id="namef" style="display:none"><input id="an" placeholder=" "><label>First Name</label><p class="msg">Required.</p></div>
      <button class="btn block" id="ago">Sign In</button>
      <p class="center small" style="margin-top:20px">Don't have an Apple Account? <a href="#" id="tog">Create yours now.</a></p></div>
      ${store.get('orders', []).length ? `<p style="margin-top:40px"><a class="more" href="#/order/${store.get('orders')[0].no}">View your most recent guest order</a></p>` : ''}</div></section>`;
    let creating = false;
    $('#tog').onclick = e => { e.preventDefault(); creating = !creating; $('#namef').style.display = creating ? '' : 'none'; $('#ago').textContent = creating ? 'Create Apple Account' : 'Sign In'; e.target.textContent = creating ? 'Sign in instead.' : 'Create yours now.'; };
    $('#ago').onclick = () => {
      const e = $('#ae').value.trim(), okE = /^\S+@\S+\.\S+$/.test(e), okP = $('#ap1').value.length >= 8, okN = !creating || $('#an').value.trim();
      $('#ae').parentElement.classList.toggle('err', !okE); $('#ap1').parentElement.classList.toggle('err', !okP); $('#an').parentElement.classList.toggle('err', !okN);
      if (!okE || !okP || !okN) return;
      store.set('user', { email: e, first: creating ? $('#an').value.trim() : e.split('@')[0].replace(/^\w/, c => c.toUpperCase()) });
      toast(creating ? 'Welcome! Your Apple Account is ready.' : 'Signed in.'); navigate();
    };
    return { title: 'Sign In', crumb: 'Account' };
  }
  const orders = store.get('orders', []);
  const subs = store.get('subs', []);
  main().innerHTML = `<section class="section"><div class="wrap"><h1 class="h-1">Hi, ${esc(user.first)}.</h1><p class="muted" style="margin-top:8px">${esc(user.email)} · <a href="#" id="so">Sign out</a></p>
    <h2 class="h-3" style="margin:50px 0 10px">Your Orders</h2>
    ${orders.length ? orders.map(o => { const s = orderStage(o); return `<a class="order-card" style="display:block;color:inherit" href="#/order/${o.no}"><div style="display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap"><div><p class="status" style="${s < 0 ? 'color:var(--red)' : ''}">${s < 0 ? 'Canceled' : STAGES[s]}</p><p><b>Order ${o.no}</b></p><p class="small">${new Date(o.date).toLocaleDateString('en-US', { dateStyle: 'medium' })} · ${o.items.reduce((a, i) => a + i.qty, 0)} item(s)</p></div><div style="display:flex;gap:10px;align-items:center">${o.items.slice(0, 3).map(i => `<div style="width:60px">${visual(byId(i.id), i.color)}</div>`).join('')}<b>${money(o.totals.total)}</b></div></div></a>`; }).join('') : '<p class="muted">You have no orders yet. <a href="#/store">Start shopping</a></p>'}
    <h2 class="h-3" style="margin:50px 0 10px">Subscriptions</h2>
    ${subs.length ? subs.map(s => `<p style="padding:10px 0;border-bottom:1px solid var(--line)">${esc(s)} <span class="small">· Active · <a href="#/entertainment">Manage</a></span></p>`).join('') : '<p class="muted">No subscriptions. <a href="#/entertainment">Explore services</a></p>'}
  </div></section>`;
  $('#so').onclick = e => { e.preventDefault(); store.set('user', null); toast('Signed out.'); navigate(); };
  return { title: 'Account', crumb: 'Account' };
});
