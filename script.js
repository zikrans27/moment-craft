// --- LOGIN STATE MANAGEMENT ---
let isUserLoggedIn = false;

// Check if user is logged in
function checkLoginStatus() {
    const loginStatus = localStorage.getItem('userLoggedIn');
    isUserLoggedIn = loginStatus === 'true';
    return isUserLoggedIn;
}

// Set login status
function setLoginStatus(status) {
    isUserLoggedIn = status;
    localStorage.setItem('userLoggedIn', status.toString());
}

// Show login popup for premium features
function showLoginPopup(featureName, onLoginCallback) {
    const overlay = document.createElement('div');
    overlay.id = 'login-popup-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        z-index: 10000;
        display: flex;
        justify-content: center;
        align-items: center;
        backdrop-filter: blur(5px);
    `;

    const modal = document.createElement('div');
    modal.style.cssText = `
        background: white;
        padding: 40px;
        border-radius: 20px;
        max-width: 450px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: slideIn 0.3s ease;
    `;

    // Add animation keyframes
    if (!document.getElementById('popup-animation-style')) {
        const style = document.createElement('style');
        style.id = 'popup-animation-style';
        style.textContent = `
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(-30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }

    modal.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #2d1b4e; margin-bottom: 10px; font-size: 26px;">Login Diperlukan</h2>
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
                Untuk menggunakan fitur <strong style="color: #ff7b2d;">${featureName}</strong>, silakan login terlebih dahulu.
            </p>
        </div>
        
        <form id="mini-login-form" style="margin-bottom: 20px;">
            <div style="margin-bottom: 15px;">
                <input 
                    type="email" 
                    id="mini-login-email" 
                    placeholder="Email" 
                    required 
                    style="
                        width: 100%;
                        padding: 15px;
                        border: 2px solid #e0e0e0;
                        border-radius: 10px;
                        font-size: 15px;
                        transition: border 0.3s ease;
                        box-sizing: border-box;
                    "
                />
            </div>
            <div style="margin-bottom: 20px;">
                <input 
                    type="password" 
                    id="mini-login-password" 
                    placeholder="Password" 
                    required 
                    style="
                        width: 100%;
                        padding: 15px;
                        border: 2px solid #e0e0e0;
                        border-radius: 10px;
                        font-size: 15px;
                        transition: border 0.3s ease;
                        box-sizing: border-box;
                    "
                />
            </div>
            <button type="submit" style="
                width: 100%;
                background: #ff7b2d;
                color: white;
                border: none;
                padding: 15px;
                border-radius: 10px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(255, 123, 45, 0.3);
            ">
                Login
            </button>
        </form>
        
        <div style="text-align: center; margin-bottom: 20px;">
            <p style="color: #999; font-size: 13px; margin-bottom: 10px;">Belum punya akun?</p>
            <button id="show-register-btn" style="
                background: transparent;
                color: #ff7b2d;
                border: 2px solid #ff7b2d;
                padding: 12px 30px;
                border-radius: 10px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            ">
                Daftar Sekarang
            </button>
        </div>
        
        <button id="cancel-popup-btn" style="
            width: 100%;
            background: #f5f5f5;
            color: #666;
            border: none;
            padding: 12px;
            border-radius: 10px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        ">
            Batal
        </button>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Add hover effects
    const inputs = modal.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.style.borderColor = '#ff7b2d';
        });
        input.addEventListener('blur', () => {
            input.style.borderColor = '#e0e0e0';
        });
    });

    // Login form submission
    document.getElementById('mini-login-form').addEventListener('submit', (e) => {
        e.preventDefault();

        // Set user as logged in
        setLoginStatus(true);

        // Close popup
        document.body.removeChild(overlay);

        // Show success message
        showMessageBox("Login Berhasil", "Selamat datang! Anda sekarang dapat menggunakan fitur " + featureName + ".");

        // Execute callback after message box is closed
        setTimeout(() => {
            if (onLoginCallback) {
                onLoginCallback();
            }
        }, 1500);
    });

    // Show register form
    document.getElementById('show-register-btn').addEventListener('click', () => {
        showRegisterPopup(featureName, onLoginCallback);
        document.body.removeChild(overlay);
    });

    // Cancel button handler
    document.getElementById('cancel-popup-btn').addEventListener('click', () => {
        document.body.removeChild(overlay);
    });

    // Click outside to close
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
        }
    });
}

