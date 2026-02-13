// ============================================
// CONFIGURACIÓN - UNA SOLA URL
// ============================================
const ADMIN_CONFIG = {
    API_URL: 'https://script.google.com/macros/s/AKfycbyO0ZJeyK1eUBI-9D8xTQyxge2sy_dV8iIXWEW5wDoKm5LWeASt0bfXKCgkj8joZ4PD/exec',
    STORAGE_KEYS: {
        ZONA_ACTIVA: 'admin_zona_activa'
    },
    ZONAS: {
        zona1: { 
            nombre: 'Zona Norte', 
            locales: ['Saavedra', 'Palermo', 'Colegiales'] 
        },
        zona2: { 
            nombre: 'Zona Sur', 
            locales: ['Local A', 'Local B', 'Local C', 'Local D', 'Local E'] 
        },
        zona3: { 
            nombre: 'Zona Oeste', 
            locales: ['Devoto', 'Villa Devoto'] 
        }
    }
};
