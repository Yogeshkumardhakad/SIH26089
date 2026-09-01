// ===== SAMPLE DATA =====
const services = [
  { icon: '⚡', name: 'Electrician', desc: 'Wiring, repairs & installations' },
  { icon: '🔧', name: 'Plumber', desc: 'Pipe fitting & leak repairs' },
  { icon: '🪚', name: 'Carpenter', desc: 'Furniture & woodwork' },
  { icon: '🧹', name: 'Cleaner', desc: 'Home & office cleaning' },
  { icon: '🎨', name: 'Painter', desc: 'Interior & exterior painting' },
  { icon: '🌱', name: 'Gardener', desc: 'Lawn & garden maintenance' }
];

const workers = [
  { name: 'Ramesh Kumar', skill: 'Electrician', rating: '⭐ 4.8 (120 jobs)' },
  { name: 'Suresh Yadav', skill: 'Plumber', rating: '⭐ 4.6 (95 jobs)' },
  { name: 'Anita Devi', skill: 'Cleaner', rating: '⭐ 4.9 (210 jobs)' },
  { name: 'Manoj Singh', skill: 'Carpenter', rating: '⭐ 4.7 (80 jobs)' }
];

// ===== RENDER SERVICES =====
function renderServices() {
  const container = document.getElementById('servicesContainer');
  if (!container) return;
  container.innerHTML = services.map(s => `
    <div class="service-card" style="cursor:pointer;" onclick="goToWorkers('${s.name.toLowerCase()}')">
      <div class="icon">${s.icon}</div>
      <h3>${s.name}</h3>
      <p>${s.desc}</p>
    </div>
  `).join('');
}

function goToWorkers(skill) {
  window.location.href = '/workers/' + skill;
}

// ===== RENDER WORKERS =====
function renderWorkers() {
  const container = document.getElementById('workersContainer');
  if (!container) return;
  container.innerHTML = workers.map(w => `
    <div class="worker-card">
      <div class="worker-avatar">${w.name.charAt(0)}</div>
      <h3>${w.name}</h3>
      <div class="worker-skill">${w.skill}</div>
      <div class="worker-rating">${w.rating}</div>
    </div>
  `).join('');
}

// ===== MOBILE MENU =====
function toggleMenu() {
  const nav = document.getElementById('navLinks');
  nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
}

// ===== SEARCH =====
function searchService() {
  const location = document.getElementById('location').value;
  const service = document.getElementById('service').value;
  const date = document.getElementById('date').value;

  if (!location || !service) {
    showToast('Location aur service select karo');
    return;
  }
  showToast(`Searching ${service} near ${location}...`);
  document.getElementById('workers').scrollIntoView({ behavior: 'smooth' });
}

function showAllServices() {
  document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
}

function showForecast() {
  showToast('AI Forecast: Electrician demand 20% up next week');
}

// ===== TOAST =====
function showToast(message) {
  const toast = document.getElementById('toast');
  document.getElementById('toastMessage').textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ===== INIT (sab kuch ek hi DOMContentLoaded mein) =====
document.addEventListener('DOMContentLoaded', () => {
  // Home page ke liye (agar in containers ka wujood hai to hi chalega)
  renderServices();
  renderWorkers();

  // Signup page ke liye — role select hone par worker fields show/hide
  const roleSelect = document.getElementById('roleSelect');
  const workerFields = document.getElementById('workerFields');

  if (roleSelect && workerFields) {
    roleSelect.addEventListener('change', () => {
      workerFields.style.display = roleSelect.value === 'worker' ? 'block' : 'none';
    });
  }
});