// Show register popup for premium features
function showRegisterPopup(featureName, onLoginCallback) {
    const overlay = document.createElement('div');
    overlay.id = 'register-popup-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        z-index: 10000;
        display: flex;
        justify-content: center;
        align-items: center;
        backdrop-filter: blur(5px);
    `;

    const modal = document.createElement('div');
    modal.style.cssText = `
        background: white;
        padding: 40px;
        border-radius: 20px;
        max-width: 450px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: slideIn 0.3s ease;
    `;

    modal.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #2d1b4e; margin-bottom: 10px; font-size: 26px;">Buat Akun Baru</h2>
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
                Daftar untuk menggunakan fitur <strong style="color: #ff7b2d;">${featureName}</strong>
            </p>
        </div>
        
        <form id="mini-register-form" style="margin-bottom: 20px;">
            <div style="margin-bottom: 15px;">
                <input 
                    type="text" 
                    id="mini-register-name" 
                    placeholder="Nama Lengkap" 
                    required 
                    style="
                        width: 100%;
                        padding: 15px;
                        border: 2px solid #e0e0e0;
                        border-radius: 10px;
                        font-size: 15px;
                        transition: border 0.3s ease;
                        box-sizing: border-box;
                    "
                />
            </div>
            <div style="margin-bottom: 15px;">
                <input 
                    type="email" 
                    id="mini-register-email" 
                    placeholder="Email" 
                    required 
                    style="
                        width: 100%;
                        padding: 15px;
                        border: 2px solid #e0e0e0;
                        border-radius: 10px;
                        font-size: 15px;
                        transition: border 0.3s ease;
                        box-sizing: border-box;
                    "
                />
            </div>
            <div style="margin-bottom: 20px;">
                <input 
                    type="password" 
                    id="mini-register-password" 
                    placeholder="Password" 
                    required 
                    style="
                        width: 100%;
                        padding: 15px;
                        border: 2px solid #e0e0e0;
                        border-radius: 10px;
                        font-size: 15px;
                        transition: border 0.3s ease;
                        box-sizing: border-box;
                    "
                />
            </div>
            <button type="submit" style="
                width: 100%;
                background: #ff7b2d;
                color: white;
                border: none;
                padding: 15px;
                border-radius: 10px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(255, 123, 45, 0.3);
            ">
                Daftar
            </button>
        </form>
        
        <div style="text-align: center; margin-bottom: 20px;">
            <p style="color: #999; font-size: 13px; margin-bottom: 10px;">Sudah punya akun?</p>
            <button id="show-login-btn" style="
                background: transparent;
                color: #ff7b2d;
                border: 2px solid #ff7b2d;
                padding: 12px 30px;
                border-radius: 10px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            ">
                Login
            </button>
        </div>
        
        <button id="cancel-register-btn" style="
            width: 100%;
            background: #f5f5f5;
            color: #666;
            border: none;
            padding: 12px;
            border-radius: 10px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        ">
            Batal
        </button>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Add hover effects
    const inputs = modal.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.style.borderColor = '#ff7b2d';
        });
        input.addEventListener('blur', () => {
            input.style.borderColor = '#e0e0e0';
        });
    });

    // Register form submission
    document.getElementById('mini-register-form').addEventListener('submit', (e) => {
        e.preventDefault();

        // Set user as logged in
        setLoginStatus(true);

        // Close popup
        document.body.removeChild(overlay);

        // Show success message
        showMessageBox("Registrasi Berhasil", "Akun berhasil dibuat! Anda sekarang sudah login.");

        // Execute callback after message box is closed
        setTimeout(() => {
            if (onLoginCallback) {
                onLoginCallback();
            }
        }, 1500);
    });

    // Show login form
    document.getElementById('show-login-btn').addEventListener('click', () => {
        showLoginPopup(featureName, onLoginCallback);
        document.body.removeChild(overlay);
    });

    // Cancel button handler
    document.getElementById('cancel-register-btn').addEventListener('click', () => {
        document.body.removeChild(overlay);
    });

    // Click outside to close
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
        }
    });
}

// --- MESSAGE BOX LOGIC ---
window.showMessageBox = (title, text) => {
    document.getElementById('message-title').textContent = title;
    document.getElementById('message-text').textContent = text;
    document.getElementById('message-overlay').classList.add('active');
    document.getElementById('message-box').classList.add('active');
};

window.hideMessageBox = () => {
    document.getElementById('message-overlay').classList.remove('active');
    document.getElementById('message-box').classList.remove('active');
};

// --- PAGE INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    // Clear previous selections when starting new gift creation
    // This ensures customization only shows if user actively selects it for THIS gift
    localStorage.removeItem('selectedMusic');
    localStorage.removeItem('selectedEffect');
    localStorage.removeItem('selectedBackground');
    localStorage.removeItem('selectedFontColor');
    console.log('✅ Customization selections cleared - ready for new gift');

    // Check login status
    checkLoginStatus();
});

// --- PAGE NAVIGATION LOGIC ---
window.showPage = (pageId) => {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    const page = document.getElementById(pageId);
    if (page) {
        page.classList.add('active');
    }
};

// --- GIFT CREATION FLOW ---
window.startGiftCreation = (moment) => {
    document.getElementById('selected-moment').value = moment;
    document.getElementById('current-moment-title').textContent = moment;
    showPage('create-gift');
}

// --- IMAGE UPLOAD PREVIEW WITH COMPRESSION ---
function compressImage(file, maxWidth = 800, quality = 0.7) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.onload = function () {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Resize if image is too large
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Compress to JPEG with quality setting
                const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
                resolve(compressedDataUrl);
            };
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('file-upload-input');
    if (fileInput) {
        fileInput.addEventListener('change', async function (event) {
            const input = event.target;
            const preview = document.getElementById('upload-preview');
            const status = document.getElementById('upload-status');
            const icon = document.querySelector('.upload-icon');

            if (input.files && input.files[0]) {
                try {
                    // Compress image before preview
                    const compressedImage = await compressImage(input.files[0]);
                    preview.src = compressedImage;
                    preview.style.display = 'block';

                    // Hide icon and status as requested
                    if (status) status.style.display = 'none';
                    if (icon) icon.style.display = 'none';

                    console.log('Image uploaded and UI updated');
                } catch (error) {
                    console.error('Error compressing image:', error);
                    if (status) {
                        status.style.display = 'block';
                        status.textContent = 'Error loading image';
                    }
                }
            } else {
                preview.src = '#';
                preview.style.display = 'none';
                if (status) {
                    status.style.display = 'block';
                    status.textContent = 'Click to upload image or video moment';
                }
                if (icon) icon.style.display = 'block';
            }
        });
    }

    // Initial load: Hide splash and show welcome after a delay
    setTimeout(() => {
        // Check if collaboration mode
        const urlParams = new URLSearchParams(window.location.search);
        const mode = urlParams.get('mode');
        const giftId = urlParams.get('giftId');

        if (mode === 'collaboration' && giftId) {
            // Collaboration mode: go directly to create page
            showPage('create-gift');

            // Store gift ID for later use
            window.collaborationGiftId = giftId;

            // Load existing gift data to get moment type
            const existingGift = localStorage.getItem(giftId);
            if (existingGift) {
                const giftData = JSON.parse(existingGift);
                const moment = giftData.momentType || 'Birthday';
                document.getElementById('selected-moment').value = moment;
                document.getElementById('current-moment-title').textContent = moment;

                // Reset background to default (do not apply creator's background visually)
                // The default style.css background will be used.

                // Inherit and Persist settings in localStorage for the collaborator's session
                // We typically want to respect the creator's choice (so the letter fits in),
                // but the user requested: "background collaboration sesuaikan dengan background defaulnya"
                // and "status effect dan musiknya di hapus saja".
                
                // Keep the values in variables so they are saved with the letter (if needed for consistency later),
                // OR reset them if 'default' means 'no effect'. 
                // However, usually collaboration letters should match the theme. 
                // But the user specifically asked to remove the PREVIEW/STATUS of them.
                
                selectedEffectId = giftData.effect || 'none';
                selectedBackgroundId = giftData.selectedBackground || 'bg1';
                selectedFontColorId = giftData.selectedFontColor || 'white';

                localStorage.setItem('selectedEffect', selectedEffectId);
                localStorage.setItem('selectedBackground', selectedBackgroundId);
                localStorage.setItem('selectedFontColor', selectedFontColorId);

                // Hide the status displays for Effect and Music
                const selectedInfos = document.querySelectorAll('.selected-info');
                selectedInfos.forEach(el => el.style.display = 'none');
            }

            // Hide recipient name field and remove required attribute
            const recipientField = document.getElementById('recipient-name');
            if (recipientField) {
                recipientField.removeAttribute('required'); // Remove required validation
                const recipientFormGroup = recipientField.closest('.form-group');
                if (recipientFormGroup) {
                    recipientFormGroup.style.display = 'none';
                }
            }

            // Hide collaboration, music, and effect icons in collaboration mode
            const sidebarIcons = document.querySelector('.sidebar-icons');
            if (sidebarIcons) {
                const iconButtons = sidebarIcons.querySelectorAll('.icon-btn');
                // Hide all sidebar icons (music, effect, collaboration)
                iconButtons.forEach(btn => {
                    btn.style.display = 'none';
                });
            }
        } else {
            showPage('welcome');
        }
    }, 1500);

    // Attach form submission handlers
    document.getElementById('gift-creation-form').addEventListener('submit', handleGiftSubmission);
    document.getElementById('login-form').addEventListener('submit', handleLoginSubmission);
    document.getElementById('register-form').addEventListener('submit', handleRegisterSubmission);

    // Render effects on load for the modal
    renderEffects();

    // Restore music display if music was previously selected
    const savedMusic = localStorage.getItem('selectedMusic');
    if (savedMusic) {
        const musicData = JSON.parse(savedMusic);
        const musicDisplay = document.getElementById('music-display');
        if (musicDisplay) {
            musicDisplay.textContent = (musicData.title || musicData.name) + (musicData.artist ? ` - ${musicData.artist}` : '');
        }
    }
});


// --- EFFECT SELECTION LOGIC ---
const effects = [
    { id: 'balloon', name: 'Balloon', image: 'Assets/baloon.png' },
    { id: 'sparkles', name: 'Sparkle', image: 'Assets/sparkle.png' },
    { id: 'confetti', name: 'Confetti', image: 'Assets/18056-removebg-preview.png' },
    { id: 'hearts', name: 'Hearts', image: 'Assets/11571056.png' },
    { id: 'time', name: 'Time', image: 'Assets/Anything Worth having takes time (9).png' }
];

const backgrounds = [
    { id: 'bg1', name: 'dark', image: 'Assets/bg1.png' },
    { id: 'bg2', name: 'starlight', image: 'Assets/bg2.png' },
    { id: 'bg3', name: 'hearts', image: 'Assets/bg3.png' },
    { id: 'bg4', name: 'cherry bomb', image: 'Assets/bg4.png' }
];

const fontColors = [
    { id: 'black', name: 'Hitam', value: '#000000' },
    { id: 'brown', name: 'Coklat', value: '#8B4513' },
    { id: 'blue', name: 'Biru', value: '#0066cc' },
    { id: 'green', name: 'Hijau', value: '#2d8659' },
    { id: 'purple', name: 'Ungu', value: '#800080' }
];

let selectedEffectId = 'none';
let selectedBackgroundId = 'bg1';
let selectedFontColorId = 'black';

function renderEffects() {
    const container = document.getElementById('effect-grid-container');
    container.innerHTML = '';

    // Combine default and admin effects
    const adminEffects = typeof getAdminEffectLibrary === 'function' ? getAdminEffectLibrary() : [];
    const allEffects = [...effects, ...adminEffects.map(e => ({ id: e.id, name: e.name, data: e.data }))];

    allEffects.forEach(effect => {
        const isActive = effect.id === selectedEffectId ? 'active' : '';
        const item = document.createElement('div');
        item.className = `effect-item ${isActive}`;
        item.dataset.effectId = effect.id;

        const display = (effect.data || effect.image)
            ? `<img src="${effect.data || effect.image}" alt="${effect.name}" style="width: 40px; height: 40px; object-fit: contain;" />`
            : `<div class="effect-icon">${effect.icon || '✨'}</div>`;

        item.innerHTML = `
            ${display}
            <div class="effect-name">${effect.name}</div>
        `;
        item.addEventListener('click', () => {
            document.querySelectorAll('.effect-item').forEach(e => e.classList.remove('active'));
            item.classList.add('active');
            selectedEffectId = effect.id;
        });
        container.appendChild(item);
    });
}

function renderBackgrounds() {
    const container = document.getElementById('background-grid-container');
    container.innerHTML = '';

    // Combine default and admin backgrounds
    const adminBackgrounds = typeof getAdminBackgroundLibrary === 'function' ? getAdminBackgroundLibrary() : [];
    const allBackgrounds = [...backgrounds, ...adminBackgrounds.map(bg => ({ id: bg.id, name: bg.name, image: bg.data }))];

    allBackgrounds.forEach(bg => {
        const isActive = bg.id === selectedBackgroundId ? 'selected' : '';
        const item = document.createElement('div');
        item.className = `background-item ${isActive}`;
        item.dataset.bgId = bg.id;

        // Show image preview
        item.style.backgroundImage = `url('${bg.image}')`;
        item.style.backgroundSize = 'cover';
        item.style.backgroundPosition = 'center';

        item.addEventListener('click', () => {
            document.querySelectorAll('.background-item').forEach(e => e.classList.remove('selected'));
            item.classList.add('selected');
            selectedBackgroundId = bg.id;
        });
        container.appendChild(item);
    });
}

function renderFontColors() {
    const container = document.getElementById('fontcolor-list-container');
    container.innerHTML = '';
    fontColors.forEach((color, index) => {
        const isChecked = color.id === selectedFontColorId ? 'checked' : '';
        const item = document.createElement('div');
        item.className = 'fontcolor-item';
        item.innerHTML = `
            <input type="radio" id="font-${color.id}" name="fontcolor" value="${color.id}" ${isChecked}>
            <label for="font-${color.id}">${color.name}</label>
        `;
        item.addEventListener('click', () => {
            document.getElementById(`font-${color.id}`).checked = true;
            selectedFontColorId = color.id;
        });
        container.appendChild(item);
    });
}

window.showEffectSelection = () => {
    // Check if user is logged in
    if (!checkLoginStatus()) {
        showLoginPopup('Effect', () => {
            showEffectSelection();
        });
        return;
    }

    // Load saved selections from localStorage if they exist
    const savedEffect = localStorage.getItem('selectedEffect');
    const savedBackground = localStorage.getItem('selectedBackground');
    const savedFontColor = localStorage.getItem('selectedFontColor');

    if (savedEffect) selectedEffectId = savedEffect;
    if (savedBackground) selectedBackgroundId = savedBackground;
    if (savedFontColor) selectedFontColorId = savedFontColor;

    renderEffects();
    renderBackgrounds();
    renderFontColors();
    document.getElementById('effect-selection-page').classList.add('active');
};

window.hideEffectSelection = () => {
    document.getElementById('effect-selection-page').classList.remove('active');
};

window.closeEffectIfClickOutside = (event) => {
    // Close modal if clicking on the dark overlay (not the modal content)
    if (event.target.id === 'effect-selection-page') {
        hideEffectSelection();
    }
};

window.applyEffect = () => {
    // Combine all to find the name
    const adminEffects = typeof getAdminEffectLibrary === 'function' ? getAdminEffectLibrary() : [];
    const allEffects = [...effects, ...adminEffects.map(e => ({ id: e.id, name: e.name }))];

    const adminBackgrounds = typeof getAdminBackgroundLibrary === 'function' ? getAdminBackgroundLibrary() : [];
    const allBackgrounds = [...backgrounds, ...adminBackgrounds.map(bg => ({ id: bg.id, name: bg.name }))];

    // Get selected names for display
    const effectName = allEffects.find(e => e.id === selectedEffectId)?.name || 'None';
    const backgroundName = allBackgrounds.find(b => b.id === selectedBackgroundId)?.name || 'Default';
    const fontColorName = fontColors.find(c => c.id === selectedFontColorId)?.name || 'White';

    // Save selections to localStorage
    localStorage.setItem('selectedEffect', selectedEffectId);
    localStorage.setItem('selectedBackground', selectedBackgroundId);
    localStorage.setItem('selectedFontColor', selectedFontColorId);

    // Update display in form
    document.getElementById('effect-display').textContent = `${effectName}, ${backgroundName}, ${fontColorName}`;

    // Update hidden input for form submission
    const effectInput = document.getElementById('selected-effect');
    if (effectInput) {
        effectInput.value = selectedEffectId;
    }

    hideEffectSelection();
};

// --- FORM SUBMISSION HANDLERS ---
let currentGiftURL = '';

function handleGiftSubmission(event) {
    event.preventDefault();

    // Check if this is collaboration mode
    if (window.collaborationGiftId) {
        // Collaboration mode: add letter to existing gift
        const giftId = window.collaborationGiftId;
        const existingGiftData = localStorage.getItem(giftId);

        if (!existingGiftData) {
            showMessageBox('Error', 'Gift tidak ditemukan. Link kolaborasi mungkin sudah tidak valid.');
            return;
        }

        const giftData = JSON.parse(existingGiftData);

        // Get collaborator's data
        const senderName = document.getElementById('sender-name').value;
        const message = document.getElementById('gift-message').value;
        const uploadPreview = document.getElementById('upload-preview');
        const imageData = uploadPreview.style.display === 'block' ? uploadPreview.src : null;

        // Add collaborator's letter
        if (!giftData.collaborators) {
            giftData.collaborators = [];
        }

        giftData.collaborators.push({
            senderName,
            message,
            imageData,
            createdAt: new Date().toISOString(),
            authorLoggedIn: isUserLoggedIn
        });

        // Save updated gift data
        localStorage.setItem(giftId, JSON.stringify(giftData));

        // Generate gift URL
        const protocol = window.location.protocol;
        const host = window.location.host;
        const pathname = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));
        currentGiftURL = `${protocol}//${host}${pathname}/gift.html?id=${giftId}`;
        localStorage.setItem('lastGiftURL', currentGiftURL);

        // Redirect to share page
        window.location.href = `share.html?id=${giftId}`;

    } else {
        // Normal mode: create new gift
        const recipientNameField = document.getElementById('recipient-name');
        const recipientName = recipientNameField ? recipientNameField.value : '';
        const senderName = document.getElementById('sender-name').value;
        const message = document.getElementById('gift-message').value;
        const momentType = document.getElementById('selected-moment').value;
        const effect = document.getElementById('selected-effect').value;
        const uploadPreview = document.getElementById('upload-preview');
        const imageData = uploadPreview.style.display === 'block' ? uploadPreview.src : null;

        // Generate a unique gift ID
        const giftId = 'gift_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

        // Create complete gift data object
        const giftData = {
            recipientName,
            senderName,
            message,
            momentType,
            effect: localStorage.getItem('selectedEffect') || 'none',
            selectedBackground: localStorage.getItem('selectedBackground') || 'bg1',
            selectedFontColor: localStorage.getItem('selectedFontColor') || 'white',
            selectedMusic: JSON.parse(localStorage.getItem('selectedMusic') || 'null'),
            imageData,
            createdAt: new Date().toISOString(),
            authorLoggedIn: isUserLoggedIn,
            collaborators: []
        };

        // Save gift data to localStorage with gift ID as key
        localStorage.setItem(giftId, JSON.stringify(giftData));
        console.log("Gift saved to localStorage:", giftId, giftData);

        // Generate localhost gift URL
        const protocol = window.location.protocol;
        const host = window.location.host;
        const pathname = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));
        currentGiftURL = `${protocol}//${host}${pathname}/gift.html?id=${giftId}`;

        // Save URL for share page
        localStorage.setItem('lastGiftURL', currentGiftURL);

        // Redirect to share page
        window.location.href = `share.html?id=${giftId}`;
    }
}

