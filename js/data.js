/* Product catalog for the Apple site recreation.
   Lineup and US prices reflect Apple's store as of late October 2026
   (iPhone 18 Pro + iPhone Duo, Apple Watch Series 12 / Ultra 4, AirPods 5,
   MacBook Neo, M5 MacBook Air / Pro, M4 iPad Air, HomeView, HomePod mini 2). */

const CDN = 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/';
const img = (name, w = 1000) => `${CDN}${name}?wid=${w}&hei=${w}&fmt=png-alpha&.v=1`;
/* A URL ending in #dark is a shot on black; the renderer screen-blends it on dark sections.
   Products whose photos Apple only serves with a baked-in background (watches, HomeView,
   Vision Pro, Mac Studio, Studio Display) have cut-out PNGs in img/ instead. */
const MK = 'https://www.apple.com/v/';

const storage = (base, steps) => ({
  key: 'storage',
  label: 'Storage.',
  sub: 'How much space do you need?',
  choices: steps.map(([label, delta]) => ({ id: label, label, price: delta }))
});

const applecare = (monthly, total, name = 'AppleCare+') => ({
  key: 'applecare',
  label: 'AppleCare coverage.',
  sub: 'Protect your new device.',
  optional: true,
  choices: [
    { id: 'ac', label: `${name}`, desc: `Unlimited repairs for accidental damage, Apple-certified service, and 24/7 priority access to Apple experts.`, price: total, monthly },
    { id: 'none', label: 'No AppleCare coverage', price: 0 }
  ]
});

