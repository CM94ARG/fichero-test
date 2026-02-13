// ============================================
// GESTIÓN DE DISPOSITIVO
// ============================================

function generarDeviceId() {
    try {
        let stored = localStorage.getItem(CONFIG.STORAGE_KEYS.DEVICE_ID);
        if (stored && stored !== 'pending' && stored !== 'unknown') {
            return stored;
        }
        
        // UUID v4 aleatorio
        const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        
        const deviceId = `DANIEL_${uuid}`;
        localStorage.setItem(CONFIG.STORAGE_KEYS.DEVICE_ID, deviceId);
        return deviceId;
        
    } catch (error) {
        return `DANIEL_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}

function detectDeviceInfo() {
    const ua = navigator.userAgent;
    const info = { tipo: '', marca: '', navegador: '', sistemaOperativo: '' };
    
    // Detectar tipo
    if (/mobile/i.test(ua)) info.tipo = 'Celular';
    else if (/tablet|ipad/i.test(ua)) info.tipo = 'Tablet';
    else info.tipo = 'Computadora';
    
    // Detectar marca (simplificado)
    if (/samsung/i.test(ua)) info.marca = 'Samsung';
    else if (/iphone|ipod/i.test(ua)) info.marca = 'iPhone';
    else if (/huawei/i.test(ua)) info.marca = 'Huawei';
    else if (/xiaomi|redmi|poco/i.test(ua)) info.marca = 'Xiaomi';
    else info.marca = window.screen.width < 1440 ? 'Laptop' : 'PC';
    
    // Detectar navegador
    if (/chrome/i.test(ua) && !/edg/i.test(ua)) info.navegador = 'Chrome';
    else if (/firefox/i.test(ua)) info.navegador = 'Firefox';
    else if (/safari/i.test(ua) && !/chrome/i.test(ua)) info.navegador = 'Safari';
    else if (/edg/i.test(ua)) info.navegador = 'Edge';
    else info.navegador = 'Otro';
    
    // Detectar SO
    if (/windows/i.test(ua)) info.sistemaOperativo = 'Windows';
    else if (/macintosh|mac os x/i.test(ua)) info.sistemaOperativo = 'macOS';
    else if (/android/i.test(ua)) info.sistemaOperativo = 'Android';
    else if (/ios|iphone os/i.test(ua)) info.sistemaOperativo = 'iOS';
    else info.sistemaOperativo = 'Otro';
    
    return info;
}

async function obtenerIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        return 'No detectada';
    }
}

function actualizarInfoDispositivo() {
    const deviceId = localStorage.getItem(CONFIG.STORAGE_KEYS.DEVICE_ID) || 'No disponible';
    document.getElementById('device-id-short').textContent = deviceId.substring(0, 15) + '...';
    
    const info = detectDeviceInfo();
    document.getElementById('device-details').innerHTML = `
        <i class="fas fa-${info.tipo === 'Computadora' ? 'desktop' : 'mobile-alt'}"></i> 
        ${info.tipo} · ${info.navegador} · ${info.sistemaOperativo}
    `;
}
