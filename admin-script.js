// ===== ADMIN AUTHENTICATION =====
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

// Check if admin is logged in
function checkAdminAuth() {
  const isAdminLoggedIn = localStorage.getItem('adminLoggedIn');
  if (!isAdminLoggedIn && !window.location.href.includes('admin-login.html')) {
    window.location.href = 'admin-login.html';
  }
  return isAdminLoggedIn === 'true';
}

// Admin login handler
document.addEventListener('DOMContentLoaded', () => {
  // Login form handler
  const loginForm = document.getElementById('admin-login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const username = document.getElementById('admin-username').value;
      const password = document.getElementById('admin-password').value;

      if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('adminUsername', username);
        window.location.href = 'admin-dashboard.html';
      } else {
        alert('Invalid username or password!');
      }
    });
  }

  // Check if we start on dashboard based on element existence
  if (document.querySelector('.admin-dashboard')) {
    if (!checkAdminAuth()) {
      return;
    }
    initDashboard();
  }
});

// Admin logout
function adminLogout() {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminUsername');
    window.location.href = 'admin-login.html';
  }
}

// ===== DASHBOARD INITIALIZATION =====
function initDashboard() {
  // Set admin name
  const adminName = localStorage.getItem('adminUsername') || 'Administrator';
  const adminNameEl = document.getElementById('admin-name');
  if (adminNameEl) {
    adminNameEl.textContent = adminName;
  }

  // Initialize navigation
  initNavigation();

  // Load initial data
  loadDashboardStats();
  loadRecentActivity();
  loadMusicTable();
  loadEffectsGrid();
  loadBackgroundsGrid();
  loadUsersTable();
  loadGiftsTable();

  // Initialize form handlers
  initFormHandlers();

  // Initialize mobile sidebar
  initMobileSidebar();
}

// ===== NAVIGATION =====
function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();

      // Remove active class from all items
      navItems.forEach(nav => nav.classList.remove('active'));

      // Add active class to clicked item
      item.classList.add('active');

      // Get section to show
      const section = item.dataset.section;

      // Hide all sections
      document.querySelectorAll('.content-section').forEach(sec => {
        sec.classList.remove('active');
      });

      // Show selected section
      const sectionEl = document.getElementById(`${section}-section`);
      if (sectionEl) {
        sectionEl.classList.add('active');
      }

      // Update header title
      const titles = {
        'overview': 'Dashboard Overview',
        'music': 'Music Management',
        'effects': 'Effects Management',
        'backgrounds': 'Background Management',
        'users': 'User Management',
        'gifts': 'Gifts Management'
      };

      document.getElementById('section-title').textContent = titles[section] || 'Dashboard';

      // Close sidebar on mobile after clicking
      if (window.innerWidth <= 768) {
        document.querySelector('.admin-sidebar').classList.remove('active');
        document.getElementById('sidebar-overlay').classList.remove('active');
      }
    });
  });
}

function initMobileSidebar() {
  const toggleBtn = document.getElementById('sidebar-toggle');
  const sidebar = document.querySelector('.admin-sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  if (toggleBtn && sidebar && overlay) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.add('active');
      overlay.classList.add('active');
    });

    overlay.addEventListener('click', () => {
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
    });
  }
}

// ===== DASHBOARD STATS =====
function loadDashboardStats() {
  // Get all localStorage data
  const users = getAllUsers();
  const gifts = getAllGifts();
  const music = getAdminMusic();
  const effects = getAdminEffects();
  const backgrounds = getAdminBackgrounds();

  // Update stats
  document.getElementById('total-users').textContent = users.length;
  document.getElementById('total-gifts').textContent = gifts.length;
  document.getElementById('total-music').textContent = music.length;
  document.getElementById('total-effects').textContent = effects.length;
  
  // Update backgrounds stat if it exists
  const bgStat = document.getElementById('total-backgrounds');
  if (bgStat) bgStat.textContent = backgrounds.length;
}

