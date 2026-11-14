let cart = load(K.cart, {}), wish = load(K.wish, []), coupon = "", cat = "All", q = "", sort = "pop", onlyWish = false;
const byId = id => load(K.drinks).find(d => d.id == id);
const toast = m => { $("#toastMsg").textContent = m; bootstrap.Toast.getOrCreateInstance($("#toast"), { delay: 1800 }).show(); };
const FREE = 299, FEE = 40;
function calc() {
  const sub = Object.entries(cart).reduce((s, [id, n]) => s + (byId(id)?.price || 0) * n, 0);
  let disc = 0; if (coupon === "FIRST10") disc = Math.round(sub * .1); if (coupon === "SAVE50" && sub >= 400) disc = 50;
  const fee = sub === 0 || sub >= FREE ? 0 : FEE;
  return { sub, disc, fee, total: sub - disc + fee };
}
const card = d => { const ok = d.available && d.stock > 0, off = d.oldPrice > d.price ? Math.round(100 - d.price / d.oldPrice * 100) : 0;
  return `<div class="col"><div class="p-card" style="--tint:${tint(d.color)}">${off ? `<span class="tag sale">${off}% OFF</span>` : d.trending ? '<span class="tag">TRENDING</span>' : ""}
  <button class="heart ${wish.includes(d.id) ? "on" : ""}" data-wish="${d.id}" aria-label="Add to wishlist">♥</button>
  <div class="p-img" data-quick="${d.id}">${art(d)}</div><div class="p-3 d-flex flex-column gap-1 flex-grow-1">
  <h3 class="h6 fw-bold mb-0">${esc(d.name)}</h3><div class="small text-secondary">${esc(d.category)} · <span class="stars">${stars(d.rating)}</span> ${d.rating}</div>
  <div><span class="price">${money(d.price)}</span> ${d.oldPrice > d.price ? `<span class="old">${money(d.oldPrice)}</span>` : ""}</div>
  ${ok && d.stock <= 5 ? `<small class="text-danger fw-semibold">Only ${d.stock} left</small>` : ""}
  <button class="btn btn-pink btn-sm mt-auto" data-add="${d.id}" ${ok ? "" : "disabled"}>${ok ? "Add to cart" : "Sold out"}</button></div></div></div>`; };

function render() {
  const all = load(K.drinks).filter(d => d.available || true), vis = all.filter(d => d.available);
  const top = vis.filter(d => d.trending).sort((a, b) => b.sold - a.sold);
  $("#heroArt").innerHTML = top.slice(0, 3).map(art).join("");
  $("#trending").innerHTML = top.slice(0, 4).map(card).join("");
  $("#cats").innerHTML = ["All", ...new Set(vis.map(d => d.category))].map(c => `<button class="cat-tile ${c === cat ? "on" : ""}" data-c="${esc(c)}">${esc(c)}</button>`).join("");
  let list = all.filter(d => d.available && (cat === "All" || d.category === cat) && d.name.toLowerCase().includes(q) && (!onlyWish || wish.includes(d.id)));
  list.sort({ pop: (a, b) => b.sold - a.sold, low: (a, b) => a.price - b.price, high: (a, b) => b.price - a.price, rate: (a, b) => b.rating - a.rating }[sort]);
  $("#shopTitle").textContent = onlyWish ? "Your wishlist ♥" : cat === "All" ? "All drinks" : cat;
  $("#grid").innerHTML = list.map(card).join("") || `<p class="text-secondary">${onlyWish ? "No favourites yet. Tap the heart on a drink." : "No drinks match your search."}</p>`;
  $("#wcount").textContent = wish.length; renderCart();
}
function renderCart() {
  const ids = Object.keys(cart).filter(id => byId(id)), c = calc();
  $("#cartItems").innerHTML = ids.length ? ids.map(id => { const d = byId(id); return `<div class="d-flex align-items-center gap-2 py-2 border-bottom"><div style="width:52px">${art(d)}</div>
   <div class="flex-grow-1"><div class="fw-bold">${esc(d.name)}</div><small class="text-secondary">${money(d.price)} each</small></div>
   <div class="btn-group btn-group-sm"><button class="btn btn-line" data-dec="${id}" aria-label="Decrease">−</button><span class="btn disabled border-dark">${cart[id]}</span><button class="btn btn-line" data-inc="${id}" aria-label="Increase">+</button></div>
   <button class="btn btn-sm text-danger" data-rm="${id}" aria-label="Remove">✕</button></div>`; }).join("") : '<p class="text-secondary mt-3">Your cart is empty. Add something cold.</p>';
  $("#shipMsg").textContent = c.sub >= FREE ? "🎉 You've unlocked free delivery" : `Add ${money(FREE - c.sub)} more for free delivery`;
  $("#shipFill").style.width = Math.min(100, c.sub / FREE * 100) + "%";
  $("#sums").innerHTML = `<div class="d-flex justify-content-between"><span>Subtotal</span><span>${money(c.sub)}</span></div>${c.disc ? `<div class="d-flex justify-content-between text-success"><span>Discount (${coupon})</span><span>−${money(c.disc)}</span></div>` : ""}<div class="d-flex justify-content-between"><span>Delivery</span><span>${c.fee ? money(c.fee) : "Free"}</span></div><div class="d-flex justify-content-between fs-5 fw-bold mt-1"><span>Total</span><span>${money(c.total)}</span></div>`;
  $("#count").textContent = ids.reduce((s, id) => s + cart[id], 0); $("#payTotal").textContent = money(c.total); $("#checkoutBtn").disabled = !ids.length; save(K.cart, cart);
}
function addToCart(id, n = 1) { const d = byId(id); cart[id] = Math.min(d.stock, (cart[id] || 0) + n); toast(`${d.name} added to cart`); render(); }
document.addEventListener("click", e => {
  const el = e.target.closest("[data-c],[data-add],[data-inc],[data-dec],[data-rm],[data-wish],[data-quick],[data-qadd]"); if (!el) return; const t = el.dataset;
  if (t.c) { cat = t.c; onlyWish = false; render(); }
  if (t.add) addToCart(t.add);
  if (t.inc && cart[t.inc] < byId(t.inc).stock) { cart[t.inc]++; render(); }
  if (t.dec) { if (--cart[t.dec] < 1) delete cart[t.dec]; render(); }
  if (t.rm) { delete cart[t.rm]; render(); }
  if (t.wish) { const id = +t.wish; wish = wish.includes(id) ? wish.filter(x => x != id) : [...wish, id]; save(K.wish, wish); render(); }
  if (t.quick) { const d = byId(t.quick); $("#quickBody").innerHTML = `<div class="row g-0"><div class="col-md-5 p-4 text-center" style="background:${tint(d.color)}">${art(d)}</div><div class="col-md-7 p-4"><button class="btn-close float-end" data-bs-dismiss="modal" aria-label="Close"></button>
   <span class="small text-secondary">${esc(d.category)}</span><h3 class="fw-bold">${esc(d.name)}</h3><div class="stars mb-2">${stars(d.rating)} <span class="text-secondary">${d.rating} · ${d.sold}+ sold</span></div><p>${esc(d.desc || "")}</p>
   <div class="mb-3"><span class="price fs-3">${money(d.price)}</span> ${d.oldPrice > d.price ? `<span class="old">${money(d.oldPrice)}</span>` : ""}</div>
   <button class="btn btn-pink w-100" data-qadd="${d.id}" ${d.stock > 0 ? "" : "disabled"}>${d.stock > 0 ? "Add to cart" : "Sold out"}</button></div></div>`; bootstrap.Modal.getOrCreateInstance($("#quick")).show(); }
  if (t.qadd) { addToCart(t.qadd); bootstrap.Modal.getInstance($("#quick")).hide(); }
});
const setQ = v => { q = v.trim().toLowerCase(); $("#search").value = $("#search2").value = v; render(); };
$("#search").addEventListener("input", e => setQ(e.target.value)); $("#search2").addEventListener("input", e => setQ(e.target.value));
$("#sort").addEventListener("change", e => { sort = e.target.value; render(); });
$("#wishBtn").addEventListener("click", () => { onlyWish = !onlyWish; cat = "All"; render(); location.hash = "shop"; });
$("#applyCoupon").addEventListener("click", () => { const v = $("#coupon").value.trim().toUpperCase(), s = calc().sub, m = $("#couponMsg");
  if (v === "FIRST10" || (v === "SAVE50" && s >= 400)) { coupon = v; m.className = "small text-success"; m.textContent = v + " applied"; }
  else { coupon = ""; m.className = "small text-danger"; m.textContent = v === "SAVE50" ? "SAVE50 needs a subtotal of ₹400 or more." : "That code isn't valid."; } renderCart(); });
