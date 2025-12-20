// ==================== FILE UPLOAD UTILITIES ====================

/**
 * Convert file to base64 string
 * @param {File} file - File object to convert
 * @returns {Promise<string>} Base64 encoded string
 */
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

/**
 * Compress image file
 * @param {File} file - Image file to compress
 * @param {number} maxWidth - Maximum width
 * @param {number} quality - Quality (0-1)
 * @returns {Promise<string>} Compressed image as base64
 */
function compressImageFile(file, maxWidth = 1200, quality = 0.8) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const img = new Image();
            
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }
                
                canvas.width = width;
                canvas.height = height;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                const compressedBase64 = canvas.toDataURL(file.type, quality);
                resolve(compressedBase64);
            };
            
            img.onerror = reject;
            img.src = e.target.result;
        };
        
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * Validate file type
 * @param {File} file - File to validate
 * @param {string[]} allowedTypes - Array of allowed MIME types
 * @returns {boolean} True if valid
 */
function validateFileType(file, allowedTypes) {
    return allowedTypes.some(type => {
        if (type.endsWith('/*')) {
            const prefix = type.split('/')[0];
            return file.type.startsWith(prefix + '/');
        }
        return file.type === type;
    });
}

/**
 * Validate file size
 * @param {File} file - File to validate
 * @param {number} maxSizeMB - Maximum size in MB
 * @returns {boolean} True if valid
 */
function validateFileSize(file, maxSizeMB) {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
}

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted size string
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// ==================== ADMIN LIBRARY MANAGEMENT ====================

/**
 * Get admin music library
 * @returns {Array} Array of music objects
 */
function getAdminMusicLibrary() {
    const library = localStorage.getItem('adminMusicLibrary');
    return library ? JSON.parse(library) : [];
}

/**
 * Add music to admin library
 * @param {string} name - Music name
 * @param {string} data - Base64 encoded music data
 * @returns {object} Added music object
 */
function addToAdminMusicLibrary(name, data) {
    const library = getAdminMusicLibrary();
    const newMusic = {
        id: 'music_' + Date.now(),
        name: name,
        data: data,
        uploadedAt: new Date().toISOString()
    };
    library.push(newMusic);
    localStorage.setItem('adminMusicLibrary', JSON.stringify(library));
    return newMusic;
}

/**
 * Remove music from admin library
 * @param {string} id - Music ID to remove
 */
function removeFromAdminMusicLibrary(id) {
    let library = getAdminMusicLibrary();
    library = library.filter(item => item.id !== id);
    localStorage.setItem('adminMusicLibrary', JSON.stringify(library));
}

/**
 * Get admin effect library
 * @returns {Array} Array of effect objects
 */
function getAdminEffectLibrary() {
    const library = localStorage.getItem('adminEffectLibrary');
    return library ? JSON.parse(library) : [];
}

/**
 * Add effect to admin library
 * @param {string} name - Effect name
 * @param {string} data - Base64 encoded effect image data
 * @returns {object} Added effect object
 */
function addToAdminEffectLibrary(name, data) {
    const library = getAdminEffectLibrary();
    const newEffect = {
        id: 'effect_' + Date.now(),
        name: name,
        data: data,
        uploadedAt: new Date().toISOString()
    };
    library.push(newEffect);
    localStorage.setItem('adminEffectLibrary', JSON.stringify(library));
    return newEffect;
}

/**
 * Remove effect from admin library
 * @param {string} id - Effect ID to remove
 */
function removeFromAdminEffectLibrary(id) {
    let library = getAdminEffectLibrary();
    library = library.filter(item => item.id !== id);
    localStorage.setItem('adminEffectLibrary', JSON.stringify(library));
}

/**
 * Get admin background library
 * @returns {Array} Array of background objects
 */
function getAdminBackgroundLibrary() {
    const library = localStorage.getItem('adminBackgroundLibrary');
    return library ? JSON.parse(library) : [];
}

/**
 * Add background to admin library
 * @param {string} name - Background name
 * @param {string} data - Base64 encoded background image data
 * @returns {object} Added background object
 */
function addToAdminBackgroundLibrary(name, data) {
    const library = getAdminBackgroundLibrary();
    const newBackground = {
        id: 'bg_' + Date.now(),
        name: name,
        data: data,
        uploadedAt: new Date().toISOString()
    };
    library.push(newBackground);
    localStorage.setItem('adminBackgroundLibrary', JSON.stringify(library));
    return newBackground;
}

/**
 * Remove background from admin library
 * @param {string} id - Background ID to remove
 */
function removeFromAdminBackgroundLibrary(id) {
    let library = getAdminBackgroundLibrary();
    library = library.filter(item => item.id !== id);
    localStorage.setItem('adminBackgroundLibrary', JSON.stringify(library));
}

// ==================== DRAG & DROP UTILITIES ====================

/**
 * Setup drag and drop for an element
 * @param {HTMLElement} element - Element to make droppable
 * @param {Function} onDrop - Callback when file is dropped
 * @param {string[]} allowedTypes - Allowed file types
 */
function setupDragAndDrop(element, onDrop, allowedTypes) {
    element.addEventListener('dragover', (e) => {
        e.preventDefault();
        element.classList.add('drag-over');
    });
    
    element.addEventListener('dragleave', (e) => {
        e.preventDefault();
        element.classList.remove('drag-over');
    });
    
    element.addEventListener('drop', (e) => {
        e.preventDefault();
        element.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (validateFileType(file, allowedTypes)) {
                onDrop(file);
            } else {
                alert('Tipe file tidak didukung. Silakan upload file dengan format yang benar.');
            }
        }
    });
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fileToBase64,
        compressImageFile,
        validateFileType,
        validateFileSize,
        formatFileSize,
        getAdminMusicLibrary,
        addToAdminMusicLibrary,
        removeFromAdminMusicLibrary,
        getAdminEffectLibrary,
        addToAdminEffectLibrary,
        removeFromAdminEffectLibrary,
        getAdminBackgroundLibrary,
        addToAdminBackgroundLibrary,
        removeFromAdminBackgroundLibrary,
        setupDragAndDrop
    };
}