// Copy Gift URL to Clipboard
window.copyGiftURL = async () => {
    try {
        await navigator.clipboard.writeText(currentGiftURL);
        showMessageBox("Berhasil!", "URL kado telah disalin ke clipboard!");
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = currentGiftURL;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showMessageBox("Berhasil!", "URL kado telah disalin ke clipboard!");
        } catch (err) {
            showMessageBox("Error", "Gagal menyalin URL. Silakan coba lagi.");
        }
        document.body.removeChild(textArea);
    }
};

// Share Gift using Web Share API
window.shareGift = async () => {
    const shareData = {
        title: 'MomentCraft Gift',
        text: 'Saya telah membuat kado spesial untuk Anda!',
        url: currentGiftURL
    };

    try {
        if (navigator.share) {
            await navigator.share(shareData);
            console.log('Gift shared successfully');
        } else {
            // Fallback: copy to clipboard if share is not supported
            await navigator.clipboard.writeText(currentGiftURL);
            showMessageBox("Info", "Browser Anda tidak mendukung fitur berbagi. URL telah disalin ke clipboard!");
        }
    } catch (err) {
        if (err.name !== 'AbortError') {
            console.error('Error sharing:', err);
            showMessageBox("Error", "Gagal membagikan kado. Silakan coba lagi.");
        }
    }
};