$("#orderForm").addEventListener("submit", e => {
  e.preventDefault(); const drinks = load(K.drinks), items = [];
  for (const [id, n] of Object.entries(cart)) { const d = drinks.find(x => x.id == id); if (d && d.available && d.stock >= n) { items.push({ id: d.id, name: d.name, price: d.price, qty: n }); d.stock -= n; d.sold += n; } }
  if (!items.length) return; const c = calc();
  const o = { id: "ORD" + Date.now().toString().slice(-6), name: $("#cName").value.trim(), phone: $("#cPhone").value.trim(), address: $("#cAddr").value.trim(), pay: $("#cPay").value, items, sub: c.sub, disc: c.disc, fee: c.fee, coupon, total: c.total, status: "Pending", date: new Date().toISOString() };
  save(K.drinks, drinks); save(K.orders, [o, ...load(K.orders)]); cart = {}; coupon = ""; e.target.reset();
  bootstrap.Modal.getInstance($("#checkout")).hide(); bootstrap.Offcanvas.getInstance($("#cartPanel"))?.hide();
  $("#alert").innerHTML = `<div class="alert alert-success alert-dismissible border-2 border-dark">Order <strong>${o.id}</strong> placed. Total ${money(o.total)}. Keep this ID to track it.<button class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`; render(); location.hash = "shop";
});
$("#trackBtn").addEventListener("click", () => { const o = load(K.orders).find(x => x.id === $("#trackId").value.trim().toUpperCase()), out = $("#trackOut");
  if (!o) { out.innerHTML = '<p class="text-danger mb-0">No order found with that ID. Check it and try again.</p>'; return; }
  if (o.status === "Cancelled") { out.innerHTML = `<p class="fw-bold">${o.id} was cancelled.</p>`; return; }
  const st = ["Pending", "Preparing", "Delivered"], i = st.indexOf(o.status);
  out.innerHTML = `<div class="fw-bold">${o.id} · ${money(o.total)}</div><div class="track">${st.map((s, k) => `<div class="${k <= i ? "done" : ""}"><b>${k + 1}</b>${s}</div>`).join("")}</div><small class="text-secondary">${o.items.map(x => `${esc(x.name)} × ${x.qty}`).join(", ")}</small>`; });
$("#yr").textContent = new Date().getFullYear(); render();
