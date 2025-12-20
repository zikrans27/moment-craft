// ==================== ADMIN FILE UPLOAD HANDLERS ====================

let adminMusicFileData = null;
let adminMusicFileName = null;
let adminEffectFileData = null;
let adminEffectFileName = null;

// Initialize admin upload areas when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeAdminMusicUpload();
    initializeAdminEffectUpload();
});

// ==================== MUSIC UPLOAD ====================

/**
 * Initialize admin music upload
 */
function initializeAdminMusicUpload() {
    const uploadArea = document.getElementById('admin-music-upload-area');
    const fileInput = document.getElementById('admin-music-file-input');
    
    if (!uploadArea || !fileInput) return;
    
    // Click to upload
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    // File input change
    fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
            await handleAdminMusicUpload(file);
        }
    });
    
    // Drag and drop
    setupDragAndDrop(uploadArea, handleAdminMusicUpload, ['audio/*']);
}

/**
 * Handle admin music file upload
 * @param {File} file - Audio file
 */
async function handleAdminMusicUpload(file) {
    // Validate file type
    if (!validateFileType(file, ['audio/*'])) {
        alert('File must be audio format (MP3, WAV, OGG, etc.)');
        return;
    }
    
    // Validate file size (max 10MB)
    if (!validateFileSize(file, 10)) {
        alert('Maximum file size is 10MB');
        return;
    }
    
    try {
        // Convert to base64
        const base64Data = await fileToBase64(file);
        
        // Store music data
        adminMusicFileData = base64Data;
        adminMusicFileName = file.name;
        
        // Show preview
        showAdminMusicPreview(file.name, file.size, base64Data);
        
    } catch (error) {
        console.error('Error uploading music:', error);
        alert('Failed to upload music. Please try again.');
    }
}

/**
 * Show admin music preview
 * @param {string} fileName - File name
 * @param {number} fileSize - File size in bytes
 * @param {string} audioData - Base64 audio data
 */
function showAdminMusicPreview(fileName, fileSize, audioData) {
    const preview = document.getElementById('admin-music-preview');
    const fileNameEl = document.getElementById('admin-music-file-name');
    const fileSizeEl = document.getElementById('admin-music-file-size');
    const audioPlayer = document.getElementById('admin-music-preview-player');
    
    if (!preview) return;
    
    fileNameEl.textContent = fileName;
    fileSizeEl.textContent = formatFileSize(fileSize);
    audioPlayer.src = audioData;
    
    preview.style.display = 'block';
}

/**
 * Remove admin music preview
 */
function removeAdminMusicPreview() {
    const preview = document.getElementById('admin-music-preview');
    const audioPlayer = document.getElementById('admin-music-preview-player');
    const fileInput = document.getElementById('admin-music-file-input');
    
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
    
    adminMusicFileData = null;
    adminMusicFileName = null;
}

// ==================== EFFECT UPLOAD ====================

/**
 * Initialize admin effect upload
 */
function initializeAdminEffectUpload() {
    const uploadArea = document.getElementById('admin-effect-upload-area');
    const fileInput = document.getElementById('admin-effect-file-input');
    
    if (!uploadArea || !fileInput) return;
    
    // Click to upload
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    // File input change
    fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
            await handleAdminEffectUpload(file);
        }
    });
    
    // Drag and drop
    setupDragAndDrop(uploadArea, handleAdminEffectUpload, ['image/*']);
}

/**
 * Handle admin effect file upload
 * @param {File} file - Image file
 */
async function handleAdminEffectUpload(file) {
    // Validate file type
    if (!validateFileType(file, ['image/*'])) {
        alert('File must be image format (PNG, JPG, GIF, etc.)');
        return;
    }
    
    // Validate file size (max 2MB)
    if (!validateFileSize(file, 2)) {
        alert('Maximum file size is 2MB');
        return;
    }
    
    try {
        // Compress image
        const compressedData = await compressImageFile(file, 800, 0.8);
        
        // Store effect data
        adminEffectFileData = compressedData;
        adminEffectFileName = file.name;
        
        // Show preview
        showAdminEffectPreview(file.name, file.size, compressedData);
        
    } catch (error) {
        console.error('Error uploading effect:', error);
        alert('Failed to upload effect. Please try again.');
    }
}

/**
 * Show admin effect preview
 * @param {string} fileName - File name
 * @param {number} fileSize - File size in bytes
 * @param {string} imageData - Base64 image data
 */
function showAdminEffectPreview(fileName, fileSize, imageData) {
    const preview = document.getElementById('admin-effect-preview');
    const fileNameEl = document.getElementById('admin-effect-file-name');
    const fileSizeEl = document.getElementById('admin-effect-file-size');
    const imagePreview = document.getElementById('admin-effect-preview-image');
    
    if (!preview) return;
    
    fileNameEl.textContent = fileName;
    fileSizeEl.textContent = formatFileSize(fileSize);
    imagePreview.src = imageData;
    
    preview.style.display = 'block';
}

/**
 * Remove admin effect preview
 */
function removeAdminEffectPreview() {
    const preview = document.getElementById('admin-effect-preview');
    const imagePreview = document.getElementById('admin-effect-preview-image');
    const fileInput = document.getElementById('admin-effect-file-input');
    
    if (imagePreview) {
        imagePreview.src = '#';
    }
    
    if (fileInput) {
        fileInput.value = '';
    }
    
    if (preview) {
        preview.style.display = 'none';
    }
    
    adminEffectFileData = null;
    adminEffectFileName = null;
}

// ==================== FORM SUBMISSION HANDLERS ====================

// Override the existing form submission handlers in admin-script.js
// These will be called when the forms are submitted

/**
 * Get admin music form data
 * @returns {object|null} Music data or null if no file uploaded
 */
function getAdminMusicFormData() {
    if (!adminMusicFileData || !adminMusicFileName) {
        alert('Please upload a music file');
        return null;
    }
    
    const title = document.getElementById('music-title').value;
    const artist = document.getElementById('music-artist').value;
    
    if (!title || !artist) {
        alert('Please fill in all fields');
        return null;
    }
    
    return {
        title: title,
        artist: artist,
        data: adminMusicFileData,
        fileName: adminMusicFileName
    };
}

/**
 * Get admin effect form data
 * @returns {object|null} Effect data or null if no file uploaded
 */
function getAdminEffectFormData() {
    if (!adminEffectFileData || !adminEffectFileName) {
        alert('Please upload an effect image');
        return null;
    }
    
    const name = document.getElementById('effect-name').value;
    
    if (!name) {
        alert('Please enter effect name');
        return null;
    }
    
    return {
        name: name,
        data: adminEffectFileData,
        fileName: adminEffectFileName
    };
}

/**
 * Reset admin music form
 */
function resetAdminMusicForm() {
    document.getElementById('music-title').value = '';
    document.getElementById('music-artist').value = '';
    removeAdminMusicPreview();
}

/**
 * Reset admin effect form
 */
function resetAdminEffectForm() {
    document.getElementById('effect-name').value = '';
    removeAdminEffectPreview();
}
