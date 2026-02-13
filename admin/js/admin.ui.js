// ============================================
// UI - Mensajes, Loading, Pantallas
// ============================================
const adminUI = {
    showLoading(show) {
        document.getElementById('loading').style.display = show ? 'block' : 'none';
    },

    showSuccess(message) {
        const alert = document.getElementById('successAlert');
        alert.textContent = message;
        alert.style.display = 'block';
        setTimeout(() => {
            alert.style.display = 'none';
        }, 5000);
    },

    showError(element, message) {
        if (typeof element === 'string') {
            element = document.getElementById(element);
        }
        element.textContent = message;
        element.style.display = 'block';
    },

    clearAlerts() {
        const alerts = document.querySelectorAll('.alert');
        alerts.forEach(alert => {
            alert.style.display = 'none';
        });
    },

    showAdminPanel(zonaActiva) {
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('adminSection').style.display = 'block';
        document.querySelector('.logout-btn').style.display = 'block';
        
        document.getElementById('header-subtitle').textContent = `Panel de ${zonaActiva.nombre}`;
        document.getElementById('zonaNombre').textContent = zonaActiva.nombre;
        document.getElementById('zonaDetalle').innerHTML = 
            `<i class="fas fa-map-marker-alt"></i> ${Object.keys(zonaActiva.locales).length} locales disponibles`;
        document.getElementById('zonaEmpleadosTitulo').textContent = zonaActiva.nombre;
        
        // Fecha actual
        const hoy = new Date().toLocaleDateString('es-AR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        document.getElementById('fechaHoy').textContent = hoy.charAt(0).toUpperCase() + hoy.slice(1);
    }
};
