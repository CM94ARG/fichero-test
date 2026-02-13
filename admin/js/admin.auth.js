// ============================================
// AUTENTICACIÓN - Login y sesión
// ============================================
const adminAuth = {
    inicializar() {
        const zonaGuardada = localStorage.getItem(ADMIN_CONFIG.STORAGE_KEYS.ZONA_ACTIVA);
        
        if (zonaGuardada) {
            window.zonaActiva = JSON.parse(zonaGuardada);
            this.mostrarZonaGuardada();
        }
        
        document.getElementById('password').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.loginZona();
        });
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
                
                localStorage.setItem(ADMIN_CONFIG.STORAGE_KEYS.ZONA_ACTIVA, 
                    JSON.stringify(window.zonaActiva));
                
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
            localStorage.removeItem(ADMIN_CONFIG.STORAGE_KEYS.ZONA_ACTIVA);
            window.zonaActiva = null;
            window.empleadoSeleccionado = null;
            window.accionSeleccionada = null;
            
            location.reload();
        }
    }
};