const PRODUCTS = [
  /* ---------------- iPhone ---------------- */
  {
    id: 'iphone-duo', name: 'iPhone Duo', category: 'iphone', isNew: true,
    tagline: 'Open up to new possibilities.',
    headline: 'Our biggest iPhone display. In our most pocketable design.',
    price: 1999, monthly: 83.29,
    render: 'phone-duo',
    imgs: [img('iphone-duo-finish-select-star-white-202609'), img('iphone-duo-finish-select-night-sky-202609')],
    colors: [
      { name: 'Star White', hex: '#ecebe6', dark: '#cfcdc6' },
      { name: 'Night Sky', hex: '#2b3040', dark: '#151a26' }
    ],
    options: [
      storage(1999, [['256GB', 0], ['512GB', 200], ['1TB', 400], ['2TB', 800]]),
      applecare(13.99, 279, 'AppleCare+ for iPhone Duo')
    ],
    highlights: [
      { k: '7.6"', v: 'Inner display. The largest iPhone screen ever.' },
      { k: '5.4"', v: 'Outer display with 90% of the screen area of iPhone 18 Pro.' },
      { k: 'A20 Pro', v: '2-nanometer chip built for Apple Intelligence.' },
      { k: 'Grade 5', v: 'Titanium, polished to a mirror finish.' }
    ],
    features: [
      { eyebrow: 'Design', title: 'Unfolds into something extraordinary.', text: 'Crafted from grade 5 titanium polished to a mirror finish, iPhone Duo folds flat with a precision-engineered hinge. Closed, it slips into any pocket. Open, the 7.6-inch display gives apps, video, and games room to breathe.' },
      { eyebrow: 'Displays', title: 'Two displays. One seamless experience.', text: 'Start a task on the outer display and open to pick up right where you left off. Apps reflow instantly across the inner display, so multitasking with two apps side by side feels natural.', dark: true },
      { eyebrow: 'Camera', title: '48MP Dual Fusion camera system.', text: 'Shoot with the same pro-grade 48MP Fusion sensors found on iPhone 18 Pro. Prop it half-open and use the outer display as a viewfinder to frame selfies with the rear cameras.' },
      { eyebrow: 'Touch ID', title: 'Secure. Right on the side button.', text: 'Touch ID built into the side button unlocks iPhone Duo whether it is open or closed, and authenticates Apple Pay in a single press.', dark: true }
    ],
    specs: { Display: '7.6" inner, 5.4" outer Super Retina XDR, ProMotion', Chip: 'A20 Pro', Camera: '48MP Dual Fusion system', Build: 'Grade 5 titanium, IP68', Security: 'Touch ID in side button', SIM: 'eSIM only' }
  },
  {
    id: 'iphone-18-pro', name: 'iPhone 18 Pro', category: 'iphone', isNew: true,
    tagline: 'The ultimate pro.',
    headline: 'Variable aperture. All-day power. Pro to the core.',
    price: 1199, monthly: 49.95,
    render: 'phone-pro',
    imgs: [img('iphone-18-pro-finish-select-black-202609'), img('iphone-18-pro-finish-select-silver-202609'), img('iphone-18-pro-finish-select-glacier-202609'), img('iphone-18-pro-finish-select-burgundy-202609')],
    colors: [
      { name: 'Deep Black', hex: '#3a3a3c', dark: '#1d1d1f' },
      { name: 'Silver', hex: '#e3e4e5', dark: '#c4c6c8' },
      { name: 'Glacier', hex: '#b9cddd', dark: '#8fa9be' },
      { name: 'Burgundy', hex: '#6d2a35', dark: '#4a1820' }
    ],
    options: [
      { key: 'model', label: 'Model.', sub: 'Which is best for you?', choices: [
        { id: 'pro', label: 'iPhone 18 Pro', desc: '6.3-inch display', price: 0 },
        { id: 'promax', label: 'iPhone 18 Pro Max', desc: '6.9-inch display', price: 100 }
      ] },
      storage(1199, [['256GB', 0], ['512GB', 200], ['1TB', 400], ['2TB', 800]]),
      applecare(10.99, 219, 'AppleCare+ for iPhone 18 Pro')
    ],
    highlights: [
      { k: 'A20 Pro', v: '2nm chip. Up to 40% faster GPU than A19 Pro.' },
      { k: '48MP', v: 'Fusion Main camera, now with variable aperture.' },
      { k: '8x', v: 'Optical-quality zoom with the 48MP Telephoto.' },
      { k: '2TB', v: 'Storage option, a first for iPhone Pro.' }
    ],
    features: [
      { eyebrow: 'Camera', title: 'Variable aperture. Infinite control.', text: 'The new 48MP Fusion Main camera adjusts its aperture just like a pro camera, so you can dial in a shallow depth of field for portraits or keep everything tack sharp for landscapes.' },
      { eyebrow: 'Performance', title: 'A20 Pro. Two nanometers of pure power.', text: 'A 6-core CPU with two super cores, a 7-core GPU with up to 40 percent faster graphics, a 32-core Neural Engine, and 50 percent more memory bandwidth make this the most capable iPhone ever.', dark: true },
      { eyebrow: 'Battery', title: 'The biggest leap in battery life. Ever.', text: 'Thanks to advancements in Apple silicon and a larger battery, iPhone 18 Pro Max delivers the largest gain in battery life ever on iPhone.' },
      { eyebrow: 'Design', title: 'Color-matched glass. Unibody aluminum.', text: 'Available in deep black, silver, glacier, and burgundy with colour-matched back glass and a heat-forged aluminum unibody that keeps A20 Pro cool under pressure.', dark: true }
    ],
    specs: { Display: '6.3" or 6.9" Super Retina XDR, ProMotion, Always-On', Chip: 'A20 Pro', Camera: '48MP Fusion (variable aperture), 48MP Ultra Wide, 48MP Telephoto 8x', Video: '4K 120 fps Dolby Vision, ProRes RAW', Build: 'Aluminum unibody, Ceramic Shield 2, IP68', Storage: '256GB to 2TB' }
  },
  {
    id: 'iphone-air', name: 'iPhone Air', category: 'iphone',
    tagline: 'The thinnest iPhone ever.',
    headline: 'With the power of pro inside.',
    price: 1099, monthly: 45.79,
    render: 'phone-air',
    imgs: ['spaceblack', 'cloudwhite', 'lightgold', 'skyblue'].map(c => img(`iphone-air-finish-select-${c}-202509`)),
    colors: [
      { name: 'Space Black', hex: '#2f2f31', dark: '#18181a' },
      { name: 'Cloud White', hex: '#f3f2ee', dark: '#dcdad4' },
      { name: 'Light Gold', hex: '#ede0c8', dark: '#cfbf9f' },
      { name: 'Sky Blue', hex: '#d3e3ef', dark: '#a9c3d6' }
    ],
    options: [storage(1099, [['256GB', 0], ['512GB', 200], ['1TB', 400]]), applecare(9.99, 199)],
    highlights: [
      { k: '5.6mm', v: 'Thinnest iPhone ever made.' },
      { k: 'A19 Pro', v: 'Pro-level performance in a featherlight design.' },
      { k: '6.5"', v: 'Super Retina XDR display with ProMotion.' },
      { k: 'Titanium', v: 'Strong, light titanium frame.' }
    ],
    features: [
      { eyebrow: 'Design', title: 'So thin. So strong.', text: 'A polished titanium frame and Ceramic Shield on front and back make iPhone Air remarkably durable for its 5.6mm profile.' },
      { eyebrow: 'Chip', title: 'Pro power. Air light.', text: 'A19 Pro, the N1 wireless chip, and the C1X modem combine to deliver serious performance and efficiency.', dark: true }
    ],
    specs: { Display: '6.5" Super Retina XDR, ProMotion', Chip: 'A19 Pro', Camera: '48MP Fusion', Build: 'Titanium, Ceramic Shield 2' }
  },
  {
    id: 'iphone-17', name: 'iPhone 17', category: 'iphone',
    tagline: 'Magichromatic.',
    headline: 'ProMotion, Center Stage, and an even more durable design.',
    price: 899, monthly: 37.45,
    render: 'phone-17',
    imgs: ['black', 'white', 'mistblue', 'sage', 'lavender'].map(c => img(`iphone-17-finish-select-${c}-202509`)),
    colors: [
      { name: 'Black', hex: '#3b3b3d', dark: '#232325' },
      { name: 'White', hex: '#f5f5f0', dark: '#dfdfd9' },
      { name: 'Mist Blue', hex: '#9fb6cc', dark: '#7b93ab' },
      { name: 'Sage', hex: '#a9b49b', dark: '#86917a' },
      { name: 'Lavender', hex: '#d4c5e4', dark: '#b3a2c7' }
    ],
    options: [storage(899, [['256GB', 0], ['512GB', 200]]), applecare(8.49, 169)],
    highlights: [
      { k: '6.3"', v: 'ProMotion display up to 120Hz with Always-On.' },
      { k: '48MP', v: 'Dual Fusion camera system.' },
      { k: '18MP', v: 'Center Stage front camera.' },
      { k: 'A19', v: 'Built for Apple Intelligence.' }
    ],
    features: [
      { eyebrow: 'Display', title: 'ProMotion. Now on iPhone 17.', text: 'The 6.3-inch display refreshes up to 120Hz for silky scrolling and is Always-On.' },
      { eyebrow: 'Camera', title: 'Center Stage selfies.', text: 'The new square sensor lets you take landscape selfies while holding iPhone upright.', dark: true }
    ],
    specs: { Display: '6.3" Super Retina XDR, ProMotion', Chip: 'A19', Camera: '48MP Dual Fusion', Front: '18MP Center Stage' }
  },
  {
    id: 'iphone-17e', name: 'iPhone 17e', category: 'iphone',
    tagline: 'Do it all. For less.',
    headline: 'Apple Intelligence, A19, and all-day battery life.',
    price: 699, monthly: 29.12,
    render: 'phone-e',
    imgs: [img('iphone-17e-finish-select-black-202603'), img('iphone-17e-finish-select-white-202603'), img('iphone-17e-finish-select-softpink-202603')],
    colors: [
      { name: 'Black', hex: '#2e2e30', dark: '#19191b' },
      { name: 'White', hex: '#f4f4f1', dark: '#dddcd7' },
      { name: 'Soft Pink', hex: '#f1d6d6', dark: '#d8b5b5' }
    ],
    options: [storage(699, [['256GB', 0], ['512GB', 200]]), applecare(6.49, 129)],
    highlights: [
      { k: 'A19', v: 'Fast, efficient, built for Apple Intelligence.' },
      { k: '48MP', v: '2-in-1 Fusion camera.' },
      { k: 'MagSafe', v: 'Fast wireless charging.' },
      { k: 'C1X', v: 'Apple-designed modem.' }
    ],
    features: [
      { eyebrow: 'Value', title: 'Everything you need.', text: 'iPhone 17e brings the essentials of iPhone together at an incredible value.' }
    ],
    specs: { Display: '6.1" Super Retina XDR', Chip: 'A19', Camera: '48MP Fusion' }
  },
  {
    id: 'iphone-16', name: 'iPhone 16', category: 'iphone',
    tagline: 'Amazing performance.',
    headline: 'Camera Control. A18. Built for Apple Intelligence.',
    price: 799, monthly: 33.29,
    render: 'phone-16',
    imgs: ['ultramarine', 'teal', 'pink', 'white', 'black'].map(c => img(`iphone-16-${c}-select-202409`)),
    colors: [
      { name: 'Ultramarine', hex: '#8b98f0', dark: '#6170d6' },
      { name: 'Teal', hex: '#a7cfc9', dark: '#7fb0a8' },
      { name: 'Pink', hex: '#f3c5d6', dark: '#e0a3bb' },
      { name: 'White', hex: '#f7f7f5', dark: '#e2e2de' },
      { name: 'Black', hex: '#3c3d3f', dark: '#222326' }
    ],
    options: [
      { key: 'model', label: 'Model.', sub: 'Which is best for you?', choices: [
        { id: '16', label: 'iPhone 16', desc: '6.1-inch display', price: 0 },
        { id: '16plus', label: 'iPhone 16 Plus', desc: '6.7-inch display', price: 100 }
      ] },
      storage(799, [['128GB', 0], ['256GB', 100], ['512GB', 300]]), applecare(7.99, 159)
    ],
    highlights: [{ k: 'A18', v: 'Built for Apple Intelligence.' }, { k: 'Camera Control', v: 'Instant access to your camera.' }],
    features: [{ eyebrow: 'Camera Control', title: 'A new way to capture.', text: 'Slide your finger to adjust zoom, exposure, and depth of field.' }],
    specs: { Display: '6.1" or 6.7" Super Retina XDR', Chip: 'A18', Camera: '48MP Fusion + 12MP Ultra Wide' }
  },

  /* ---------------- Mac ---------------- */
  {
    id: 'macbook-neo', name: 'MacBook Neo', category: 'mac', isNew: false,
    tagline: 'Hello, Neo.',
    headline: 'A real Mac. At a breakthrough price.',
    price: 699, monthly: 58.25, monthlyTerm: 12,
    render: 'laptop-neo',
    imgs: [img('macbook-neo-citrus-cto-hero-202603'), img('macbook-neo-indigo-cto-hero-202603'), img('macbook-neo-blush-cto-hero-202603'), img('macbook-neo-silver-cto-hero-202603')],
    colors: [
      { name: 'Citrus', hex: '#e8e3a0', dark: '#c9c371' },
      { name: 'Indigo', hex: '#4a5683', dark: '#323c63' },
      { name: 'Blush', hex: '#f0cfc8', dark: '#d8aea5' },
      { name: 'Silver', hex: '#e3e4e5', dark: '#c4c6c8' }
    ],
    options: [
      { key: 'storage', label: 'Storage.', sub: 'Touch ID comes standard with 512GB.', choices: [
        { id: '256GB', label: '256GB SSD', desc: '8GB unified memory', price: 0 },
        { id: '512GB', label: '512GB SSD', desc: '8GB unified memory, Touch ID', price: 100 }
      ] },
      applecare(4.99, 99, 'AppleCare+ for Mac')
    ],
    highlights: [
      { k: '$699', v: 'The most affordable Mac laptop ever.' },
      { k: 'A18 Pro', v: '6-core CPU, 5-core GPU, 16-core Neural Engine.' },
      { k: '16 hrs', v: 'Up to 16 hours of video streaming.' },
      { k: '4 colors', v: 'Citrus, indigo, blush, and silver.' }
    ],
    features: [
      { eyebrow: 'Design', title: 'Color that pops.', text: 'A durable aluminum enclosure in four fresh finishes, with a 13-inch Liquid Retina display, two USB-C ports, and a headphone jack.' },
      { eyebrow: 'Performance', title: 'Powered by A18 Pro.', text: 'The same chip that powers iPhone 16 Pro brings snappy performance and incredible efficiency to macOS 27 and Apple Intelligence.', dark: true }
    ],
    specs: { Display: '13" Liquid Retina, 2408 x 1506', Chip: 'A18 Pro', Memory: '8GB unified memory', Battery: 'Up to 16 hours', Ports: '2x USB-C, 3.5mm headphone jack', Camera: '1080p FaceTime HD' }
  },
  {
    id: 'macbook-air', name: 'MacBook Air', category: 'mac',
    tagline: 'Sky blue. Sky high.',
    headline: 'Now supercharged by M5.',
    price: 1299, monthly: 108.25, monthlyTerm: 12,
    render: 'laptop-air',
    imgs: [img('mba13-skyblue-select-202503'), img('mba13-silver-select-202503'), img('mba13-starlight-select-202503'), img('mba13-midnight-select-202503')],
    colors: [
      { name: 'Sky Blue', hex: '#c6d5e0', dark: '#9fb3c3' },
      { name: 'Silver', hex: '#e3e4e5', dark: '#c4c6c8' },
      { name: 'Starlight', hex: '#efe6d8', dark: '#d6c9b3' },
      { name: 'Midnight', hex: '#2e3641', dark: '#1a2029' }
    ],
    options: [
      { key: 'model', label: 'Size.', sub: 'Which is best for you?', choices: [
        { id: '13', label: '13-inch', desc: 'M5 chip, 10-core CPU, 8-core GPU', price: 0 },
        { id: '15', label: '15-inch', desc: 'M5 chip, 10-core CPU, 10-core GPU', price: 200 }
      ] },
      { key: 'memory', label: 'Memory.', sub: 'Unified memory', choices: [
        { id: '16GB', label: '16GB', price: 0 }, { id: '24GB', label: '24GB', price: 200 }, { id: '32GB', label: '32GB', price: 400 }
      ] },
      storage(1299, [['512GB SSD', 0], ['1TB SSD', 200], ['2TB SSD', 600]]),
      applecare(5.99, 179, 'AppleCare+ for Mac')
    ],
    highlights: [
      { k: 'M5', v: 'Up to 4x faster AI performance than M4.' },
      { k: '18 hrs', v: 'All-day battery life.' },
      { k: '1.13 cm', v: 'Strikingly thin and light.' },
      { k: '12MP', v: 'Center Stage camera.' }
    ],
    features: [
      { eyebrow: 'Chip', title: 'M5. Made for Apple Intelligence.', text: 'With a Neural Accelerator in every GPU core, M5 makes on-device AI tasks dramatically faster.' },
      { eyebrow: 'Battery', title: 'Goes all day. And then some.', text: 'Up to 18 hours of battery life lets you leave the charger at home.', dark: true }
    ],
    specs: { Display: '13.6" or 15.3" Liquid Retina', Chip: 'Apple M5', Memory: '16GB to 32GB', Battery: 'Up to 18 hours' }
  },
  {
    id: 'macbook-pro', name: 'MacBook Pro', category: 'mac',
    tagline: 'A work of smart.',
    headline: 'M5, M5 Pro, and M5 Max. Pro performance, unleashed.',
    price: 1999, monthly: 166.58, monthlyTerm: 12,
    render: 'laptop-pro',
    imgs: [img('mbp16-spaceblack-cto-hero-202410'), img('mbp16-silver-cto-hero-202410')],
    colors: [
      { name: 'Space Black', hex: '#2e2e30', dark: '#18181a' },
      { name: 'Silver', hex: '#e3e4e5', dark: '#c4c6c8' }
    ],
    options: [
      { key: 'model', label: 'Size and chip.', sub: 'Which is best for you?', choices: [
        { id: '14m5', label: '14-inch · M5', desc: '10-core CPU, 10-core GPU, 16GB', price: 0 },
        { id: '14m5pro', label: '14-inch · M5 Pro', desc: '14-core CPU, 20-core GPU, 24GB', price: 500 },
        { id: '16m5pro', label: '16-inch · M5 Pro', desc: '14-core CPU, 20-core GPU, 24GB', price: 1000 },
        { id: '16m5max', label: '16-inch · M5 Max', desc: '16-core CPU, 40-core GPU, 48GB', price: 2400 }
      ] },
      storage(1999, [['1TB SSD', 0], ['2TB SSD', 400], ['4TB SSD', 1000], ['8TB SSD', 2200]]),
      { key: 'display', label: 'Display.', sub: 'Nano-texture glass reduces glare.', choices: [
        { id: 'std', label: 'Standard display', price: 0 }, { id: 'nano', label: 'Nano-texture display', price: 150 }
      ] },
      applecare(9.99, 279, 'AppleCare+ for Mac')
    ],
    highlights: [
      { k: '24 hrs', v: 'Longest battery life ever in a Mac.' },
      { k: 'M5 Max', v: 'Up to 40-core GPU with Neural Accelerators.' },
      { k: 'XDR', v: 'Liquid Retina XDR, 1600 nits peak HDR.' },
      { k: 'Thunderbolt 5', v: 'On M5 Pro and M5 Max models.' }
    ],
    features: [
      { eyebrow: 'Performance', title: 'Leaps and bounds.', text: 'M5 Pro and M5 Max deliver breakthrough performance for rendering, compiling, and running local large language models.', dark: true },
      { eyebrow: 'Display', title: 'The world\'s best laptop display.', text: 'Liquid Retina XDR with up to 1000 nits SDR brightness and 1600 nits peak HDR, plus an optional nano-texture finish.' }
    ],
    specs: { Display: '14.2" or 16.2" Liquid Retina XDR', Chip: 'M5, M5 Pro, or M5 Max', Memory: 'Up to 128GB', Battery: 'Up to 24 hours' }
  },
  {
    id: 'imac', name: 'iMac', category: 'mac',
    tagline: 'Say hello to the new iMac.',
    headline: 'Seven bold colors. Supercharged by M4.',
    price: 1299, monthly: 108.25, monthlyTerm: 12,
    render: 'imac',
    imgs: ['blue', 'purple', 'pink', 'orange', 'yellow', 'green', 'silver'].map(c => img(`imac-${c}-selection-hero-202410`)),
    colors: [
      { name: 'Blue', hex: '#9db8d6', dark: '#4b6f9a' },
      { name: 'Purple', hex: '#c3b5dc', dark: '#7b67a8' },
      { name: 'Pink', hex: '#efc0c9', dark: '#d06f86' },
      { name: 'Orange', hex: '#f3c6a5', dark: '#e0794a' },
      { name: 'Yellow', hex: '#f4dd9a', dark: '#e2b23a' },
      { name: 'Green', hex: '#b3d1bd', dark: '#4e8a64' },
      { name: 'Silver', hex: '#e3e4e5', dark: '#a9abae' }
    ],
    options: [
      { key: 'model', label: 'Chip.', choices: [
        { id: '8', label: 'M4 · 8-core CPU, 8-core GPU', desc: 'Two Thunderbolt ports', price: 0 },
        { id: '10', label: 'M4 · 10-core CPU, 10-core GPU', desc: 'Four Thunderbolt 4 ports', price: 200 }
      ] },
      storage(1299, [['256GB SSD', 0], ['512GB SSD', 200], ['1TB SSD', 400]]),
      applecare(4.99, 169, 'AppleCare+ for Mac')
    ],
    highlights: [{ k: '24"', v: '4.5K Retina display.' }, { k: 'M4', v: 'Built for Apple Intelligence.' }],
    features: [{ eyebrow: 'Design', title: 'Colors that bring joy.', text: 'iMac is just 11.5 mm thin and comes in seven vibrant colors with color-matched accessories.' }],
    specs: { Display: '24" 4.5K Retina', Chip: 'Apple M4', Camera: '12MP Center Stage' }
  },
  {
    id: 'mac-mini', name: 'Mac mini', category: 'mac',
    tagline: 'Size down. Power up.',
    headline: 'Five by five inches. Mighty M4 and M4 Pro.',
    price: 799, monthly: 66.58, monthlyTerm: 12,
    render: 'mac-mini',
    imgs: [img('mac-mini-hero-202410')],
    colors: [{ name: 'Silver', hex: '#e3e4e5', dark: '#c4c6c8' }],
    options: [
      { key: 'model', label: 'Chip.', choices: [
        { id: 'm4', label: 'M4 · 10-core CPU, 10-core GPU', desc: '16GB unified memory', price: 0 },
        { id: 'm4pro', label: 'M4 Pro · 12-core CPU, 16-core GPU', desc: '24GB unified memory, Thunderbolt 5', price: 600 }
      ] },
      storage(799, [['256GB SSD', 0], ['512GB SSD', 200], ['1TB SSD', 400], ['2TB SSD', 800]]),
      applecare(3.49, 99, 'AppleCare+ for Mac')
    ],
    highlights: [{ k: '5x5"', v: 'Tiny footprint.' }, { k: 'M4 Pro', v: 'Thunderbolt 5 connectivity.' }],
    features: [{ eyebrow: 'Design', title: 'Small wonder.', text: 'An all-new five-by-five-inch design with front-facing ports.' }],
    specs: { Chip: 'M4 or M4 Pro', Ports: 'Front USB-C + headphone jack, rear Thunderbolt' }
  },
  {
    id: 'mac-studio', name: 'Mac Studio', category: 'mac',
    tagline: 'Thrives under pressure.',
    headline: 'M4 Max and M3 Ultra. The ultimate pro desktop.',
    price: 2499, monthly: 208.25, monthlyTerm: 12,
    render: 'mac-studio',
    imgs: ['img/mac-studio.png'],
    colors: [{ name: 'Silver', hex: '#e3e4e5', dark: '#c4c6c8' }],
    options: [
      { key: 'model', label: 'Chip.', choices: [
        { id: 'm4max', label: 'M4 Max · 14-core CPU, 32-core GPU', desc: '36GB unified memory', price: 0 },
        { id: 'm3ultra', label: 'M3 Ultra · 28-core CPU, 60-core GPU', desc: '96GB unified memory', price: 1500 }
      ] },
      storage(2499, [['512GB SSD', 0], ['1TB SSD', 200], ['2TB SSD', 600], ['4TB SSD', 1200]]),
      applecare(5.99, 169, 'AppleCare+ for Mac')
    ],
    highlights: [{ k: '512GB', v: 'Up to 512GB unified memory with M3 Ultra.' }],
    features: [{ eyebrow: 'Performance', title: 'Ultra powerful.', text: 'Run LLMs with over 600 billion parameters entirely in memory.', dark: true }],
    specs: { Chip: 'M4 Max or M3 Ultra', Memory: 'Up to 512GB' }
  },
  {
    id: 'studio-display', name: 'Studio Display', category: 'mac',
    tagline: 'A sight to behold.',
    headline: '27-inch 5K Retina. Center Stage camera. Studio-quality mics.',
    price: 1599, monthly: 133.25, monthlyTerm: 12,
    render: 'display',
    imgs: ['img/studio-display.png'],
    colors: [{ name: 'Silver', hex: '#e3e4e5', dark: '#c4c6c8' }],
    options: [
      { key: 'glass', label: 'Glass.', choices: [{ id: 'std', label: 'Standard glass', price: 0 }, { id: 'nano', label: 'Nano-texture glass', price: 300 }] },
      { key: 'stand', label: 'Stand.', choices: [{ id: 'tilt', label: 'Tilt-adjustable stand', price: 0 }, { id: 'height', label: 'Tilt- and height-adjustable stand', price: 400 }, { id: 'vesa', label: 'VESA mount adapter', price: 0 }] }
    ],
    highlights: [{ k: '5K', v: '27-inch Retina display.' }],
    features: [{ eyebrow: 'Display', title: 'Pure brilliance.', text: '600 nits of brightness, P3 wide color, and True Tone.' }],
    specs: { Display: '27" 5K Retina' }
  },

  /* ---------------- iPad ---------------- */
  {
    id: 'ipad-pro', name: 'iPad Pro', category: 'ipad',
    tagline: 'Advanced AI performance and game-changing capabilities.',
    headline: 'Impossibly thin. Supercharged by M5.',
    price: 1199, monthly: 99.91, monthlyTerm: 12,
    render: 'tablet-pro',
    imgs: [img('ipad-pro-11-select-wifi-spaceblack-202405'), img('ipad-pro-11-select-wifi-silver-202405')],
    colors: [{ name: 'Space Black', hex: '#2e2e30', dark: '#18181a' }, { name: 'Silver', hex: '#e3e4e5', dark: '#c4c6c8' }],
    options: [
      { key: 'model', label: 'Model.', choices: [{ id: '11', label: 'iPad Pro 11-inch', price: 0 }, { id: '13', label: 'iPad Pro 13-inch', price: 300 }] },
      storage(1199, [['256GB', 0], ['512GB', 200], ['1TB', 600], ['2TB', 1000]]),
      { key: 'conn', label: 'Connectivity.', choices: [{ id: 'wifi', label: 'Wi-Fi', price: 0 }, { id: 'cell', label: 'Wi-Fi + Cellular', price: 200 }] },
      applecare(8.99, 179, 'AppleCare+ for iPad')
    ],
    highlights: [{ k: 'M5', v: 'Up to 3.5x the AI performance of M4.' }, { k: 'Tandem OLED', v: 'Ultra Retina XDR display.' }],
    features: [{ eyebrow: 'Display', title: 'Ultra Retina XDR.', text: 'Tandem OLED for extreme brightness and precise contrast.', dark: true }],
    specs: { Display: '11" or 13" Ultra Retina XDR', Chip: 'Apple M5' }
  },
  {
    id: 'ipad-air', name: 'iPad Air', category: 'ipad',
    tagline: 'Now supercharged by M4.',
    headline: 'Serious performance in a thin and light design.',
    price: 749, monthly: 62.41, monthlyTerm: 12,
    render: 'tablet-air',
    imgs: ['spacegray', 'blue', 'purple', 'starlight'].map(c => img(`ipad-air-select-11in-wifi-${c}-202405`)),
    colors: [
      { name: 'Space Gray', hex: '#7d7e80', dark: '#5c5d60' },
      { name: 'Blue', hex: '#a9bfd6', dark: '#7f9ab8' },
      { name: 'Purple', hex: '#cdc2dd', dark: '#a597bd' },
      { name: 'Starlight', hex: '#efe6d8', dark: '#d6c9b3' }
    ],
    options: [
      { key: 'model', label: 'Model.', choices: [{ id: '11', label: 'iPad Air 11-inch', price: 0 }, { id: '13', label: 'iPad Air 13-inch', price: 200 }] },
      storage(749, [['128GB', 0], ['256GB', 100], ['512GB', 300], ['1TB', 500]]),
      { key: 'conn', label: 'Connectivity.', choices: [{ id: 'wifi', label: 'Wi-Fi', price: 0 }, { id: 'cell', label: 'Wi-Fi + Cellular', price: 150 }] },
      applecare(3.99, 79, 'AppleCare+ for iPad')
    ],
    highlights: [{ k: 'M4', v: 'Up to 30% faster than iPad Air with M3.' }],
    features: [{ eyebrow: 'Chip', title: 'M4 makes it fly.', text: 'Pro-level speed for editing, gaming, and Apple Intelligence.' }],
    specs: { Display: '11" or 13" Liquid Retina', Chip: 'Apple M4' }
  },
  {
    id: 'ipad', name: 'iPad', category: 'ipad',
    tagline: 'Lovable. Drawable. Magical.',
    headline: 'Now with the A16 chip and double the storage.',
    price: 449, monthly: 37.41, monthlyTerm: 12,
    render: 'tablet',
    imgs: ['blue', 'pink', 'yellow', 'silver'].map(c => img(`ipad-2022-hero-${c}-wifi-select`)),
    colors: [
      { name: 'Blue', hex: '#a6c4e0', dark: '#7aa1c6' },
      { name: 'Pink', hex: '#f2c4cf', dark: '#dc9caf' },
      { name: 'Yellow', hex: '#f5e39b', dark: '#e1c763' },
      { name: 'Silver', hex: '#e3e4e5', dark: '#c4c6c8' }
    ],
    options: [
      storage(449, [['128GB', 0], ['256GB', 100], ['512GB', 300]]),
      { key: 'conn', label: 'Connectivity.', choices: [{ id: 'wifi', label: 'Wi-Fi', price: 0 }, { id: 'cell', label: 'Wi-Fi + Cellular', price: 150 }] },
      applecare(3.49, 69, 'AppleCare+ for iPad')
    ],
    highlights: [{ k: 'A16', v: 'Fast and efficient.' }],
    features: [{ eyebrow: 'Fun', title: 'Four fun colors.', text: 'Blue, pink, yellow, and silver.' }],
    specs: { Display: '11" Liquid Retina', Chip: 'A16' }
  },
  {
    id: 'ipad-mini', name: 'iPad mini', category: 'ipad',
    tagline: 'Mega power. Mini sized.',
    headline: 'A17 Pro in an ultraportable design.',
    price: 599, monthly: 49.91, monthlyTerm: 12,
    render: 'tablet-mini',
    imgs: [img('ipad-mini-select-wifi-blue-202410')],
    colors: [
      { name: 'Space Gray', hex: '#7d7e80', dark: '#5c5d60' },
      { name: 'Blue', hex: '#b5c3d3', dark: '#8a9db3' },
      { name: 'Purple', hex: '#d2c8de', dark: '#ab9ec1' },
      { name: 'Starlight', hex: '#efe6d8', dark: '#d6c9b3' }
    ],
    options: [
      storage(599, [['128GB', 0], ['256GB', 100], ['512GB', 300]]),
      { key: 'conn', label: 'Connectivity.', choices: [{ id: 'wifi', label: 'Wi-Fi', price: 0 }, { id: 'cell', label: 'Wi-Fi + Cellular', price: 150 }] },
      applecare(3.49, 69, 'AppleCare+ for iPad')
    ],
    highlights: [{ k: '8.3"', v: 'Liquid Retina display.' }],
    features: [{ eyebrow: 'Portable', title: 'Fits in one hand.', text: 'Apple Pencil Pro support in an incredibly portable design.' }],
    specs: { Display: '8.3" Liquid Retina', Chip: 'A17 Pro' }
  },

  /* ---------------- Watch ---------------- */
  {
    id: 'watch-series-12', name: 'Apple Watch Series 12', category: 'watch', isNew: true,
    tagline: 'Smarter. Brighter. Mightier.',
    headline: 'The ultimate way to watch your health.',
    price: 399, monthly: 33.25, monthlyTerm: 12,
    render: 'watch',
    imgs: ['img/watch-series-12.png'],
    colors: [
      { name: 'Dark Bronze', hex: '#7a6248', dark: '#4f3e2c' },
      { name: 'Jet Black', hex: '#1e1e20', dark: '#0e0e10' },
      { name: 'Light Gold', hex: '#e6d3b3', dark: '#c4ad87' },
      { name: 'Space Gray', hex: '#5d5e62', dark: '#3e3f42' }
    ],
    options: [
      { key: 'size', label: 'Case size.', choices: [{ id: '42', label: '42mm', desc: 'Fits 130–200mm wrists', price: 0 }, { id: '46', label: '46mm', desc: 'Fits 140–245mm wrists', price: 50 }] },
      { key: 'conn', label: 'Connectivity.', choices: [{ id: 'gps', label: 'GPS', price: 0 }, { id: 'cell', label: 'GPS + Cellular', price: 100 }] },
      { key: 'band', label: 'Band.', choices: [{ id: 'sport', label: 'Sport Band', desc: 'Fluoroelastomer', price: 0 }, { id: 'loop', label: 'Sport Loop', desc: 'Soft, breathable nylon weave', price: 0 }, { id: 'milanese', label: 'Milanese Loop', desc: 'Stainless steel mesh', price: 50 }] },
      applecare(2.99, 79, 'AppleCare+ for Apple Watch')
    ],
    highlights: [{ k: '24 hrs', v: 'All-day battery life.' }, { k: 'Sleep Score', v: 'Understand your sleep.' }],
    features: [{ eyebrow: 'Health', title: 'Know more about your body.', text: 'Hypertension notifications, Sleep Score, ECG, and blood oxygen.' }],
    specs: { Case: '42mm or 46mm aluminum', Display: 'Always-On Retina, LTPO3', Chip: 'S11 SiP' }
  },
  {
    id: 'watch-ultra-4', name: 'Apple Watch Ultra 4', category: 'watch', isNew: true,
    tagline: 'Adventure awaits.',
    headline: 'Up to 50 hours of battery. Satellite connectivity.',
    price: 799, monthly: 66.58, monthlyTerm: 12,
    render: 'watch-ultra',
    imgs: ['img/watch-ultra-4.png'],
    colors: [{ name: 'Natural Titanium', hex: '#c9c4bc', dark: '#a39e95' }, { name: 'Black Titanium', hex: '#2b2b2d', dark: '#141416' }],
    options: [
      { key: 'band', label: 'Band.', choices: [{ id: 'trail', label: 'Trail Loop', price: 0 }, { id: 'alpine', label: 'Alpine Loop', price: 0 }, { id: 'ocean', label: 'Ocean Band', price: 0 }, { id: 'milanese', label: 'Titanium Milanese Loop', price: 200 }] },
      applecare(4.99, 99, 'AppleCare+ for Apple Watch Ultra')
    ],
    highlights: [{ k: '50 hrs', v: 'Up to 50 hours of battery life.' }, { k: '3000 nits', v: 'Brightest Apple display ever.' }],
    features: [{ eyebrow: 'Endurance', title: 'Goes the distance.', text: 'Up to 50 hours on a single charge, or up to 84 hours in Low Power Mode.', dark: true }],
    specs: { Case: '49mm titanium', Battery: 'Up to 50 hours', Connectivity: 'GPS + Cellular + Satellite' }
  },
  {
    id: 'watch-se-3', name: 'Apple Watch SE 3', category: 'watch',
    tagline: 'Major powers. Minor price.',
    headline: 'Always-On display and sleep tracking.',
    price: 249, monthly: 20.75, monthlyTerm: 12,
    render: 'watch-se',
    imgs: ['img/watch-se-3.png'],
    colors: [{ name: 'Starlight', hex: '#efe6d8', dark: '#d6c9b3' }, { name: 'Midnight', hex: '#2e3641', dark: '#1a2029' }],
    options: [
      { key: 'size', label: 'Case size.', choices: [{ id: '40', label: '40mm', price: 0 }, { id: '44', label: '44mm', price: 30 }] },
      { key: 'conn', label: 'Connectivity.', choices: [{ id: 'gps', label: 'GPS', price: 0 }, { id: 'cell', label: 'GPS + Cellular', price: 50 }] },
      applecare(2.49, 49, 'AppleCare+ for Apple Watch')
    ],
    highlights: [{ k: 'S10', v: 'Fast chip.' }],
    features: [{ eyebrow: 'Value', title: 'All the essentials.', text: 'Crash Detection, Fall Detection, and Sleep Score.' }],
    specs: { Case: '40mm or 44mm aluminum', Chip: 'S10 SiP' }
  },

  /* ---------------- AirPods ---------------- */
  {
    id: 'airpods-5', name: 'AirPods 5', category: 'airpods', isNew: true,
    tagline: 'Iconic. Now supersonic.',
    headline: 'Personalized Spatial Audio, longer battery, and a smaller case.',
    price: 129, monthly: 21.50, monthlyTerm: 6,
    render: 'airpods',
    imgs: [img('airpods-5-hero-select-202609')],
    colors: [{ name: 'White', hex: '#f5f5f7', dark: '#dcdcdf' }],
    options: [
      { key: 'model', label: 'Model.', choices: [
        { id: 'std', label: 'AirPods 5', desc: 'USB-C charging case', price: 0 },
        { id: 'plus', label: 'AirPods 5 with Wireless Charging Case', desc: 'On-stem volume controls, MagSafe and Qi2', price: 20 }
      ] },
      { key: 'engrave', label: 'Engraving.', sub: 'Add a personal touch. Free.', engraving: true, choices: [{ id: 'none', label: 'No engraving', price: 0 }, { id: 'yes', label: 'Add engraving', price: 0 }] }
    ],
    highlights: [{ k: 'H3', v: 'All-new chip for clearer calls.' }, { k: '30 hrs', v: 'Total listening time with case.' }],
    features: [{ eyebrow: 'Sound', title: 'Sound that surrounds you.', text: 'Personalized Spatial Audio with dynamic head tracking.' }],
    specs: { Chip: 'H3', Battery: 'Up to 30 hours with case', Resistance: 'IP54' }
  },
  {
    id: 'airpods-pro-3', name: 'AirPods Pro 3', category: 'airpods',
    tagline: 'The world\'s best in-ear Active Noise Cancellation.',
    headline: 'Heart rate sensing. Live Translation. Hearing Health.',
    price: 249, monthly: 41.50, monthlyTerm: 6,
    render: 'airpods-pro',
    imgs: [img('airpods-pro-3-hero-select-202509')],
    colors: [{ name: 'White', hex: '#f5f5f7', dark: '#dcdcdf' }],
    options: [
      { key: 'engrave', label: 'Engraving.', sub: 'Add a personal touch. Free.', engraving: true, choices: [{ id: 'none', label: 'No engraving', price: 0 }, { id: 'yes', label: 'Add engraving', price: 0 }] },
      applecare(1.49, 29, 'AppleCare+ for Headphones')
    ],
    highlights: [{ k: '2x', v: 'More noise cancellation than AirPods Pro 2.' }, { k: 'Heart', v: 'Heart rate sensing during workouts.' }],
    features: [{ eyebrow: 'ANC', title: 'Silence, perfected.', text: 'Up to 2x more noise cancellation than AirPods Pro 2.', dark: true }],
    specs: { Chip: 'H2', Battery: 'Up to 8 hours with ANC', Resistance: 'IP57' }
  },
  {
    id: 'airpods-max', name: 'AirPods Max 2', category: 'airpods',
    tagline: 'Pure luxury.',
    headline: 'High-fidelity audio and Lossless over USB-C.',
    price: 549, monthly: 91.50, monthlyTerm: 6,
    render: 'airpods-max',
    imgs: [img('airpods-max-select-202409-midnight')],
    colors: [
      { name: 'Midnight', hex: '#3a3f4a', dark: '#24282f' },
      { name: 'Starlight', hex: '#ece3d5', dark: '#cfc3b0' },
      { name: 'Blue', hex: '#a5bfd6', dark: '#7d9bb7' },
      { name: 'Purple', hex: '#c9bedb', dark: '#a597bd' },
      { name: 'Orange', hex: '#f0b98f', dark: '#d9915c' }
    ],
    options: [applecare(1.99, 39, 'AppleCare+ for Headphones')],
    highlights: [{ k: 'Lossless', v: '24-bit/48kHz lossless audio via USB-C.' }],
    features: [{ eyebrow: 'Sound', title: 'Computational audio.', text: 'Custom-built drivers and the H2 chip deliver breathtaking sound.' }],
    specs: { Chip: 'H2', Battery: 'Up to 20 hours' }
  },

  /* ---------------- TV & Home ---------------- */
  {
    id: 'homeview', name: 'HomeView', category: 'tv-home', isNew: true,
    tagline: 'Your home. In view.',
    headline: 'A new way to enjoy entertainment and manage the home.',
    price: 299, monthly: 24.91, monthlyTerm: 12,
    render: 'homeview',
    imgs: ['img/homeview-silver.png', 'img/homeview-space-gray.png', 'img/homeview-starlight.png', 'img/homeview-pink.png'],
    colors: [{ name: 'Silver', hex: '#d9dadc', dark: '#b4b6b9' }, { name: 'Space Gray', hex: '#6e6e73', dark: '#4a4a4e' }, { name: 'Starlight', hex: '#efe6d8', dark: '#d6c9b3' }, { name: 'Pink', hex: '#f1c8c6', dark: '#d9a5a3' }],
    options: [applecare(1.99, 39, 'AppleCare+ for HomeView')],
    highlights: [{ k: '7"', v: 'Display with a built-in speaker base.' }, { k: 'Siri AI', v: 'Ask about anything in your home.' }],
    features: [{ eyebrow: 'Home', title: 'Control center for your home.', text: 'See cameras, adjust lights, FaceTime family, and play music, all from a 7-inch display.' }],
    specs: { Display: '7" Retina', Audio: 'Full-range speaker base' }
  },
  {
    id: 'homepod-mini', name: 'HomePod mini', category: 'tv-home', isNew: true,
    tagline: 'Big sound. Little glow.',
    headline: 'Four-speaker surround sound and Sound Glow.',
    price: 149, monthly: 12.41, monthlyTerm: 12,
    render: 'homepod-mini',
    imgs: ['white', 'midnight', 'blue', 'green', 'pink'].map(c => img(`homepod-mini-select-${c}-202610`)),
    colors: [
      { name: 'White', hex: '#f1f1f1', dark: '#d9d9d9' },
      { name: 'Midnight', hex: '#3a3d45', dark: '#232529' },
      { name: 'Blue', hex: '#3d6fa6', dark: '#2a5280' },
      { name: 'Green', hex: '#6f8f5a', dark: '#4f6b3f' },
      { name: 'Pink', hex: '#e9a8b4', dark: '#c98592' }
    ],
    options: [applecare(0.99, 15, 'AppleCare+ for HomePod mini')],
    highlights: [{ k: '$149', v: 'Room-filling sound.' }],
    features: [{ eyebrow: 'Audio', title: 'Surprisingly big sound.', text: 'A new four-speaker array fills the room. Siri AI arrives in a future update.' }],
    specs: { Audio: 'Four-speaker array', Chip: 'S9' }
  },
  {
    id: 'homepod', name: 'HomePod', category: 'tv-home',
    tagline: 'Profound sound.',
    headline: 'High-fidelity audio with room sensing.',
    price: 299, monthly: 24.91, monthlyTerm: 12,
    render: 'homepod',
    imgs: [img('homepod-select-white-202610'), img('homepod-select-midnight-202610')],
    colors: [{ name: 'White', hex: '#f1f1f1', dark: '#d9d9d9' }, { name: 'Midnight', hex: '#3a3d45', dark: '#232529' }],
    options: [applecare(1.99, 39, 'AppleCare+ for HomePod')],
    highlights: [{ k: 'Spatial', v: 'Immersive Spatial Audio.' }],
    features: [{ eyebrow: 'Audio', title: 'Acoustic marvel.', text: 'Room sensing tunes the sound to any space.' }],
    specs: { Audio: '4-inch woofer, five tweeters' }
  },
  {
    id: 'apple-tv-4k', name: 'Apple TV 4K', category: 'tv-home', isNew: true,
    tagline: 'The Apple experience. Cinematic in every sense.',
    headline: 'Now with Siri AI and a FaceTime camera.',
    price: 299, monthly: 49.83, monthlyTerm: 6,
    render: 'appletv',
    imgs: [img('apple-tv-4k-hero-select-202610')],
    colors: [{ name: 'Black', hex: '#1d1d1f', dark: '#0b0b0c' }],
    options: [{ key: 'model', label: 'Model.', choices: [{ id: 'wifi', label: 'Wi-Fi 128GB', price: 0 }, { id: 'eth', label: 'Wi-Fi + Ethernet 256GB', price: 30 }] }],
    highlights: [{ k: '4K HDR', v: 'Dolby Vision and Dolby Atmos.' }],
    features: [{ eyebrow: 'Entertainment', title: 'Everything you love to watch.', text: 'Apple TV, Netflix, Disney+, and more in brilliant 4K HDR.', dark: true }],
    specs: { Video: '4K Dolby Vision', Audio: 'Dolby Atmos' }
  },

  /* ---------------- Vision ---------------- */
  {
    id: 'vision-pro', name: 'Apple Vision Pro', category: 'vision',
    tagline: 'You\'ve never seen everything like this before.',
    headline: 'Now with M5 and the Dual Knit Band.',
    price: 3499, monthly: 291.58, monthlyTerm: 12,
    render: 'vision',
    imgs: ['img/vision-pro.png'],
    imgsDark: [MK + 'apple-vision-pro/l/images/overview/technology/displays/hero_base__bpxhq09r962u_large.jpg#dark'],
    colors: [{ name: 'Silver', hex: '#d9dadc', dark: '#b4b6b9' }],
    options: [
      storage(3499, [['256GB', 0], ['512GB', 200], ['1TB', 400]]),
      applecare(24.99, 499, 'AppleCare+ for Vision Pro')
    ],
    highlights: [{ k: '23M', v: 'Pixels across two micro-OLED displays.' }, { k: 'M5', v: 'Faster rendering, longer battery.' }],
    features: [{ eyebrow: 'Spatial', title: 'Welcome to spatial computing.', text: 'Apps live in your space, controlled by your eyes, hands, and voice.', dark: true }],
    specs: { Chip: 'M5 + R1', Display: 'Micro-OLED, 23 million pixels' }
  },

  /* ---------------- Accessories ---------------- */
  { id: 'apple-pencil-pro', name: 'Apple Pencil Pro', category: 'accessories', price: 129, render: 'pencil', imgs: [img('MX2D3')], colors: [{ name: 'White', hex: '#f5f5f7' }], tagline: 'Squeeze, roll, and hover.', options: [{ key: 'engrave', label: 'Engraving.', sub: 'Free', engraving: true, choices: [{ id: 'none', label: 'No engraving', price: 0 }, { id: 'yes', label: 'Add engraving', price: 0 }] }] },
  { id: 'airtag', name: 'AirTag (2nd generation)', category: 'accessories', price: 29, render: 'airtag', imgs: [img('MX532')], colors: [{ name: 'White', hex: '#f5f5f7' }], tagline: 'Lose your knack for losing things.', options: [{ key: 'model', label: 'Pack.', choices: [{ id: '1', label: '1 pack', price: 0 }, { id: '4', label: '4 pack', price: 70 }] }] },
  { id: 'magsafe-charger', name: 'MagSafe Charger (1 m)', category: 'accessories', price: 39, render: 'charger', imgs: [img('MX6X3')], colors: [{ name: 'White', hex: '#f5f5f7' }], tagline: 'Up to 25W fast charging.', options: [{ key: 'model', label: 'Length.', choices: [{ id: '1m', label: '1 m', price: 0 }, { id: '2m', label: '2 m', price: 10 }] }] },
  { id: 'iphone-duo-folio', name: 'iPhone Duo Folio', category: 'accessories', isNew: true, price: 99, render: 'folio', imgs: [], colors: [{ name: 'Navy Blue', hex: '#2c3a55' }, { name: 'Taupe', hex: '#a59885' }], tagline: 'Designed for iPhone Duo.', options: [] },
  { id: 'iphone-18-pro-case', name: 'iPhone 18 Pro Silicone Case with MagSafe', category: 'accessories', isNew: true, price: 49, render: 'case', imgs: [], colors: [{ name: 'Glacier', hex: '#b9cddd' }, { name: 'Burgundy', hex: '#6d2a35' }, { name: 'Black', hex: '#2b2b2d' }, { name: 'Sand', hex: '#d8c8ac' }], tagline: 'Silky, soft-touch finish.', options: [] },
  { id: 'magic-keyboard-ipad', name: 'Magic Keyboard for iPad Pro (M5)', category: 'accessories', price: 299, render: 'keyboard', imgs: [img('MWR53')], colors: [{ name: 'Black', hex: '#2b2b2d' }, { name: 'White', hex: '#f5f5f7' }], tagline: 'Function row and glass trackpad.', options: [{ key: 'model', label: 'Size.', choices: [{ id: '11', label: '11-inch', price: 0 }, { id: '13', label: '13-inch', price: 50 }] }] },
  { id: 'magic-mouse', name: 'Magic Mouse - USB-C', category: 'accessories', price: 79, render: 'mouse', imgs: [img('MXK53')], colors: [{ name: 'White', hex: '#f5f5f7' }, { name: 'Black', hex: '#2b2b2d' }], tagline: 'Multi-Touch surface.', options: [] },
  { id: 'magic-keyboard', name: 'Magic Keyboard with Touch ID', category: 'accessories', price: 149, render: 'mac-keyboard', imgs: [img('MXK73')], colors: [{ name: 'White', hex: '#f5f5f7' }, { name: 'Black', hex: '#2b2b2d' }], tagline: 'Wireless, rechargeable, Touch ID.', options: [] },
  { id: 'usb-c-adapter', name: '20W USB-C Power Adapter', category: 'accessories', price: 19, render: 'adapter', imgs: [img('MHJA3')], colors: [{ name: 'White', hex: '#f5f5f7' }], tagline: 'Fast, efficient charging.', options: [] },
  { id: 'watch-band', name: 'Solo Loop Band', category: 'accessories', price: 49, render: 'band', imgs: [], colors: [{ name: 'Lake Green', hex: '#4d7d6c' }, { name: 'Pink', hex: '#efb6c4' }, { name: 'Orange', hex: '#f08a4b' }, { name: 'Black', hex: '#2b2b2d' }], tagline: 'Stretchable, ultrasoft silicone.', options: [{ key: 'size', label: 'Case size.', choices: [{ id: '42', label: '42mm', price: 0 }, { id: '46', label: '46mm', price: 0 }] }] }
];

