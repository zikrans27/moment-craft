// ==================== MUSIC UPLOAD FUNCTIONALITY ====================

let selectedMusicData = null;
let selectedMusicName = null;
let selectedMusicType = null; // 'upload' or 'library'
let selectedMusicSrc = null;
let currentPreviewAudio = null;

// Initialize music upload when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeMusicUpload();
    loadAdminMusicLibrary();
});

/**
 * Initialize music upload functionality
 */
function initializeMusicUpload() {
    const uploadArea = document.getElementById('music-upload-area');
    const fileInput = document.getElementById('music-file-input');
    
    if (!uploadArea || !fileInput) return;
    
    // Click to upload
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    // File input change
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleMusicFileUpload(file);
        }
    });
    
    // Drag and drop
    setupDragAndDrop(uploadArea, handleMusicFileUpload, ['audio/*']);
}

/**
 * Handle music file upload
 * @param {File} file - Audio file
 */
async function handleMusicFileUpload(file) {
    // Validate file type
    if (!validateFileType(file, ['audio/*'])) {
        alert('File harus berformat audio (MP3, WAV, OGG, dll)');
        return;
    }
    
    // Validate file size (max 10MB)
    if (!validateFileSize(file, 10)) {
        alert('Ukuran file maksimal 10MB');
        return;
    }
    
    try {
        // Convert to base64
        const base64Data = await fileToBase64(file);
        
        // Store music data
        selectedMusicData = base64Data;
        selectedMusicName = file.name;
        selectedMusicType = 'upload';
        selectedMusicSrc = null;
        
        // Show preview
        showMusicPreview(file.name, file.size, base64Data);
        
        // Deselect library items
        document.querySelectorAll('.music-item').forEach(item => {
            item.classList.remove('selected');
        });
        
    } catch (error) {
        console.error('Error uploading music:', error);
        alert('Gagal mengupload musik. Silakan coba lagi.');
    }
}

/**
 * Show music preview
 * @param {string} fileName - File name
 * @param {number} fileSize - File size in bytes
 * @param {string} audioData - Base64 audio data
 */
function showMusicPreview(fileName, fileSize, audioData) {
    const preview = document.getElementById('music-preview');
    const fileNameEl = document.getElementById('music-file-name');
    const fileSizeEl = document.getElementById('music-file-size');
    const audioPlayer = document.getElementById('music-preview-player');
    
    if (!preview) return;
    
    fileNameEl.textContent = fileName;
    fileSizeEl.textContent = formatFileSize(fileSize);
    audioPlayer.src = audioData;
    
    preview.style.display = 'block';
}

/**
 * Remove music preview
 */
function removeMusicPreview() {
    const preview = document.getElementById('music-preview');
    const audioPlayer = document.getElementById('music-preview-player');
    const fileInput = document.getElementById('music-file-input');
    
    if (audioPlayer) {
        audioPlayer.pause();
        audioPlayer.src = '';
    }
    
    if (fileInput) {
        fileInput.value = '';
    }
    
    if (preview) {
        preview.style.display = 'none';
    }
    
    selectedMusicData = null;
    selectedMusicName = null;
    selectedMusicType = null;
    selectedMusicSrc = null;
}

/**
 * Load admin music library
 */
function loadAdminMusicLibrary() {
    const grid = document.getElementById('music-library-grid');
    if (!grid) return;
    
    // Clear the grid first to avoid duplicates
    grid.innerHTML = '';
    
    const adminLibrary = getAdminMusicLibrary();
    
    // Default system songs
    const defaultSongs = [
        { id: 'default_1', name: 'Happy Birthday Song 1', src: 'Assets/happy-birthday-334876.mp3' },
        { id: 'default_2', name: 'Happy Birthday Song 2', src: 'Assets/happy-birthday-357371.mp3' },
        { id: 'default_3', name: 'Happy Birthday Song 3', src: 'Assets/happy-birthday-401919.mp3' },
        { id: 'default_4', name: 'Romantic & Love', src: 'Assets/💗 Romantic & Love (Royalty Free Music) - ROMANTIC by Alex Productions 🇮🇹 - BreakingCopyright — Royalty Free Music.mp3' },
        { id: 'default_5', name: 'Education Background', src: 'Assets/Education Background Music Study Royalty Free - backgroundmusicforvideoedits.mp3' }
    ];

    // Add default items
    defaultSongs.forEach(music => {
        const item = createMusicLibraryItem(music.name, music.src, 'default', music.id);
        grid.appendChild(item);
    });

    // Add admin library items
    adminLibrary.forEach(music => {
        const item = createMusicLibraryItem(music.name, music.data, 'admin', music.id);
        grid.appendChild(item);
    });
}

