// ============================================
// ESTADO GLOBAL
// ============================================

let zonaActual = null;
let dispositivoAutorizado = false;
let currentLocal = '';
let currentType = 'entrada';

// ============================================
// INICIALIZACIÓN
// ============================================

async function inicializar() {
    // Asegurar device ID
    if (!localStorage.getItem(CONFIG.STORAGE_KEYS.DEVICE_ID)) {
        generarDeviceId();
    }
    actualizarInfoDispositivo();
    
    // Verificar registro de dispositivo
    dispositivoAutorizado = localStorage.getItem(CONFIG.STORAGE_KEYS.DEVICE_REGISTERED) === 'true';
    
    // Verificar zona guardada
    const zonaGuardada = localStorage.getItem(CONFIG.STORAGE_KEYS.ZONA_GUARDADA);
    
    if (zonaGuardada) {
        zonaActual = JSON.parse(zonaGuardada);
        
        if (dispositivoAutorizado) {
            cargarPantallaPrincipal();
        } else {
            showScreen('screen-device-register');
            document.getElementById('deviceIdDisplay').textContent = 
                localStorage.getItem(CONFIG.STORAGE_KEYS.DEVICE_ID);
        }
    } else {
        await cargarZonas();
        showScreen('screen-zonas');
    }
    
    configurarEventListeners();
}

// ============================================
// ZONAS (PRIMERA VEZ)
// ============================================

async function cargarZonas() {
    try {
        const data = await getFranquicias();
        if (data.success) {
            mostrarZonas(data.franquicias);
        } else {
            mostrarZonasFallback();
        }
    } catch (error) {
        mostrarZonasFallback();
    }
}

function mostrarZonas(franquicias) {
    const container = document.getElementById('zonas-container');
    let html = '';
    franquicias.forEach(z => {
        html += `<div class="zona-card" onclick="seleccionarZona('${z.id}', '${z.nombre}')">
            <i class="fas fa-store"></i>
            <h3>${z.nombre}</h3>
            <p>Hacé clic para seleccionar</p>
        </div>`;
    });
    container.innerHTML = html;
}

function seleccionarZona(id, nombre) {
    sessionStorage.setItem(CONFIG.STORAGE_KEYS.ZONA_TEMP_ID, id);
    sessionStorage.setItem(CONFIG.STORAGE_KEYS.ZONA_TEMP_NOMBRE, nombre);
    document.getElementById('zona-seleccionada-nombre').textContent = nombre;
    document.getElementById('clave-input').value = '';
    showScreen('screen-clave');
}

async function validarClaveZona() {
    const clave = document.getElementById('clave-input').value;
    const zonaId = sessionStorage.getItem(CONFIG.STORAGE_KEYS.ZONA_TEMP_ID);
    const zonaNombre = sessionStorage.getItem(CONFIG.STORAGE_KEYS.ZONA_TEMP_NOMBRE);
    
    if (!clave || !zonaId) return;
    
    mostrarLoading('btn-validar-clave', 'Verificando...');
    
    try {
        const data = await loginFranquicia(zonaId, clave);
        
        if (data.success) {
            zonaActual = {
                id: zonaId,
                nombre: zonaNombre,
                locales: data.franquicia.locales
            };
            localStorage.setItem(CONFIG.STORAGE_KEYS.ZONA_GUARDADA, JSON.stringify(zonaActual));
            sessionStorage.removeItem(CONFIG.STORAGE_KEYS.ZONA_TEMP_ID);
            sessionStorage.removeItem(CONFIG.STORAGE_KEYS.ZONA_TEMP_NOMBRE);
            
            showMessage('✅ Zona guardada', 'success');
            
            if (dispositivoAutorizado) {
                cargarPantallaPrincipal();
            } else {
                showScreen('screen-device-register');
                document.getElementById('deviceIdDisplay').textContent = 
                    localStorage.getItem(CONFIG.STORAGE_KEYS.DEVICE_ID);
            }
        } else {
            showMessage(data.error || '❌ Clave incorrecta', 'error');
        }
    } catch (error) {
        showMessage('❌ Error de conexión', 'error');
    } finally {
        ocultarLoading('btn-validar-clave', 'VALIDAR Y GUARDAR');
    }
}

// ============================================
// DISPOSITIVO
// ============================================