// ===== RECENT ACTIVITY =====
function loadRecentActivity() {
  const activityList = document.getElementById('activity-list');
  const gifts = getAllGifts();

  if (gifts.length === 0) {
    activityList.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-inbox"></i>
        <p>No recent activity</p>
      </div>
    `;
    return;
  }

  // Sort by date and get last 10
  const recentGifts = gifts
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10);

  activityList.innerHTML = recentGifts.map(gift => `
    <div class="activity-item">
      <div class="activity-icon">
        <i class="fas fa-gift"></i>
      </div>
      <div class="activity-info">
        <p><strong>${gift.senderName}</strong> created a gift for <strong>${gift.recipientName}</strong></p>
        <small>${formatDate(gift.createdAt)}</small>
      </div>
    </div>
  `).join('');
}

// ===== MUSIC MANAGEMENT =====
function getAdminMusic() {
  const music = localStorage.getItem('adminMusic');
  const adminUploaded = music ? JSON.parse(music) : [];
  
  // Add default system songs for visibility
  const defaultSongs = [
    { id: 'default_1', title: 'Happy Birthday Song 1', artist: 'Classical', fileName: 'happy-birthday-334876.mp3', isDefault: true },
    { id: 'default_2', title: 'Happy Birthday Song 2', artist: 'Upbeat', fileName: 'happy-birthday-357371.mp3', isDefault: true },
    { id: 'default_3', title: 'Happy Birthday Song 3', artist: 'Modern', fileName: 'happy-birthday-401919.mp3', isDefault: true },
    { id: 'default_4', title: 'Romantic & Love', artist: 'Alex Productions', fileName: '💗 Romantic & Love (Royalty Free Music) - ROMANTIC by Alex Productions 🇮🇹 - BreakingCopyright — Royalty Free Music.mp3', isDefault: true },
    { id: 'default_5', title: 'Education Background', artist: 'Study Music', fileName: 'Education Background Music Study Royalty Free - backgroundmusicforvideoedits.mp3', isDefault: true }
  ];
  
  return [...defaultSongs, ...adminUploaded];
}

function saveAdminMusic(music) {
  // Only save non-default music
  const toSave = music.filter(m => !m.isDefault);
  localStorage.setItem('adminMusic', JSON.stringify(toSave));
}

function loadMusicTable() {
  const tbody = document.getElementById('music-table-body');
  const music = getAdminMusic();

  if (music.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; padding: 40px;">
          <div class="empty-state">
            <i class="fas fa-music"></i>
            <p>No music tracks found</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = music.map(song => {
    // Display fileName if available, otherwise Generic
    const fileInfo = song.fileName || 'Uploaded File';

    return `
      <tr>
        <td>${song.title}</td>
        <td>${song.artist}</td>
        <td>${fileInfo}</td>
        <td>${formatDate(song.addedDate)}</td>
        <td>
          <div class="table-actions">
            ${song.isDefault ? 
              '<span style="color: #ff7b2d; font-size: 12px; font-weight: bold;">System</span>' : 
              `<button class="btn-action btn-delete" onclick="deleteMusic('${song.id}')">
                <i class="fas fa-trash"></i> Delete
              </button>`
            }
            <button class="btn-action btn-view" onclick="viewMusic('${song.id}')">
              <i class="fas fa-play"></i> Preview
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function showAddMusicModal() {
  document.getElementById('add-music-modal').classList.add('active');
}

function closeAddMusicModal() {
  document.getElementById('add-music-modal').classList.remove('active');
  document.getElementById('add-music-form').reset();
}

function addMusic(musicData) {
  const music = getAdminMusic();
  const newMusic = {
    ...musicData,
    addedDate: new Date().toISOString()
  };

  music.push(newMusic);
  saveAdminMusic(music);
  loadMusicTable();
  loadDashboardStats();
  closeAddMusicModal();
}

function deleteMusic(id) {
  showConfirmModal(
    'Are you sure you want to delete this music track?',
    () => {
      const music = getAdminMusic();
      const filtered = music.filter(m => m.id !== id);
      saveAdminMusic(filtered);

      // Also remove from adminMusicLibrary
      if (typeof removeFromAdminMusicLibrary === 'function') {
        removeFromAdminMusicLibrary(id);
      }

      loadMusicTable();
      loadDashboardStats();
      closeConfirmModal();
    }
  );
}

function viewMusic(id) {
  const music = getAdminMusic();
  const song = music.find(m => m.id === id);
  if (song) {
    window.open(`https://www.youtube.com/watch?v=${song.youtubeId}`, '_blank');
  }
}

// ===== EFFECTS MANAGEMENT =====
function getAdminEffects() {
  const effects = localStorage.getItem('adminEffects');
  const now = new Date().toISOString();
  return effects ? JSON.parse(effects) : [
    { id: 'balloon', name: 'Balloon', image: 'Assets/baloon.png', addedDate: now },
    { id: 'sparkles', name: 'Sparkle', image: 'Assets/sparkle.png', addedDate: now },
    { id: 'confetti', name: 'Confetti', image: 'Assets/18056-removebg-preview.png', addedDate: now },
    { id: 'hearts', name: 'Hearts', image: 'Assets/11571056.png', addedDate: now },
    { id: 'time', name: 'Time', image: 'Assets/Anything Worth having takes time (9).png', addedDate: now }
  ];
}

function saveAdminEffects(effects) {
  localStorage.setItem('adminEffects', JSON.stringify(effects));
}

function loadEffectsGrid() {
  const grid = document.getElementById('effects-grid');
  const effects = getAdminEffects();

  if (effects.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <i class="fas fa-magic"></i>
        <p>No effects found</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = effects.map(effect => {
    // Show image if data or image path available, otherwise show icon
    const displaySrc = effect.data || effect.image;
    const effectDisplay = displaySrc
      ? `<img src="${displaySrc}" alt="${effect.name}" style="width: 100px; height: 100px; object-fit: contain; border-radius: 10px;" />`
      : `<div class="effect-card-icon">${effect.icon || '✨'}</div>`;

    return `
      <div class="effect-card">
        ${effectDisplay}
        <div class="effect-card-name">${effect.name}</div>
        ${effect.id ? `<div class="effect-card-id">${effect.id}</div>` : ''}
        <div class="effect-card-actions">
          <button class="btn-action btn-delete" onclick="deleteEffect('${effect.id}')">
            <i class="fas fa-trash"></i> Delete
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function showAddEffectModal() {
  document.getElementById('add-effect-modal').classList.add('active');
}

function closeAddEffectModal() {
  document.getElementById('add-effect-modal').classList.remove('active');
  document.getElementById('add-effect-form').reset();
}

function addEffect(effectData) {
  const effects = getAdminEffects();
  const newEffect = {
    ...effectData,
    addedDate: new Date().toISOString()
  };

  effects.push(newEffect);
  saveAdminEffects(effects);
  loadEffectsGrid();
  loadDashboardStats();
  closeAddEffectModal();
}

function deleteEffect(id) {
  showConfirmModal(
    'Are you sure you want to delete this effect?',
    () => {
      const effects = getAdminEffects();
      const filtered = effects.filter(e => e.id !== id);
      saveAdminEffects(filtered);
      
      // Also remove from adminEffectLibrary for the user-facing part
      if (typeof removeFromAdminEffectLibrary === 'function') {
        removeFromAdminEffectLibrary(id);
      }
      
      loadEffectsGrid();
      loadDashboardStats();
      closeConfirmModal();
    }
  );
}

// ===== BACKGROUNDS MANAGEMENT =====
function getAdminBackgrounds() {
  const backgrounds = localStorage.getItem('adminBackgrounds');
  return backgrounds ? JSON.parse(backgrounds) : [
    { id: 'bg1', name: 'Dark', image: 'Assets/bg1.png', addedDate: new Date().toISOString() },
    { id: 'bg2', name: 'Starlight', image: 'Assets/bg2.png', addedDate: new Date().toISOString() },
    { id: 'bg3', name: 'Hearts', image: 'Assets/bg3.png', addedDate: new Date().toISOString() },
    { id: 'bg4', name: 'Cherry Bomb', image: 'Assets/bg4.png', addedDate: new Date().toISOString() }
  ];
}

function saveAdminBackgrounds(backgrounds) {
  localStorage.setItem('adminBackgrounds', JSON.stringify(backgrounds));
}

function loadBackgroundsGrid() {
  const grid = document.getElementById('backgrounds-grid');
  if (!grid) return;
  const backgrounds = getAdminBackgrounds();

  if (backgrounds.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <i class="fas fa-image"></i>
        <p>No backgrounds found</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = backgrounds.map(bg => {
    // Show image if data available (new format), otherwise show asset path
    const bgDisplay = bg.data || bg.image
      ? `<img src="${bg.data || bg.image}" alt="${bg.name}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 10px;" />`
      : `<div class="effect-card-icon"><i class="fas fa-image"></i></div>`;

    return `
      <div class="effect-card">
        ${bgDisplay}
        <div class="effect-card-name">${bg.name}</div>
        <div class="effect-card-actions">
          <button class="btn-action btn-delete" onclick="deleteBackground('${bg.id}')">
            <i class="fas fa-trash"></i> Delete
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function showAddBackgroundModal() {
  document.getElementById('add-background-modal').classList.add('active');
}

function closeAddBackgroundModal() {
  document.getElementById('add-background-modal').classList.remove('active');
  document.getElementById('add-background-form').reset();
}

function addBackground(bgData) {
  const backgrounds = getAdminBackgrounds();
  const newBackground = {
    ...bgData,
    addedDate: new Date().toISOString()
  };

  backgrounds.push(newBackground);
  saveAdminBackgrounds(backgrounds);
  loadBackgroundsGrid();
  loadDashboardStats();
  closeAddBackgroundModal();
}

function deleteBackground(id) {
  showConfirmModal(
    'Are you sure you want to delete this background?',
    () => {
      const backgrounds = getAdminBackgrounds();
      const filtered = backgrounds.filter(b => b.id !== id);
      saveAdminBackgrounds(filtered);
      
      // Also remove from adminBackgroundLibrary for user side
      if (typeof removeFromAdminBackgroundLibrary === 'function') {
        removeFromAdminBackgroundLibrary(id);
      }
      
      loadBackgroundsGrid();
      loadDashboardStats();
      closeConfirmModal();
    }
  );
}

// ===== USER MANAGEMENT =====
function getAllUsers() {
  const users = localStorage.getItem('registeredUsers');
  return users ? JSON.parse(users) : [];
}

function saveAllUsers(users) {
  localStorage.setItem('registeredUsers', JSON.stringify(users));
}

function loadUsersTable() {
  const tbody = document.getElementById('users-table-body');
  const users = getAllUsers();

  if (users.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; padding: 40px;">
          <div class="empty-state">
            <i class="fas fa-users"></i>
            <p>No registered users found</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = users.map(user => {
    const userGifts = getAllGifts().filter(g => g.senderName === user.name);
    return `
      <tr>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${formatDate(user.registeredDate)}</td>
        <td>${userGifts.length}</td>
        <td>
          <div class="table-actions">
            <button class="btn-action btn-delete" onclick="deleteUser('${user.email}')">
              <i class="fas fa-trash"></i> Delete
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function deleteUser(email) {
  showConfirmModal(
    'Are you sure you want to delete this user? This action cannot be undone.',
    () => {
      const users = getAllUsers();
      const filtered = users.filter(u => u.email !== email);
      saveAllUsers(filtered);
      loadUsersTable();
      loadDashboardStats();
      closeConfirmModal();
    }
  );
}

// ===== GIFTS MANAGEMENT =====
function getAllGifts() {
  const gifts = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('gift_')) {
      try {
        const gift = JSON.parse(localStorage.getItem(key));
        gifts.push({ ...gift, id: key });
      } catch (e) {
        console.error('Error parsing gift:', e);
      }
    }
  }
  return gifts;
}

function loadGiftsTable() {
  const tbody = document.getElementById('gifts-table-body');
  const gifts = getAllGifts();

  if (gifts.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 40px;">
          <div class="empty-state">
            <i class="fas fa-gift"></i>
            <p>No gifts found</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = gifts.map(gift => {
    const letterCount = 1 + (gift.collaborators ? gift.collaborators.length : 0);
    return `
    <tr>
      <td><code>${gift.id.substring(0, 15)}...</code></td>
      <td>${gift.recipientName || 'N/A'}</td>
      <td>${gift.senderName}</td>
      <td><span style="background: #2a0d3a; color: white; padding: 4px 12px; border-radius: 6px; font-size: 12px;">${gift.momentType}</span></td>
      <td><span style="background: #ff7b2d; color: white; padding: 4px 12px; border-radius: 6px; font-size: 12px;">${letterCount} Letters</span></td>
      <td>${formatDate(gift.createdAt)}</td>
      <td>
        <div class="table-actions">
          <button class="btn-action btn-view" onclick="viewGift('${gift.id}')">
            <i class="fas fa-eye"></i> View
          </button>
          <button class="btn-action btn-delete" onclick="deleteGift('${gift.id}')">
            <i class="fas fa-trash"></i> Delete
          </button>
        </div>
      </td>
    </tr>
  `}).join('');
}

function viewGift(id) {
  window.open(`gift.html?id=${id}`, '_blank');
}

function deleteGift(id) {
  showConfirmModal(
    'Are you sure you want to delete this gift?',
    () => {
      localStorage.removeItem(id);
      loadGiftsTable();
      loadDashboardStats();
      loadRecentActivity();
      closeConfirmModal();
    }
  );
}

// ===== FORM HANDLERS =====
function initFormHandlers() {
  // Add Music Form
  const addMusicForm = document.getElementById('add-music-form');
  if (addMusicForm) {
    addMusicForm.addEventListener('submit', (e) => {
      e.preventDefault();

      try {
        // Get form data from admin-upload-handlers.js
        if (typeof getAdminMusicFormData !== 'function') {
          throw new Error('Form handler not loaded properly');
        }

        const formData = getAdminMusicFormData();

        if (!formData) {
          return; // Validation failed, alert already shown
        }

        // Generate a shared ID
        const musicId = 'song_' + Date.now();

        // Add to admin music library using file-upload-utils.js with specific ID
        const musicAdded = addToAdminMusicLibrary(formData.title + ' - ' + formData.artist, formData.data, musicId);

        if (musicAdded) {
          // Also save to old format for backward compatibility
          const musicData = {
            id: musicId,
            title: formData.title,
            artist: formData.artist,
            fileName: formData.fileName,
            data: formData.data
          };

          addMusic(musicData);

          // Reset form
          resetAdminMusicForm();

          alert('Music added successfully!');
        }
      } catch (err) {
        console.error('Error adding music:', err);
        if (err.name === 'QuotaExceededError' || err.message.includes('exceeded the quota')) {
          alert('Storage Full! Browser storage is limited (usually 5MB). Please delete old music/effects or try a smaller file (under 1-2MB).');
        } else {
          alert('Failed to add music: ' + err.message);
        }
      }
    });
  }

  // Add Effect Form
  const addEffectForm = document.getElementById('add-effect-form');
  if (addEffectForm) {
    addEffectForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Get form data from admin-upload-handlers.js
      const formData = getAdminEffectFormData();

      if (!formData) {
        return; // Validation failed, alert already shown
      }

      // Add to admin effect library using file-upload-utils.js
      const effectAdded = addToAdminEffectLibrary(formData.name, formData.data);

      if (effectAdded) {
        // Also save to old format for backward compatibility
        const effectData = {
          id: 'effect_' + Date.now(),
          name: formData.name,
          fileName: formData.fileName,
          data: formData.data
        };

        addEffect(effectData);

        // Reset form
        resetAdminEffectForm();

        alert('Effect added successfully!');
      }
    });
  }

  // Add Background Form
  const addBackgroundForm = document.getElementById('add-background-form');
  if (addBackgroundForm) {
    addBackgroundForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Get form data from admin-upload-handlers.js
      const formData = getAdminBackgroundFormData();

      if (!formData) {
        return; // Validation failed, alert already shown
      }

      // Add to admin background library using file-upload-utils.js
      const bgAdded = addToAdminBackgroundLibrary(formData.name, formData.data);

      if (bgAdded) {
        // Also save to old format for admin panel grid
        const bgData = {
          id: 'bg_' + Date.now(),
          name: formData.name,
          fileName: formData.fileName,
          data: formData.data
        };

        addBackground(bgData);

        // Reset form
        resetAdminBackgroundForm();

        alert('Background added successfully!');
      }
    });
  }
}

// ===== CONFIRMATION MODAL =====
function showConfirmModal(message, onConfirm) {
  const modal = document.getElementById('confirm-modal');
  const messageEl = document.getElementById('confirm-message');
  const confirmBtn = document.getElementById('confirm-action-btn');

  messageEl.textContent = message;
  modal.classList.add('active');

  // Remove old event listeners
  const newConfirmBtn = confirmBtn.cloneNode(true);
  confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

  // Add new event listener
  newConfirmBtn.addEventListener('click', onConfirm);
}

function closeConfirmModal() {
  document.getElementById('confirm-modal').classList.remove('active');
}

// ===== UTILITY FUNCTIONS =====
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return date.toLocaleDateString('en-US', options);
}

// Close modals when clicking outside
window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    e.target.classList.remove('active');
  }
});
