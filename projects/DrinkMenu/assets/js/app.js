// Drink Menu Management System - browser demo (Create, Read, Update, Delete)
const STORAGE_KEY = 'drinkMenuDemo.v1';

const SAMPLE = [
  { id: 1, name: 'Masala Chai', category: 'Hot', price: 30, description: 'Spiced Indian tea with milk.', available: true },
  { id: 2, name: 'Cold Coffee', category: 'Cold', price: 90, description: 'Chilled coffee blended with ice cream.', available: true },
  { id: 3, name: 'Mango Shake', category: 'Shake', price: 80, description: 'Thick shake made from fresh mangoes.', available: true },
  { id: 4, name: 'Fresh Lime Soda', category: 'Cold', price: 50, description: 'Sweet or salted, served with soda.', available: true },
  { id: 5, name: 'Orange Juice', category: 'Juice', price: 70, description: '100% fresh squeezed.', available: false },
  { id: 6, name: 'Virgin Mojito', category: 'Mocktail', price: 120, description: 'Mint, lime and soda over ice.', available: true }
];

let drinks = loadDrinks();
const modal = new bootstrap.Modal(document.getElementById('drinkModal'));
const toast = new bootstrap.Toast(document.getElementById('toast'), { delay: 2000 });

function loadDrinks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved)) return saved;
  } catch (e) { /* storage unavailable */ }
  return SAMPLE.map(d => ({ ...d }));
}

function saveDrinks() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(drinks)); } catch (e) { /* ignore */ }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showToast(message) {
  document.getElementById('toastBody').textContent = message;
  toast.show();
}

function renderStats() {
  const available = drinks.filter(d => d.available).length;
  const average = drinks.length ? Math.round(drinks.reduce((sum, d) => sum + d.price, 0) / drinks.length) : 0;
  document.getElementById('stats').innerHTML = [
    ['Total drinks', drinks.length],
    ['Available', available],
    ['Average price', '₹' + average]
  ].map(([label, value]) => `<div class="col-sm-4"><div class="stat-card"><strong>${value}</strong><span>${label}</span></div></div>`).join('');
}

function renderTable() {
  const query = document.getElementById('search').value.trim().toLowerCase();
  const category = document.getElementById('filterCategory').value;
  const list = drinks.filter(d =>
    (!category || d.category === category) &&
    (!query || (d.name + ' ' + d.description).toLowerCase().includes(query)));

  document.getElementById('drinkRows').innerHTML = list.map((d, index) => `
    <tr>
      <td>${index + 1}</td>
      <td><div class="fw-semibold">${escapeHtml(d.name)}</div><div class="drink-desc">${escapeHtml(d.description || '')}</div></td>
      <td>${escapeHtml(d.category)}</td>
      <td>₹${d.price}</td>
      <td><span class="badge ${d.available ? 'text-bg-success' : 'text-bg-secondary'}">${d.available ? 'Available' : 'Unavailable'}</span></td>
      <td class="text-end text-nowrap">
        <button class="btn btn-sm btn-outline-primary" data-edit="${d.id}"><i class="bi bi-pencil"></i></button>
        <button class="btn btn-sm btn-outline-danger" data-delete="${d.id}"><i class="bi bi-trash"></i></button>
      </td>
    </tr>`).join('');
  document.getElementById('emptyMsg').classList.toggle('d-none', list.length > 0);
}

function render() { renderStats(); renderTable(); }

function openForm(drink) {
  const form = document.getElementById('drinkForm');
  form.classList.remove('was-validated');
  document.getElementById('modalTitle').textContent = drink ? 'Edit drink' : 'Add drink';
  document.getElementById('drinkId').value = drink ? drink.id : '';
  document.getElementById('name').value = drink ? drink.name : '';
  document.getElementById('category').value = drink ? drink.category : 'Hot';
  document.getElementById('price').value = drink ? drink.price : '';
  document.getElementById('description').value = drink ? drink.description : '';
  document.getElementById('available').checked = drink ? drink.available : true;
  modal.show();
}

document.getElementById('addBtn').addEventListener('click', () => openForm(null));
document.getElementById('search').addEventListener('input', renderTable);
document.getElementById('filterCategory').addEventListener('change', renderTable);

document.getElementById('resetBtn').addEventListener('click', () => {
  if (!confirm('Reset to the sample drinks?')) return;
  drinks = SAMPLE.map(d => ({ ...d }));
  saveDrinks();
  render();
  showToast('Demo data reset');
});

document.getElementById('drinkRows').addEventListener('click', event => {
  const editButton = event.target.closest('[data-edit]');
  const deleteButton = event.target.closest('[data-delete]');
  if (editButton) {
    openForm(drinks.find(d => d.id === Number(editButton.dataset.edit)));
  } else if (deleteButton) {
    const id = Number(deleteButton.dataset.delete);
    const drink = drinks.find(d => d.id === id);
    if (drink && confirm(`Delete "${drink.name}"?`)) {
      drinks = drinks.filter(d => d.id !== id);
      saveDrinks();
      render();
      showToast('Drink deleted');
    }
  }
});

document.getElementById('drinkForm').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.target;
  if (!form.checkValidity()) { form.classList.add('was-validated'); return; }

  const id = Number(document.getElementById('drinkId').value);
  const data = {
    name: document.getElementById('name').value.trim(),
    category: document.getElementById('category').value,
    price: Number(document.getElementById('price').value),
    description: document.getElementById('description').value.trim(),
    available: document.getElementById('available').checked
  };

  if (id) {
    drinks = drinks.map(d => d.id === id ? { ...d, ...data } : d);
    showToast('Drink updated');
  } else {
    const nextId = drinks.reduce((max, d) => Math.max(max, d.id), 0) + 1;
    drinks.push({ id: nextId, ...data });
    showToast('Drink added');
  }
  saveDrinks();
  modal.hide();
  render();
});

render();