/**
 * Create music library item element
 * @param {string} name - Music name
 * @param {string} src - Music source (path or base64)
 * @param {string} type - 'default' or 'admin'
 * @param {string} id - Music ID
 * @returns {HTMLElement} Music item element
 */
function createMusicLibraryItem(name, src, type, id = null) {
    const item = document.createElement('div');
    item.className = 'music-item';
    item.dataset.type = type;
    item.dataset.src = src;
    item.dataset.name = name;
    item.dataset.category = type === 'admin' ? 'Admin Library' : 'Default';
    if (id) item.dataset.id = id;
    
    item.innerHTML = `
        <div class="music-item-icon">🎵</div>
        <div class="music-item-info">
            <div class="music-item-name">${name}</div>
            <div class="music-item-meta">${type === 'admin' ? 'Admin Library' : 'Default'}</div>
        </div>
    `;
    
    // Click to select
    item.addEventListener('click', () => {
        selectMusicItem(item);
    });
    
    return item;
}

/**
 * Select music item and play in audio player
 * @param {HTMLElement} item - Music item element
 */
function selectMusicItem(item) {
    // Deselect all
    document.querySelectorAll('.music-item').forEach(el => {
        el.classList.remove('selected');
    });
    
    // Select this item
    item.classList.add('selected');
    
    // Store selection temporarily (not saved to localStorage yet)
    selectedMusicType = 'library';
    selectedMusicSrc = item.dataset.src;
    selectedMusicName = item.dataset.name || item.querySelector('.music-item-name').textContent;
    selectedMusicData = null; // Clear uploaded data
    
    // Show and play in audio player for preview
    const playerSection = document.getElementById('music-player-section');
    const audioPlayer = document.getElementById('music-preview-player');
    
    if (playerSection && audioPlayer) {
        playerSection.style.display = 'block';
        audioPlayer.src = selectedMusicSrc;
        
        // Auto-play the selected music for preview
        audioPlayer.play().catch(err => {
            console.log('Auto-play prevented:', err);
        });
    }
    
    console.log('🎵 Musik dipilih untuk preview:', selectedMusicName);
}

/**
 * Trigger music upload
 */
function triggerMusicUpload() {
    const fileInput = document.getElementById('user-music-upload');
    if (fileInput) {
        fileInput.click();
    }
}

/**
 * Handle user music upload
 * @param {Event} event - File input change event
 */
async function handleUserMusicUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('audio/')) {
        alert('File harus berformat audio (MP3, WAV, OGG, dll)');
        return;
    }
    
    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
        alert('Ukuran file maksimal 10MB');
        return;
    }
    
    try {
        // Convert to base64
        const reader = new FileReader();
        reader.onload = function(e) {
            const base64Data = e.target.result;
            
            // Create new music item
            const grid = document.getElementById('music-library-grid');
            const newItem = document.createElement('div');
            newItem.className = 'music-item';
            newItem.dataset.type = 'user';
            newItem.dataset.src = base64Data;
            newItem.dataset.name = file.name;
            newItem.dataset.category = 'Uploaded';
            
            newItem.innerHTML = `
                <div class="music-item-icon">🎵</div>
                <div class="music-item-info">
                    <div class="music-item-name">${file.name}</div>
                    <div class="music-item-meta">Uploaded</div>
                </div>
            `;
            
            newItem.addEventListener('click', () => {
                selectMusicItem(newItem);
            });
            
            // Add to grid
            grid.appendChild(newItem);
            
            // Auto-select the uploaded music for preview
            selectMusicItem(newItem);
            
            console.log('✅ Musik berhasil diupload:', file.name);
        };
        
        reader.onerror = function() {
            alert('Gagal membaca file. Silakan coba lagi.');
        };
        
        reader.readAsDataURL(file);
        
    } catch (error) {
        console.error('Error uploading music:', error);
        alert('Gagal mengupload musik. Silakan coba lagi.');
    }
    
    // Reset file input
    event.target.value = '';
}

