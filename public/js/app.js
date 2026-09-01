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
  const locationInput = document.getElementById('location');
  const typedLocation = locationInput ? locationInput.value.trim() : '';

  // Case 1: Customer ne kuch type kiya hai — usi location se search karo
  if (typedLocation) {
    showToast('Searching near ' + typedLocation + '...');

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(typedLocation)}&limit=1`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const lat = data[0].lat;
          const lng = data[0].lon;
          window.location.href = `/workers/${skill}?lat=${lat}&lng=${lng}`;
        } else {
          showToast('Location not found, try a different name');
        }
      })
      .catch(() => showToast('Could not search that location'));

    return;
  }

  // Case 2: Kuch type nahi kiya — default current GPS location use karo
  if (navigator.geolocation) {
    showToast('Using your current location...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        window.location.href = `/workers/${skill}?lat=${lat}&lng=${lng}`;
      },
      () => {
        window.location.href = '/workers/' + skill;
      }
    );
  } else {
    window.location.href = '/workers/' + skill;
  }
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

// ===== SEARCH (home page search bar) =====
function searchService() {
  const service = document.getElementById('service').value;

  if (!service) {
    showToast('Pehle service select karo');
    return;
  }

  goToWorkers(service);
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

// ===== MAP MODAL (Leaflet) =====
let modalMap, modalMarker, currentMapTarget;

function openMapModal(target) {
  currentMapTarget = target; // 'signup' ya 'profile'
  document.getElementById('mapModal').style.display = 'block';

  if (!modalMap) {
    const defaultLat = 19.0760;
    const defaultLng = 72.8777;

    modalMap = L.map('modalMap').setView([defaultLat, defaultLng], 11);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(modalMap);

    modalMarker = L.marker([defaultLat, defaultLng], { draggable: true }).addTo(modalMap);

    modalMarker.on('dragend', function () {
      const pos = modalMarker.getLatLng();
      previewLocation(pos.lat, pos.lng);
    });

    modalMap.on('click', function (e) {
      modalMarker.setLatLng(e.latlng);
      previewLocation(e.latlng.lat, e.latlng.lng);
    });

    const searchInput = document.getElementById('modalSearchInput');
    let searchTimeout;
    searchInput.addEventListener('input', function () {
      clearTimeout(searchTimeout);
      const query = searchInput.value;
      if (query.length < 3) return;

      searchTimeout = setTimeout(() => {
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`)
          .then(res => res.json())
          .then(data => {
            if (data && data.length > 0) {
              const lat = parseFloat(data[0].lat);
              const lng = parseFloat(data[0].lon);
              modalMap.setView([lat, lng], 15);
              modalMarker.setLatLng([lat, lng]);
              previewLocation(lat, lng);
            }
          })
          .catch(() => {});
      }, 600);
    });
  }

  setTimeout(() => modalMap.invalidateSize(), 200);
}

function closeMapModal() {
  document.getElementById('mapModal').style.display = 'none';
}

function previewLocation(lat, lng) {
  modalMarker.selectedLat = lat;
  modalMarker.selectedLng = lng;

  fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`)
    .then(res => res.json())
    .then(data => {
      const preview = document.getElementById('modalAddressPreview');
      if (data && data.display_name) {
        preview.textContent = data.display_name;
        modalMarker.selectedAddress = data.display_name;
        modalMarker.selectedPincode = (data.address && data.address.postcode) ? data.address.postcode : '';
      }
    })
    .catch(() => {});
}

function confirmMapLocation() {
  if (!modalMarker.selectedLat) {
    alert('Pehle map pe click karke ya search karke location select karo');
    return;
  }

  document.getElementById('latitudeInput').value = modalMarker.selectedLat;
  document.getElementById('longitudeInput').value = modalMarker.selectedLng;
  document.getElementById('addressInput').value = modalMarker.selectedAddress || '';
  document.getElementById('pincodeInput').value = modalMarker.selectedPincode || '';

  closeMapModal();
}

// ===== INIT (sab kuch ek hi DOMContentLoaded mein) =====
document.addEventListener('DOMContentLoaded', () => {
  renderServices();
  renderWorkers();

  const roleSelect = document.getElementById('roleSelect');
  const workerFields = document.getElementById('workerFields');
  if (roleSelect && workerFields) {
    roleSelect.addEventListener('change', () => {
      const isWorker = roleSelect.value === 'worker';
      workerFields.style.display = isWorker ? 'block' : 'none';

      const addressField = document.getElementById('addressInput');
      if (addressField) {
        addressField.required = isWorker;
      }
    });
  }
});