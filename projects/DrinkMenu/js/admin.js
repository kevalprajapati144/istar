const PASSWORD = "admin123"; // demo only: a real site needs a server-side login
const modal = () => bootstrap.Modal.getOrCreateInstance($("#drinkModal"));
const STATUS = ["Pending", "Preparing", "Delivered", "Cancelled"];
function gate() { const on = sessionStorage.getItem("dms_admin") === "1";
  $("#loginBox").classList.toggle("d-none", on); $("#panel").classList.toggle("d-none", !on); $("#logout").classList.toggle("d-none", !on); if (on) render(); }
$("#loginForm").addEventListener("submit", e => { e.preventDefault(); if ($("#pw").value === PASSWORD) { sessionStorage.setItem("dms_admin", "1"); gate(); } else $("#loginErr").textContent = "Wrong password. Try again."; });
$("#logout").addEventListener("click", () => { sessionStorage.removeItem("dms_admin"); $("#pw").value = ""; gate(); });
function render() {
  const drinks = load(K.drinks), orders = load(K.orders), live = orders.filter(o => o.status !== "Cancelled");
  $("#stats").innerHTML = [["Revenue", money(live.reduce((s, o) => s + o.total, 0))], ["Orders", orders.length], ["Pending", orders.filter(o => o.status === "Pending").length], ["Drinks", drinks.length]]
    .map(([l, v]) => `<div class="col-6 col-md-3"><div class="stat"><small class="text-secondary">${l}</small><div class="n">${v}</div></div></div>`).join("");
  const top = [...drinks].sort((a, b) => b.sold - a.sold).slice(0, 5), max = top[0]?.sold || 1;
  $("#sellers").innerHTML = top.map(d => `<div class="d-flex align-items-center gap-2 mb-2"><span style="width:150px" class="small fw-semibold text-truncate">${esc(d.emoji)} ${esc(d.name)}</span><div class="flex-grow-1"><div class="bar" style="width:${d.sold / max * 100}%;background:${esc(d.color || "#ff3d81")}"></div></div><small>${d.sold}</small></div>`).join("");
  const low = drinks.filter(d => d.stock <= 10).sort((a, b) => a.stock - b.stock);
  $("#low").innerHTML = low.map(d => `<div class="d-flex justify-content-between border-bottom py-1"><span>${esc(d.emoji)} ${esc(d.name)}</span><strong class="text-danger">${d.stock} left</strong></div>`).join("") || '<p class="text-secondary mb-0">All drinks are well stocked.</p>';
  $("#drinkRows").innerHTML = drinks.map(d => `<tr><td style="width:56px">${art(d)}</td><td class="fw-bold">${esc(d.name)} ${d.trending ? '<span class="badge bg-warning text-dark">Trending</span>' : ""}</td><td>${esc(d.category)}</td><td>${money(d.price)}${d.oldPrice > d.price ? ` <small class="old">${money(d.oldPrice)}</small>` : ""}</td>
    <td>${d.stock <= 5 ? `<span class="text-danger fw-bold">${d.stock}</span>` : d.stock}</td><td><span class="badge ${d.available ? "bg-success" : "bg-secondary"}">${d.available ? "Available" : "Hidden"}</span></td>
    <td class="text-end text-nowrap"><button class="btn btn-sm btn-line" data-edit="${d.id}">Edit</button> <button class="btn btn-sm btn-outline-danger rounded-pill" data-del="${d.id}">Delete</button></td></tr>`).join("") || '<tr><td colspan="7" class="p-4 text-secondary">No drinks yet. Click Add drink.</td></tr>';
  $("#orderRows").innerHTML = orders.map(o => `<tr><td><strong>${o.id}</strong><br><small class="text-secondary">${new Date(o.date).toLocaleString("en-IN")}</small></td><td>${esc(o.name)}<br><small class="text-secondary">${esc(o.phone)} · ${esc(o.address)}</small></td>
    <td>${o.items.map(i => `${esc(i.name)} × ${i.qty}`).join("<br>")}</td><td>${money(o.total)}<br><small class="text-secondary">${esc(o.pay)}${o.coupon ? " · " + esc(o.coupon) : ""}</small></td>
    <td><select class="form-select form-select-sm" data-status="${o.id}" aria-label="Order status">${STATUS.map(s => `<option ${s === o.status ? "selected" : ""}>${s}</option>`).join("")}</select></td></tr>`).join("") || '<tr><td colspan="5" class="p-4 text-secondary">No orders yet. Orders placed in the shop appear here.</td></tr>';
  $("#catList").innerHTML = [...new Set(drinks.map(d => d.category))].map(c => `<option value="${esc(c)}">`).join("");
}
function openForm(d) { $("#mTitle").textContent = d ? "Edit drink" : "Add drink";
  $("#fId").value = d?.id ?? ""; $("#fName").value = d?.name ?? ""; $("#fEmoji").value = d?.emoji ?? "🥤"; $("#fCat").value = d?.category ?? ""; $("#fColor").value = d?.color ?? "#ff3d81";
  $("#fPrice").value = d?.price ?? ""; $("#fOld").value = d?.oldPrice ?? 0; $("#fStock").value = d?.stock ?? ""; $("#fDesc").value = d?.desc ?? ""; $("#fTrend").checked = d?.trending ?? false; $("#fAvail").checked = d?.available ?? true; modal().show(); }
$("#addBtn").addEventListener("click", () => openForm());
$("#drinkForm").addEventListener("submit", e => { e.preventDefault(); const drinks = load(K.drinks), id = $("#fId").value, old = drinks.find(x => x.id == id);
  const d = { id: id ? +id : Date.now(), name: $("#fName").value.trim(), emoji: $("#fEmoji").value.trim(), category: $("#fCat").value.trim(), color: $("#fColor").value, price: +$("#fPrice").value, oldPrice: +$("#fOld").value, stock: +$("#fStock").value, desc: $("#fDesc").value.trim(), trending: $("#fTrend").checked, available: $("#fAvail").checked, rating: old?.rating ?? 4.5, sold: old?.sold ?? 0 };
  save(K.drinks, id ? drinks.map(x => x.id == id ? d : x) : [...drinks, d]); modal().hide(); render(); });
document.addEventListener("click", e => { const t = e.target.dataset;
  if (t.edit) openForm(load(K.drinks).find(d => d.id == t.edit));
  if (t.del && confirm("Delete this drink? This cannot be undone.")) { save(K.drinks, load(K.drinks).filter(d => d.id != t.del)); render(); } });
document.addEventListener("change", e => { const id = e.target.dataset.status; if (id) { save(K.orders, load(K.orders).map(o => o.id === id ? { ...o, status: e.target.value } : o)); render(); } });
$("#resetBtn").addEventListener("click", () => { if (confirm("Delete all drinks, orders and carts and restore the sample drinks?")) { Object.values(K).forEach(k => localStorage.removeItem(k)); location.reload(); } });
gate();
