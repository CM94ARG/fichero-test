// ============================================
// AUTENTICACIÓN - Login y sesión
// ============================================
const adminAuth = {
    inicializar() {
        // ✅ USAR LA KEY DEL ADMIN, no la del fichaje
        const zonaGuardada = localStorage.getItem(ADMIN_CONFIG.STORAGE_KEYS.ZONA_ACTIVA);
        
        if (zonaGuardada) {
            window.zonaActiva = JSON.parse(zonaGuardada);
            this.mostrarZonaGuardada();
        }
        
        document.getElementById('password').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.loginZona();
        });
        
        // ✅ Generar device ID para admin si no existe
        if (!localStorage.getItem(ADMIN_CONFIG.STORAGE_KEYS.DEVICE_ID)) {
            this.generarDeviceId();
        }
    },

    // ✅ NUEVA FUNCIÓN - Generar ID único para admin
    generarDeviceId() {
        const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        const deviceId = `ADMIN_${uuid}`;
        localStorage.setItem(ADMIN_CONFIG.STORAGE_KEYS.DEVICE_ID, deviceId);
        return deviceId;
    },

    async loginZona() {
        const zonaId = document.getElementById('zonaSelect').value;
        const password = document.getElementById('password').value;
        const loginBtn = document.getElementById('loginBtn');
        const loginError = document.getElementById('loginError');
        
        if (!zonaId) {
            adminUI.showError(loginError, 'Por favor seleccioná una zona');
            return;
        }
        
        if (!password) {
            adminUI.showError(loginError, 'Por favor ingresá la contraseña');
            return;
        }
        
        loginBtn.disabled = true;
        loginBtn.textContent = 'Verificando...';
        loginError.style.display = 'none';
        
        try {
            const formData = new FormData();
            formData.append('action', 'loginFranquicia');
            formData.append('zona', zonaId);
            formData.append('clave_acceso', password);
            
            // ✅ ENVIAR device_id del admin
            formData.append('device_id', localStorage.getItem(ADMIN_CONFIG.STORAGE_KEYS.DEVICE_ID) || this.generarDeviceId());
            
            // Obtener IP
            try {
                const ipRes = await fetch('https://api.ipify.org?format=json');
                const ipData = await ipRes.json();
                formData.append('ip_publica', ipData.ip);
            } catch (e) {
                formData.append('ip_publica', 'No detectada');
            }
            
            const response = await fetch(ADMIN_CONFIG.API_URL, {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                window.zonaActiva = {
                    id: zonaId,
                    nombre: data.franquicia.nombre,
                    locales: data.franquicia.locales
                };
                
                // ✅ GUARDAR CON LAS KEYS DEL ADMIN
                localStorage.setItem(ADMIN_CONFIG.STORAGE_KEYS.ZONA_ACTIVA, 
                    JSON.stringify(window.zonaActiva));
                localStorage.setItem(ADMIN_CONFIG.STORAGE_KEYS.DEVICE_REGISTERED, 'true');
                
                adminUI.showAdminPanel(window.zonaActiva);
                adminEmpleados.cargarEmpleadosZona();
            } else {
                adminUI.showError(loginError, data.error || 'Contraseña incorrecta');
            }
        } catch (error) {
            adminUI.showError(loginError, 'Error de conexión');
            console.error('Login error:', error);
        } finally {
            loginBtn.disabled = false;
            loginBtn.textContent = 'Ingresar a mi zona';
            document.getElementById('password').value = '';
        }
    },

    mostrarZonaGuardada() {
        document.getElementById('loginSection').style.display = 'block';
        document.getElementById('adminSection').style.display = 'none';
        
        const zonaGuardadaInfo = document.getElementById('zonaGuardadaInfo');
        zonaGuardadaInfo.style.display = 'block';
        
        document.getElementById('zonaSelect').style.display = 'none';
        document.getElementById('zonaInfo').style.display = 'none';
        document.querySelector('.input-group label[for="password"]').parentElement.style.display = 'none';
        document.querySelector('.login-section h2').textContent = 'Sesión activa';
    },

    // ✅ USAR LA KEY DEL ADMIN
    usarZonaGuardada() {
        const zonaGuardada = localStorage.getItem(ADMIN_CONFIG.STORAGE_KEYS.ZONA_ACTIVA);
        if (zonaGuardada) {
            window.zonaActiva = JSON.parse(zonaGuardada);
            adminUI.showAdminPanel(window.zonaActiva);
            adminEmpleados.cargarEmpleadosZona();
        }
    },

    logout() {
        if (confirm('¿Cerrar sesión? Se borrará la zona guardada.')) {
            // ✅ BORRAR SOLO LAS KEYS DEL ADMIN
            localStorage.removeItem(ADMIN_CONFIG.STORAGE_KEYS.ZONA_ACTIVA);
            localStorage.removeItem(ADMIN_CONFIG.STORAGE_KEYS.DEVICE_REGISTERED);
            localStorage.removeItem(ADMIN_CONFIG.STORAGE_KEYS.DEVICE_ID);
            
            window.zonaActiva = null;
            window.empleadoSeleccionado = null;
            window.accionSeleccionada = null;
            
            location.reload();
        }
    }
};
