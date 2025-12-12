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
    // Clear previous music selection when starting new gift creation
    // This ensures music player only shows if user actively selects music for THIS gift
    localStorage.removeItem('selectedMusic');
    console.log('✅ Music selection cleared - ready for new gift');
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

            if (input.files && input.files[0]) {
                try {
                    // Compress image before preview
                    const compressedImage = await compressImage(input.files[0]);
                    preview.src = compressedImage;
                    preview.style.display = 'block';
                    status.textContent = input.files[0].name + ' (compressed)';
                } catch (error) {
                    console.error('Error compressing image:', error);
                    status.textContent = 'Error loading image';
                }
            } else {
                preview.src = '#';
                preview.style.display = 'none';
                status.textContent = 'Click to upload image or video moment';
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

            // Hide collaboration icon (people icon) in collaboration mode
            const sidebarIcons = document.querySelector('.sidebar-icons');
            if (sidebarIcons) {
                const iconButtons = sidebarIcons.querySelectorAll('.icon-btn');
                if (iconButtons.length >= 3) {
                    // Hide the third button (people icon)
                    iconButtons[2].style.display = 'none';
                }
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
            musicDisplay.textContent = `${musicData.title} - ${musicData.artist}`;
        }
    }
});


// --- EFFECT SELECTION LOGIC ---
const effects = [
    { id: 'balloon', name: 'Balloon', icon: '🎈' },
    { id: 'sparkle', name: 'Sparkle', icon: '✨' },
];

const backgrounds = [
    { id: 'bg1', name: 'dark', image: 'Assets/bg1.png' },
    { id: 'bg2', name: 'starlight', image: 'Assets/bg2.png' },
    { id: 'bg3', name: 'hearts', image: 'Assets/bg3.png' },
    { id: 'bg4', name: 'cherry bomb', image: 'Assets/bg4.png' }
];

const fontColors = [
    { id: 'white', name: 'Putih', value: '#ffffff' },
    { id: 'black', name: 'Hitam', value: '#000000' },
    { id: 'brown', name: 'Coklat', value: '#8B4513' },
    { id: 'blue', name: 'Biru', value: '#0066cc' },
    { id: 'green', name: 'Hijau', value: '#2d8659' },
    { id: 'purple', name: 'Ungu', value: '#800080' }
];

let selectedEffectId = 'balloon';
let selectedBackgroundId = 'bg1';
let selectedFontColorId = 'white';

function renderEffects() {
    const container = document.getElementById('effect-grid-container');
    container.innerHTML = '';
    effects.forEach(effect => {
        const isActive = effect.id === selectedEffectId ? 'selected' : '';
        const item = document.createElement('div');
        item.className = `effect-item ${isActive}`;
        item.dataset.effectId = effect.id;
        item.innerHTML = `
            <div class="effect-icon">${effect.icon}</div>
            <div class="effect-name">${effect.name}</div>
        `;
        item.addEventListener('click', () => {
            document.querySelectorAll('.effect-item').forEach(e => e.classList.remove('selected'));
            item.classList.add('selected');
            selectedEffectId = effect.id;
        });
        container.appendChild(item);
    });
}