function handleLoginSubmission(event) {
    event.preventDefault();

    // Set user as logged in
    setLoginStatus(true);

    showMessageBox("Login Berhasil", "Selamat datang! Anda sekarang dapat menggunakan semua fitur.");

    setTimeout(() => {
        showPage('moment-selection');
    }, 1000);
}

function handleRegisterSubmission(event) {
    event.preventDefault();

    // Get form data
    const name = event.target.querySelector('input[type="text"]').value;
    const email = event.target.querySelector('input[type="email"]').value;
    const password = event.target.querySelector('input[type="password"]').value;

    // Get existing users or create new array
    let registeredUsers = localStorage.getItem('registeredUsers');
    registeredUsers = registeredUsers ? JSON.parse(registeredUsers) : [];

    // Check if user already exists
    const userExists = registeredUsers.some(user => user.email === email);
    if (userExists) {
        showMessageBox("Error", "Email sudah terdaftar. Silakan gunakan email lain atau login.");
        return;
    }

    // Add new user
    const newUser = {
        name: name,
        email: email,
        password: password, // In production, this should be hashed
        registeredDate: new Date().toISOString()
    };

    registeredUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

    // Set user as logged in
    setLoginStatus(true);
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    showMessageBox("Registrasi Berhasil", "Akun berhasil dibuat! Anda sekarang sudah login.");

    setTimeout(() => {
        showPage('moment-selection');
    }, 1000);
}