const CATEGORIES = {
  store: { name: 'Store' },
  mac: { name: 'Mac', title: 'Mac', hero: 'If you can dream it, Mac can do it.' },
  ipad: { name: 'iPad', title: 'iPad', hero: 'Touch, draw, and type on one magical device.' },
  iphone: { name: 'iPhone', title: 'iPhone', hero: 'Designed to be loved.' },
  watch: { name: 'Watch', title: 'Apple Watch', hero: 'The ultimate device for a healthy life.' },
  vision: { name: 'Vision', title: 'Apple Vision Pro', hero: 'Welcome to the era of spatial computing.' },
  airpods: { name: 'AirPods', title: 'AirPods', hero: 'Sound that changes everything.' },
  'tv-home': { name: 'TV & Home', title: 'TV & Home', hero: 'The ultimate home entertainment experience.' },
  entertainment: { name: 'Entertainment' },
  accessories: { name: 'Accessories', title: 'Accessories', hero: 'Mix. Match. MagSafe.' },
  support: { name: 'Support' }
};

const SHOWS = [
  { title: 'Severance', genre: 'Thriller', c1: '#0f4c5c', c2: '#e3f2f1' },
  { title: 'The Studio', genre: 'Comedy', c1: '#c9341f', c2: '#ffd8a8' },
  { title: 'Slow Horses', genre: 'Drama', c1: '#2f3d2a', c2: '#c7b58d' },
  { title: 'Pluribus', genre: 'Sci-Fi', c1: '#1b2a6b', c2: '#f5c542' },
  { title: 'Ted Lasso', genre: 'Comedy', c1: '#1d3c8f', c2: '#f2d100' },
  { title: 'Silo', genre: 'Sci-Fi', c1: '#3a3a3a', c2: '#d39b4a' },
  { title: 'Shrinking', genre: 'Comedy', c1: '#e86a5c', c2: '#fff1e0' },
  { title: 'Foundation', genre: 'Sci-Fi', c1: '#0b1630', c2: '#7fb4ff' },
  { title: 'The Morning Show', genre: 'Drama', c1: '#5a1e2c', c2: '#f4d3c4' },
  { title: 'F1 The Movie', genre: 'Action', c1: '#111111', c2: '#e10600' }
];

