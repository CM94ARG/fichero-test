// ============================================
// FICHAJE - Registro manual
// ============================================
const adminFichaje = {
    seleccionarAccion(tipo) {
        window.accionSeleccionada = tipo;
        
        document.querySelectorAll('.accion-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        event.currentTarget.classList.add('selected');
        
        this.actualizarFormulario();
    },

    actualizarFormulario() {
        const formularioDiv = document.getElementById('formularioDinamico');
        const localesOptions = adminZona.generarOpcionesLocales(window.zonaActiva.locales);
        
        if (window.accionSeleccionada === 'entrada') {
            formularioDiv.innerHTML = `
                <div class="form-grid">
                    <div class="form-group">
                        <label for="fecha">Fecha de Entrada</label>
                        <input type="date" id="fecha" required>
                    </div>
                    <div class="form-group">
                        <label for="hora">Hora de Entrada</label>
                        <input type="time" id="hora" required>
                    </div>
                    <div class="form-group">
                        <label for="local">Local</label>
                        <select id="local" required>
                            <option value="">Seleccione un local</option>
                            ${localesOptions}
                        </select>
                    </div>
                </div>
            `;
        } else if (window.accionSeleccionada === 'salida') {
            formularioDiv.innerHTML = `
                <div class="form-grid">
                    <div class="form-group">
                        <label for="fecha">Fecha de Salida</label>
                        <input type="date" id="fecha" required>
                    </div>
                    <div class="form-group">
                        <label for="hora">Hora de Salida</label>
                        <input type="time" id="hora" required>
                    </div>
                    <div class="form-group">
                        <label for="local">Local</label>
                        <select id="local" required>
                            <option value="">Seleccione un local</option>
                            ${localesOptions}
                        </select>
                    </div>
                </div>
            `;
        }
        
        this.setDefaultValues();
    },

    setDefaultValues() {
        const hoy = new Date().toISOString().split('T')[0];
        
        if (document.getElementById('fecha')) {
            document.getElementById('fecha').value = hoy;
            
            if (window.accionSeleccionada === 'entrada') {
                document.getElementById('hora').value = '08:00';
            } else {
                document.getElementById('hora').value = '17:00';
            }
        }
        
        if (document.getElementById('local') && document.getElementById('local').options.length > 1) {
            document.getElementById('local').selectedIndex = 1;
        }
    },

    mostrarFormularioAccion() {
        if (!window.empleadoSeleccionado) return;
        
        document.getElementById('empleadoSeleccionado').innerHTML = `
            <strong>Empleado:</strong> ${window.empleadoSeleccionado.nombre}<br>
            <strong>DNI:</strong> ${window.empleadoSeleccionado.dni}<br>
            <strong>Zona:</strong> ${window.zonaActiva.nombre}
        `;
        
        window.accionSeleccionada = null;
        document.querySelectorAll('.accion-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        document.getElementById('formularioDinamico').innerHTML = '';
        document.getElementById('auditoriaInfo').style.display = 'none';
        document.getElementById('accionForm').style.display = 'block';
        
        document.getElementById('accionForm').scrollIntoView({ behavior: 'smooth' });
    },

    cancelarAccion() {
        window.empleadoSeleccionado = null;
        window.accionSeleccionada = null;
        document.getElementById('accionForm').style.display = 'none';
        
        document.querySelectorAll('.empleado-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        document.querySelectorAll('.accion-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        adminUI.clearAlerts();
    },

    async registrarAccionManual() {
        if (!window.empleadoSeleccionado) {
            adminUI.showError('errorAlert', 'Por favor seleccione un empleado');
            return;
        }
        
        if (!window.accionSeleccionada) {
            adminUI.showError('errorAlert', 'Por favor seleccione una acción');
            return;
        }
        
        const fecha = document.getElementById('fecha').value;
        const hora = document.getElementById('hora').value;
        const local = document.getElementById('local').value;
        
        if (!fecha || !hora || !local) {
            adminUI.showError('errorAlert', 'Por favor complete todos los campos');
            return;
        }
        
        const btn = document.getElementById('registrarBtn');
        btn.disabled = true;
        btn.textContent = 'Registrando...';
        
        try {
            const formData = new FormData();
            formData.append('action', 'registroManual');
            formData.append('dni', window.empleadoSeleccionado.dni);
            formData.append('tipo', window.accionSeleccionada);
            formData.append('fecha', fecha);
            formData.append('hora', hora);
            formData.append('local', local);
            formData.append('zona', window.zonaActiva.id);
            
            const response = await fetch(ADMIN_CONFIG.API_URL, {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                adminUI.showSuccess(data.message);
                
                document.getElementById('fechaRegistro').textContent = new Date().toLocaleString('es-AR');
                document.getElementById('adminZona').textContent = window.zonaActiva.nombre;
                document.getElementById('auditoriaZona').textContent = window.zonaActiva.nombre;
                document.getElementById('tipoAccion').textContent = 
                    window.accionSeleccionada === 'entrada' ? 'Entrada' : 'Salida';
                document.getElementById('auditoriaInfo').style.display = 'block';
                
                setTimeout(() => {
                    this.cancelarAccion();
                    adminEmpleados.cargarEmpleadosZona();
                }, 3000);
            } else {
                adminUI.showError('errorAlert', data.error || 'Error desconocido');
            }
        } catch (error) {
            adminUI.showError('errorAlert', 'Error de conexión al registrar');
            console.error('Error en registro manual:', error);
        } finally {
            btn.disabled = false;
            btn.textContent = 'Registrar';
        }
    }
};