function renderBackgrounds() {
    const container = document.getElementById('background-grid-container');
    container.innerHTML = '';
    backgrounds.forEach(bg => {
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
    // Get selected names for display
    const effectName = effects.find(e => e.id === selectedEffectId)?.name || 'None';
    const backgroundName = backgrounds.find(b => b.id === selectedBackgroundId)?.name || 'Default';
    const fontColorName = fontColors.find(c => c.id === selectedFontColorId)?.name || 'White';

    // Save selections to localStorage
    localStorage.setItem('selectedEffect', selectedEffectId);
    localStorage.setItem('selectedBackground', selectedBackgroundId);
    localStorage.setItem('selectedFontColor', selectedFontColorId);

    // Update display in form (if you want to show selection)
    document.getElementById('effect-display').textContent = `${effectName}, ${backgroundName}, ${fontColorName}`;

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
            createdAt: new Date().toISOString()
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
            effect,
            imageData,
            createdAt: new Date().toISOString(),
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
    showMessageBox("Login Simulated", "Logging in... In a real app, this would verify credentials and redirect.");
    setTimeout(() => showPage('moment-selection'), 1000);
}

function handleRegisterSubmission(event) {
    event.preventDefault();
    showMessageBox("Registration Simulated", "Account created! You are now logged in.");
    setTimeout(() => showPage('moment-selection'), 1000);
}

// Di bagian form submit handler
document.getElementById('gift-creation-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const recipientName = document.getElementById('recipient-name').value;
    const senderName = document.getElementById('sender-name').value;
    const message = document.getElementById('gift-message').value;
    const uploadedImage = document.getElementById('upload-preview').src;

    // Simpan data ke localStorage atau variabel
    localStorage.setItem('giftData', JSON.stringify({
        recipient: recipientName,
        sender: senderName,
        message: message,
        image: uploadedImage,
        moment: document.getElementById('selected-moment').value
    }));

    // Redirect ke halaman amplop
    window.location.href = 'envelope.html';
});

// --- MUSIC SELECTION LOGIC (LOCAL FILES) ---
let selectedSongData = null;

// Local Music Files from Assets folder
const localSongs = [
    {
        id: 1,
        title: 'Happy Birthday Song 1',
        artist: 'Classical',
        audioFile: 'Assets/happy-birthday-334876.mp3',
        thumbnail: '🎵'
    },
    {
        id: 2,
        title: 'Happy Birthday Song 2',
        artist: 'Upbeat',
        audioFile: 'Assets/happy-birthday-357371.mp3',
        thumbnail: '🎵'
    },
    {
        id: 3,
        title: 'Happy Birthday Song 3',
        artist: 'Modern',
        audioFile: 'Assets/happy-birthday-401919.mp3',
        thumbnail: '🎵'
    }
];

window.showMusicSelection = () => {
    const overlay = document.getElementById('youtube-music-overlay');

    // Show overlay
    overlay.classList.add('active');
    renderSongList(localSongs); // Use local songs instead

    // Hide search functionality since we're using local files
    const searchContainer = document.querySelector('.youtube-search-container');
    if (searchContainer) {
        searchContainer.style.display = 'none';
    }
};

window.hideMusicSelection = () => {
    const overlay = document.getElementById('youtube-music-overlay');
    overlay.classList.remove('active');
    selectedSongData = null;

    // Stop and hide preview player
    const previewPlayer = document.getElementById('preview-audio-player');
    if (previewPlayer) {
        previewPlayer.pause();
        previewPlayer.src = '';
        previewPlayer.style.display = 'none';
    }
};

// Keep old names for backward compatibility
window.showYouTubeMusic = window.showMusicSelection;
window.hideYouTubeMusic = window.hideMusicSelection;

window.closeYouTubeIfClickOutside = (event) => {
    if (event.target.id === 'youtube-music-overlay') {
        hideMusicSelection();
    }
};

function renderSongList(songs) {
    const songListContainer = document.getElementById('youtube-song-list');
    songListContainer.innerHTML = '';

    if (songs.length === 0) {
        songListContainer.innerHTML = '<div style="text-align: center; padding: 40px; color: #666;">Tidak ada lagu ditemukan</div>';
        return;
    }

    // Create preview audio player (hidden initially)
    let previewPlayer = document.getElementById('preview-audio-player');
    if (!previewPlayer) {
        previewPlayer = document.createElement('audio');
        previewPlayer.id = 'preview-audio-player';
        previewPlayer.controls = true;
        previewPlayer.style.cssText = 'width: 100%; margin: 15px 0; display: none;';
        songListContainer.parentNode.insertBefore(previewPlayer, songListContainer);
    }

    songs.forEach(song => {
        const songItem = document.createElement('div');
        songItem.className = 'youtube-song-item';

        // For local files, use emoji as thumbnail
        const thumbnailHTML = song.audioFile
            ? `<div class="song-thumbnail" style="display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); font-size: 32px; color: white; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">${song.thumbnail}</div>`
            : `<img src="${song.thumbnail}" alt="${song.title}" class="song-thumbnail" onerror="this.src='https://via.placeholder.com/60'">`;

        songItem.innerHTML = `
            ${thumbnailHTML}
            <div class="song-info">
                <div class="song-title">${song.title}</div>
                <div class="song-artist">${song.artist}</div>
            </div>
        `;

        songItem.addEventListener('click', () => {
            // Remove selection from all items
            document.querySelectorAll('.youtube-song-item').forEach(item => {
                item.classList.remove('selected');
            });
            // Add selection to clicked item
            songItem.classList.add('selected');
            selectedSongData = song;

            // Play preview if it's a local audio file
            if (song.audioFile) {
                previewPlayer.src = song.audioFile;
                previewPlayer.style.display = 'block';
                previewPlayer.currentTime = 0; // Start from beginning
                previewPlayer.play().catch(error => {
                    console.log('Preview autoplay prevented:', error);
                });
            }
        });

        songListContainer.appendChild(songItem);
    });
}

window.addSelectedSong = () => {
    if (selectedSongData) {
        showMessageBox('Lagu Ditambahkan', `"${selectedSongData.title}" telah ditambahkan ke kado Anda!`);
        // Store selected song with audio file path for local playback
        const musicData = {
            title: selectedSongData.title,
            artist: selectedSongData.artist,
            audioFile: selectedSongData.audioFile, // Local file path instead of videoId
            thumbnail: selectedSongData.thumbnail
        };
        localStorage.setItem('selectedMusic', JSON.stringify(musicData));

        // Update music display in the form
        const musicDisplay = document.getElementById('music-display');
        if (musicDisplay) {
            musicDisplay.textContent = `${selectedSongData.title} - ${selectedSongData.artist}`;
        }

        hideYouTubeMusic();
    } else {
        showMessageBox('Pilih Lagu', 'Silakan pilih lagu terlebih dahulu.');
    }
};


// --- COLLABORATION MODE LOGIC ---
window.showCollaborationMode = () => {
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
        effect,
        imageData,
        createdAt: new Date().toISOString(),
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

    // Close button handler
    document.getElementById('close-collab-modal-btn').addEventListener('click', () => {
        document.body.removeChild(overlay);
        // Redirect to share page
        window.location.href = `share.html?id=${giftId}`;
    });

    // Click outside to close
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
            // Redirect to share page
            window.location.href = `share.html?id=${giftId}`;
        }
    });
};