// Redundant submit handler removed - now using handleGiftSubmission above

// --- MUSIC SELECTION LOGIC REMOVED - NOW HANDLED BY music-upload.js ---
// This section used to contain duplicate logic that conflicted with music-upload.js
// All music selection is now centralized in music-upload.js for better admin integration.


// --- COLLABORATION MODE LOGIC ---
window.showCollaborationMode = () => {
    // Check if user is logged in
    if (!checkLoginStatus()) {
        showLoginPopup('Kolaborasi', () => {
            showCollaborationMode();
        });
        return;
    }

    // First, save current gift data to get gift ID
    const recipientNameField = document.getElementById('recipient-name');
    const recipientName = recipientNameField ? recipientNameField.value : '';
    const senderName = document.getElementById('sender-name').value;
    const message = document.getElementById('gift-message').value;
    const momentType = document.getElementById('selected-moment').value;
    const effect = document.getElementById('selected-effect').value;
    const uploadPreview = document.getElementById('upload-preview');
    const imageData = uploadPreview.style.display === 'block' ? uploadPreview.src : null;

    // Validate that at least sender name and message are filled
    if (!senderName || !message) {
        showMessageBox('Peringatan', 'Mohon isi Your Name dan Message terlebih dahulu sebelum membuat link kolaborasi.');
        return;
    }

    // Generate a unique gift ID
    const giftId = 'gift_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

    // Create initial gift data
    const giftData = {
        recipientName,
        senderName,
        message,
        momentType,
        effect: localStorage.getItem('selectedEffect') || 'none',
        selectedBackground: localStorage.getItem('selectedBackground') || 'bg1',
        selectedFontColor: localStorage.getItem('selectedFontColor') || 'white',
        selectedMusic: JSON.parse(localStorage.getItem('selectedMusic') || 'null'),
        imageData,
        createdAt: new Date().toISOString(),
        authorLoggedIn: isUserLoggedIn,
        collaborators: [] // Array to store additional letters
    };

    // Save gift data to localStorage
    localStorage.setItem(giftId, JSON.stringify(giftData));

    // Generate collaboration link with gift ID
    const protocol = window.location.protocol;
    const host = window.location.host;
    const pathname = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));
    const collabLink = `${protocol}//${host}${pathname}/index.html?mode=collaboration&giftId=${giftId}`;

    // Create custom modal for collaboration link
    const overlay = document.createElement('div');
    overlay.id = 'collab-link-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 10000;
        display: flex;
        justify-content: center;
        align-items: center;
    `;

    const modal = document.createElement('div');
    modal.style.cssText = `
        background: white;
        padding: 40px;
        border-radius: 15px;
        max-width: 500px;
        width: 90%;
        text-align: center;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    `;

    modal.innerHTML = `
        <h2 style="color: #2d1b4e; margin-bottom: 20px; font-size: 24px;">Link Kolaborasi</h2>
        <p style="color: #666; margin-bottom: 20px; line-height: 1.6;">
            Link kolaborasi telah dibuat! Bagikan link ini: 
        </p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px; word-break: break-all; font-size: 14px; color: #333;">
            ${collabLink}
        </div>
        <p style="color: #666; margin-bottom: 30px; font-size: 14px;">
            Kolaborator dapat menambahkan surat mereka ke kado ini.
        </p>
        <div style="display: flex; gap: 10px; justify-content: center;">
            <button id="copy-collab-link-btn" style="
                background: #ff7b2d;
                color: white;
                border: none;
                padding: 15px 30px;
                border-radius: 30px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 10px rgba(255, 123, 45, 0.3);
            ">
                <i class="fas fa-copy"></i> Salin Link
            </button>
            <button id="close-collab-modal-btn" style="
                background: #d1d1d1;
                color: #2d1b4e;
                border: none;
                padding: 15px 30px;
                border-radius: 30px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            ">
                OK
            </button>
        </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Copy button handler
    document.getElementById('copy-collab-link-btn').addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(collabLink);
            const btn = document.getElementById('copy-collab-link-btn');
            btn.innerHTML = '<i class="fas fa-check"></i> Tersalin!';
            btn.style.background = '#4caf50';
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-copy"></i> Salin Link';
                btn.style.background = '#ff7b2d';
            }, 2000);
        } catch (err) {
            console.error('Failed to copy link:', err);
            alert('Gagal menyalin link. Silakan copy manual.');
        }
    });

    // Close button handler - TIDAK redirect, hanya tutup modal
    document.getElementById('close-collab-modal-btn').addEventListener('click', () => {
        document.body.removeChild(overlay);
        // Tidak redirect, tetap di halaman create-gift
    });

    // Click outside to close - TIDAK redirect
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
            // Tidak redirect, tetap di halaman create-gift
        }
    });
};