async function registrarDispositivo() {
    const clave = document.getElementById('registro-clave').value;
    if (!clave) return;
    
    mostrarLoading('btn-registrar', 'Registrando...');
    
    try {
        const data = await registrarDispositivoAPI(clave);
        
        if (data.success) {
            dispositivoAutorizado = true;
            localStorage.setItem(CONFIG.STORAGE_KEYS.DEVICE_REGISTERED, 'true');
            showMessage('✅ Dispositivo registrado', 'success');
            setTimeout(cargarPantallaPrincipal, 1500);
        } else {
            showMessage(data.error || '❌ Error', 'error');
        }
    } catch (error) {
        showMessage('❌ Error de conexión', 'error');
    } finally {
        ocultarLoading('btn-registrar', 'REGISTRAR DISPOSITIVO');
    }
}

// ============================================
// PANTALLA PRINCIPAL
// ============================================

function cargarPantallaPrincipal() {
    if (!zonaActual?.locales) return;
    
    document.getElementById('zona-actual-label').textContent = zonaActual.nombre;
    document.getElementById('logo-subtitle').textContent = 
        `${zonaActual.nombre} · ${Object.keys(zonaActual.locales).length} locales`;
    
    let html = '';
    for (const [id, nombre] of Object.entries(zonaActual.locales)) {
        html += `<button class="local-btn" onclick="selectLocal('${id}')">
            <div class="icon"><i class="fas fa-store"></i></div>
            <div class="local-info">
                <div class="local-name">${nombre}</div>
                <div class="local-type">Registrar entrada</div>
            </div>
        </button>`;
    }
    document.getElementById('locales-container').innerHTML = html;
    
    showScreen('screen-home');
    hideMessage();
}

// ============================================
// FICHAJE
// ============================================

function selectLocal(local) {
    if (!dispositivoAutorizado) {
        showMessage('🔐 Dispositivo no autorizado', 'warning');
        return;
    }
    
    currentLocal = local;
    currentType = 'entrada';
    
    const localNombre = zonaActual.locales[local] || local.toUpperCase();
    const card = document.getElementById('local-info');
    card.className = 'local-info-card';
    card.innerHTML = `<h3>Fichaje de <span>ENTRADA</span></h3>
        <div class="local-name">${localNombre}</div>
        <div class="fichaje-type">ENTRADA</div>`;
    
    showScreen('screen-dni');
    document.getElementById('dni-input').value = '';
    document.getElementById('dni-input').focus();
    hideMessage();
}

function selectSalida() {
    if (!dispositivoAutorizado) {
        showMessage('🔐 Dispositivo no autorizado', 'warning');
        return;
    }
    
    currentLocal = 'general';
    currentType = 'salida';
    
    const card = document.getElementById('local-info');
    card.className = 'local-info-card salida';
    card.innerHTML = `<h3>Fichaje de <span>SALIDA</span></h3>
        <div class="local-name">DESDE CUALQUIER LUGAR</div>
        <div class="fichaje-type">SALIDA</div>`;
    
    showScreen('screen-dni');
    document.getElementById('dni-input').value = '';
    document.getElementById('dni-input').focus();
    hideMessage();
}

async function submitFichaje() {
    if (!dispositivoAutorizado || !zonaActual) return;
    
    const dni = document.getElementById('dni-input').value.trim();
    if (!/^\d{7,8}$/.test(dni)) {
        showMessage('❌ DNI inválido', 'error');
        return;
    }
    
    const btn = document.getElementById('submit-btn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ENVIANDO...';
    
    try {
        const data = await registrarFichaje(dni, currentType, currentLocal, zonaActual.id);
        
        if (data.success) {
            let msg = `✅ ${data.message}`;
            if (data.horas) msg += `<br><small>Horas: ${data.horas}</small>`;
            showMessage(msg, 'success');
            
            setTimeout(() => {
                goBack();
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-check-circle"></i> CONFIRMAR FICHAJE';
                document.getElementById('dni-input').value = '';
            }, 2000);
        } else {
            showMessage(data.error || '❌ Error', 'error');
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-check-circle"></i> CONFIRMAR FICHAJE';
        }
    } catch (error) {
        showMessage('❌ Error de conexión', 'error');
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-check-circle"></i> CONFIRMAR FICHAJE';
    }
}

function goBack() {
    showScreen('screen-home');
    hideMessage();
}

// ============================================
// EVENTOS
// ============================================

function configurarEventListeners() {
    document.getElementById('dni-input')?.addEventListener('keypress', e => {
        if (e.key === 'Enter') submitFichaje();
    });
    
    document.getElementById('dni-input')?.addEventListener('input', e => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });
    
    document.getElementById('registro-clave')?.addEventListener('keypress', e => {
        if (e.key === 'Enter') registrarDispositivo();
    });
    
    document.getElementById('clave-input')?.addEventListener('keypress', e => {
        if (e.key === 'Enter') validarClaveZona();
    });
}

// ============================================
// INICIAR
// ============================================

window.onload = inicializar;
