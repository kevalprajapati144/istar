// Shared data layer. Everything is saved in the browser (localStorage).
const K = { drinks: "dms2_drinks", orders: "dms2_orders", cart: "dms2_cart", wish: "dms2_wish" };
const load = (k, d = []) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const money = n => "₹" + Number(n).toLocaleString("en-IN");
const $ = s => document.querySelector(s);
const stars = r => "★".repeat(Math.round(r)) + "☆".repeat(5 - Math.round(r));
const tint = c => c + "33";
// name, category, price, oldPrice, stock, emoji, color, rating, sold, trending, description
const SEED = [
  ["Mango Blast", "Juices", 90, 120, 30, "🥭", "#ffb300", 4.8, 240, 1, "Thick Alphonso mango pulp, served ice cold."],
  ["Blue Lagoon", "Mocktails", 130, 0, 25, "🫐", "#2f80ff", 4.7, 210, 1, "Blue curaçao syrup, lemon and sparkling soda."],
  ["Iced Caramel Latte", "Coffee", 150, 180, 20, "☕", "#b9783f", 4.9, 300, 1, "Double espresso, milk and salted caramel over ice."],
  ["Strawberry Shake", "Shakes", 140, 0, 22, "🍓", "#ff5c8a", 4.6, 180, 1, "Fresh strawberries blended with creamy vanilla ice cream."],
  ["Cola Zero", "Cold Drinks", 40, 0, 60, "🥤", "#4a2c2a", 4.2, 150, 0, "Chilled sugar-free cola."],
  ["Lemon Mint Cooler", "Mocktails", 70, 90, 40, "🍋", "#9be15d", 4.5, 170, 0, "Fresh lime, mint leaves and soda."],
  ["Masala Chai", "Tea", 30, 0, 70, "🍵", "#c98b4a", 4.7, 260, 0, "Slow-brewed tea with ginger and cardamom."],
  ["Chocolate Oreo Shake", "Shakes", 160, 0, 18, "🍫", "#6b3e2e", 4.9, 280, 1, "Rich chocolate blended with Oreo cookies."],
  ["Fresh Coconut Water", "Juices", 60, 0, 35, "🥥", "#7fd6c2", 4.4, 120, 0, "Straight from the coconut, naturally sweet."],
  ["Watermelon Slush", "Mocktails", 85, 110, 30, "🍉", "#ff4d6d", 4.5, 140, 0, "Frozen watermelon crush with a hint of lime."]
];
if (!localStorage.getItem(K.drinks)) save(K.drinks, SEED.map((s, i) => ({ id: i + 1, name: s[0], category: s[1], price: s[2], oldPrice: s[3], stock: s[4], emoji: s[5], color: s[6], rating: s[7], sold: s[8], trending: !!s[9], desc: s[10], available: true })));
// Drink illustration (SVG) coloured per drink
const art = d => { const c = d.color || "#ff3d81"; return `<svg viewBox="0 0 160 175" class="art" role="img" aria-label="${esc(d.name)}"><defs><linearGradient id="g${d.id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c}" stop-opacity=".8"/><stop offset="1" stop-color="${c}"/></linearGradient></defs>
<rect x="86" y="4" width="10" height="80" rx="5" fill="#fff" stroke="#1b1340" stroke-width="3.5" transform="rotate(14 91 44)"/>
<path d="M36 44h88l-9 114q-1 11-12 11H57q-11 0-12-11z" fill="#fff" fill-opacity=".6" stroke="#1b1340" stroke-width="4.5" stroke-linejoin="round"/>
<path d="M43 80h74l-6 78q-1 7-9 7H58q-8 0-9-7z" fill="url(#g${d.id})"/>
<rect x="60" y="92" width="20" height="20" rx="5" fill="#fff" fill-opacity=".45" transform="rotate(-14 70 102)"/><rect x="88" y="118" width="17" height="17" rx="5" fill="#fff" fill-opacity=".4" transform="rotate(10 96 126)"/>
<text x="80" y="72" font-size="30" text-anchor="middle">${esc(d.emoji)}</text></svg>`; };
