// ============================================
// COMUNICACIÓN CON BACKEND
// ============================================

async function apiFetch(action, data = {}) {
    const formData = new FormData();
    formData.append('action', action);
    
    // Agregar device info SIEMPRE
    const deviceInfo = detectDeviceInfo();
    const ip = await obtenerIP();
    
    formData.append('device_id', localStorage.getItem(CONFIG.STORAGE_KEYS.DEVICE_ID) || '');
    formData.append('ip_publica', ip);
    formData.append('dispositivo_tipo', deviceInfo.tipo);
    formData.append('dispositivo_marca', deviceInfo.marca);
    formData.append('navegador', deviceInfo.navegador);
    formData.append('sistema_operativo', deviceInfo.sistemaOperativo);
    
    // Agregar datos específicos de la acción
    for (let key in data) {
        formData.append(key, data[key]);
    }
    
    try {
        const response = await fetch(CONFIG.SCRIPT_URL, {
            method: 'POST',
            body: formData
        });
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ============================================
// FUNCIONES ESPECÍFICAS
// ============================================

async function getFranquicias() {
    return apiFetch('getFranquicias');
}

async function loginFranquicia(zona, clave) {
    return apiFetch('loginFranquicia', { zona, clave_acceso: clave });
}

async function registrarDispositivoAPI(clave) {
    return apiFetch('registrarDispositivo', { clave_registro: clave });
}

async function registrarFichaje(dni, tipo, local, zona) {
    return apiFetch('', { dni, tipo, local, zona }); // action vacío = fichaje
}
