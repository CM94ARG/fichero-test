// ============================================
// MANEJO DE PANTALLAS Y UI
// ============================================

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function showMessage(text, type) {
    const msg = document.getElementById('message');
    msg.innerHTML = text;
    msg.className = `message ${type}`;
}

function hideMessage() {
    document.getElementById('message').className = 'message';
}

function mostrarLoading(btnId, texto) {
    const btn = document.getElementById(btnId);
    if (btn) {
        btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${texto}`;
        btn.disabled = true;
    }
}

function ocultarLoading(btnId, texto, icon = 'check-circle') {
    const btn = document.getElementById(btnId);
    if (btn) {
        btn.innerHTML = `<i class="fas fa-${icon}"></i> ${texto}`;
        btn.disabled = false;
    }
}

function recargarPagina() {
    location.reload();
}

function volverAZonas() {
    sessionStorage.removeItem(CONFIG.STORAGE_KEYS.ZONA_TEMP_ID);
    sessionStorage.removeItem(CONFIG.STORAGE_KEYS.ZONA_TEMP_NOMBRE);
    showScreen('screen-zonas');
    hideMessage();
}
