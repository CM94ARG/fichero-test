// ============================================
// ZONAS - TODO VIENE DEL BACKEND
// ============================================
const adminZona = {
    async actualizarInfoZona() {
        const zonaId = document.getElementById('zonaSelect').value;
        const zonaInfo = document.getElementById('zonaInfo');
        const zonaInfoNombre = document.getElementById('zonaInfoNombre');
        const zonaInfoLocales = document.getElementById('zonaInfoLocales');
        
        if (!zonaId) {
            zonaInfo.style.display = 'none';
            return;
        }

        // Mostrar solo "Cargando..." mientras traemos los datos
        zonaInfoNombre.textContent = 'Cargando...';
        zonaInfoLocales.textContent = 'Obteniendo información...';
        zonaInfo.style.display = 'block';

        try {
            // 👇 TRAER DATOS REALES DEL BACKEND
            const formData = new FormData();
            formData.append('action', 'getInfoZona');
            formData.append('zona', zonaId);
            
            const response = await fetch(ADMIN_CONFIG.API_URL, {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                zonaInfoNombre.textContent = data.nombre;
                zonaInfoLocales.textContent = data.locales_display || 'Sin locales';
            } else {
                zonaInfoNombre.textContent = 'Error al cargar';
                zonaInfoLocales.textContent = 'Intente nuevamente';
            }
        } catch (error) {
            console.error('Error cargando info de zona:', error);
            zonaInfoNombre.textContent = 'Error de conexión';
            zonaInfoLocales.textContent = 'Verifique su internet';
        }
    },

    generarOpcionesLocales(locales) {
        if (!locales || Object.keys(locales).length === 0) {
            return '<option value="">No hay locales disponibles</option>';
        }
        
        let options = '';
        for (const [id, nombre] of Object.entries(locales)) {
            options += `<option value="${id}">${nombre}</option>`;
        }
        return options;
    }
};