const STORES = [
  { id: 'fifth', name: 'Apple Fifth Avenue', city: 'New York, NY', zip: '10153', addr: '767 Fifth Avenue' },
  { id: 'park', name: 'Apple Apple Park Visitor Center', city: 'Cupertino, CA', zip: '95014', addr: '10600 N Tantau Ave' },
  { id: 'michigan', name: 'Apple Michigan Avenue', city: 'Chicago, IL', zip: '60611', addr: '401 N Michigan Ave' },
  { id: 'grove', name: 'Apple The Grove', city: 'Los Angeles, CA', zip: '90036', addr: '189 The Grove Dr' },
  { id: 'union', name: 'Apple Union Square', city: 'San Francisco, CA', zip: '94108', addr: '300 Post St' },
  { id: 'aventura', name: 'Apple Aventura', city: 'Aventura, FL', zip: '33180', addr: '19501 Biscayne Blvd' },
  { id: 'domain', name: 'Apple Domain Northside', city: 'Austin, TX', zip: '78758', addr: '3121 Palm Way' },
  { id: 'carnegie', name: 'Apple Carnegie Library', city: 'Washington, DC', zip: '20001', addr: '801 K St NW' }
];

const TAX_RATES = { AL: .04, AK: 0, AZ: .056, AR: .065, CA: .0725, CO: .029, CT: .0635, DE: 0, DC: .06, FL: .06, GA: .04, HI: .04, ID: .06, IL: .0625, IN: .07, IA: .06, KS: .065, KY: .06, LA: .0445, ME: .055, MD: .06, MA: .0625, MI: .06, MN: .06875, MS: .07, MO: .04225, MT: 0, NE: .055, NV: .0685, NH: 0, NJ: .06625, NM: .05125, NY: .04, NC: .0475, ND: .05, OH: .0575, OK: .045, OR: 0, PA: .06, RI: .07, SC: .06, SD: .042, TN: .07, TX: .0625, UT: .061, VT: .06, VA: .053, WA: .065, WV: .06, WI: .05, WY: .04 };

const PROMOS = { STUDENT10: { pct: 10, label: 'Education savings (10%)' }, APPLE20: { amt: 20, label: '$20 off your order' }, FREESHIP: { ship: true, label: 'Free express shipping' } };

const TRADE_IN = [
  { id: 'iphone17pro', name: 'iPhone 17 Pro / Pro Max', value: 650 },
  { id: 'iphone16pro', name: 'iPhone 16 Pro / Pro Max', value: 500 },
  { id: 'iphone16', name: 'iPhone 16 / 16 Plus', value: 350 },
  { id: 'iphone15pro', name: 'iPhone 15 Pro / Pro Max', value: 380 },
  { id: 'iphone15', name: 'iPhone 15 / 15 Plus', value: 250 },
  { id: 'iphone14', name: 'iPhone 14 / 14 Plus', value: 170 },
  { id: 'iphone13', name: 'iPhone 13 / 13 mini', value: 120 },
  { id: 'iphone12', name: 'iPhone 12 / 12 mini', value: 70 },
  { id: 'android', name: 'Android smartphone', value: 100 }
];

const byId = id => PRODUCTS.find(p => p.id === id);
const byCat = c => PRODUCTS.filter(p => p.category === c);
