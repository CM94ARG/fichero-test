// ============================================
// ZONAS - Información y locales
// ============================================
const adminZona = {
    actualizarInfoZona() {
        const zonaId = document.getElementById('zonaSelect').value;
        const zonaInfo = document.getElementById('zonaInfo');
        const zonaInfoNombre = document.getElementById('zonaInfoNombre');
        const zonaInfoLocales = document.getElementById('zonaInfoLocales');
        
        if (!zonaId) {
            zonaInfo.style.display = 'none';
            return;
        }
        
        const zonas = {
            zona1: { nombre: 'Zona Norte', locales: 'Saavedra • Palermo • Colegiales' },
            zona2: { nombre: 'Zona Sur', locales: 'Local A • Local B • Local C • Local D • Local E' },
            zona3: { nombre: 'Zona Oeste', locales: 'Devoto • Villa Devoto' }
        };
        
        zonaInfoNombre.textContent = zonas[zonaId].nombre;
        zonaInfoLocales.textContent = zonas[zonaId].locales;
        zonaInfo.style.display = 'block';
    },

    generarOpcionesLocales(locales) {
        let options = '';
        for (const [id, nombre] of Object.entries(locales)) {
            options += `<option value="${id}">${nombre}</option>`;
        }
        return options;
    }
};