/**
 * Select music from library (backward compatibility)
 * @param {HTMLElement} item - Music item element
 */
function selectLibraryMusic(item) {
    selectMusicItem(item);
}

/**
 * Preview library music (deprecated - now using selectMusicItem)
 * @param {HTMLElement} button - Play button element
 */
function previewLibraryMusic(button) {
    const item = button.closest('.music-item');
    selectMusicItem(item);
}

/**
 * Apply selected music - save to localStorage and close modal
 */
function applySelectedMusic() {
    if (!selectedMusicData && !selectedMusicSrc) {
        alert('Silakan pilih musik terlebih dahulu');
        return;
    }
    
    // Save selected music to localStorage
    const musicSelection = {
        type: selectedMusicType,
        name: selectedMusicName,
        title: selectedMusicName, // Add title for compatibility
        artist: selectedMusicType === 'admin' ? 'Admin Music' : 'Library', // Add artist for compatibility
        data: selectedMusicData,
        src: selectedMusicSrc
    };
    
    localStorage.setItem('selectedMusic', JSON.stringify(musicSelection));
    
    // Update display in main form
    const musicDisplay = document.getElementById('music-display');
    if (musicDisplay) {
        musicDisplay.textContent = selectedMusicName || 'Selected';
    }
    
    // Close modal
    hideYouTubeMusic();
    
    // Show success message
    if (typeof showMessageBox === 'function') {
        showMessageBox('Berhasil', 'Musik telah dipilih: ' + selectedMusicName);
    } else {
        console.log('✅ Musik diterapkan pada surat:', selectedMusicName);
    }
}

/**
 * Show music selection modal
 */
function showMusicSelection() {
    // Check if user is logged in
    if (typeof checkLoginStatus === 'function' && !checkLoginStatus()) {
        if (typeof showLoginPopup === 'function') {
            showLoginPopup('Musik', () => {
                showMusicSelection();
            });
            return;
        }
    }

    const overlay = document.getElementById('youtube-music-overlay');
    if (overlay) {
        overlay.classList.add('active');
        
        // Load admin library (refresh)
        const grid = document.getElementById('music-library-grid');
        if (grid) {
            // Reload admin library (this function now clears the grid automatically)
            loadAdminMusicLibrary();
        }
        
        // Restore previously applied music if any
        const savedMusic = localStorage.getItem('selectedMusic');
        if (savedMusic) {
            const musicData = JSON.parse(savedMusic);
            
            // Restore selected music variables
            selectedMusicType = musicData.type;
            selectedMusicSrc = musicData.src || musicData.data;
            selectedMusicName = musicData.name;
            selectedMusicData = musicData.data;
            
            // Find and select the music item visually
            const items = document.querySelectorAll('.music-item');
            items.forEach(item => {
                if (item.dataset.src === musicData.src || item.dataset.src === musicData.data || item.dataset.name === musicData.name) {
                    item.classList.add('selected');
                    
                    // Show in audio player (but don't auto-play)
                    const playerSection = document.getElementById('music-player-section');
                    const audioPlayer = document.getElementById('music-preview-player');
                    
                    if (playerSection && audioPlayer) {
                        playerSection.style.display = 'block';
                        audioPlayer.src = musicData.src || musicData.data;
                    }
                }
            });
        }
    }
}

// Backward compatibility
window.showYouTubeMusic = showMusicSelection;

/**
 * Hide music selection modal
 */
function hideYouTubeMusic() {
    const overlay = document.getElementById('youtube-music-overlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
    
    // Pause audio player
    const audioPlayer = document.getElementById('music-preview-player');
    if (audioPlayer) {
        audioPlayer.pause();
    }
}

/**
 * Close modal if clicking outside
 * @param {Event} event - Click event
 */
function closeYouTubeIfClickOutside(event) {
    if (event.target.id === 'youtube-music-overlay') {
        hideYouTubeMusic();
    }
}
