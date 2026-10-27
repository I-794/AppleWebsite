# Apple Website Recreation

A fan-made recreation of apple.com (late October 2026 lineup), built as a school project with plain HTML, CSS, and JavaScript. No build step.

**Not affiliated with Apple Inc.** No real orders are placed and no payment info leaves your browser.

## Run it
Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
```
then visit http://localhost:8000.

## What works
- Homepage, Store, and pages for Mac, iPad, iPhone, Watch, Vision, AirPods, TV & Home, Entertainment, Accessories, Support
- 40+ products (iPhone Duo, iPhone 18 Pro, MacBook Neo, Apple Watch Series 12 / Ultra 4, AirPods 5, HomeView, HomePod mini, and more)
- Product pages, configurators (model, finish, storage, trade-in, engraving, AppleCare+), compare tool, search
- Bag with quantities, AppleCare add/remove, and promo codes (`STUDENT10`, `APPLE20`, `FREESHIP`)
- Checkout: guest or sign-in, delivery or store pickup, card validation (Luhn), gift card, simulated Apple Pay, state sales tax, order confirmation, order tracking and cancel
- Account, order history, service subscriptions, Genius Bar booking, trade-in estimator

Only test cards are accepted, e.g. `4242 4242 4242 4242`, any future date, any 3-digit code.

Product photos are hotlinked from Apple's image CDN when available (a few watch and Vision Pro shots live in `img/` with their backgrounds removed); otherwise the site draws its own vector renders of each product in every finish.
