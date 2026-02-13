// ============================================
// EMPLEADOS - Carga y selección
// ============================================
const adminEmpleados = {
    async cargarEmpleadosZona() {
        if (!window.zonaActiva) return;
        
        adminUI.showLoading(true);
        
        try {
            const formData = new FormData();
            formData.append('action', 'getEmpleadosPorFranquicia');
            formData.append('zona', window.zonaActiva.id);
            
            const response = await fetch(ADMIN_CONFIG.API_URL, {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                window.zonaActiva.empleados = data.empleados;
                this.renderEmpleados(data.empleados);
            } else {
                adminUI.showError('errorAlert', 'Error al cargar empleados: ' + (data.error || 'Desconocido'));
            }
        } catch (error) {
            adminUI.showError('errorAlert', 'Error de conexión al cargar empleados');
            console.error('Error cargando empleados:', error);
        } finally {
            adminUI.showLoading(false);
        }
    },

    renderEmpleados(empleados) {
        const container = document.getElementById('empleadosContainer');
        container.innerHTML = '';
        
        if (!empleados || empleados.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 60px; background: #f8f9fa; border-radius: 12px;">
                    <i class="fas fa-users" style="font-size: 48px; color: #ccc; margin-bottom: 15px;"></i>
                    <h3 style="color: #666; margin-bottom: 10px;">No hay empleados en esta zona</h3>
                    <p style="color: #999;">Agregá empleados desde el backend</p>
                </div>
            `;
            return;
        }
        
        empleados.forEach(empleado => {
            const card = document.createElement('div');
            card.className = 'empleado-card';
            
            // Doble click para ver historial
            card.ondblclick = (e) => {
                e.stopPropagation();
                if (typeof adminHistorial !== 'undefined') {
                    adminHistorial.mostrarHistorial(empleado);
                } else {
                    console.error('adminHistorial no está definido');
                    alert('Error: Módulo de historial no cargado');
                }
            };
            
            // Click para seleccionar (fichaje manual)
            card.onclick = (e) => this.seleccionarEmpleado(empleado, e);
            
            // Escapar el JSON para el botón
            const empleadoJSON = JSON.stringify(empleado).replace(/'/g, "&apos;").replace(/"/g, '&quot;');
            
            card.innerHTML = `
                <h3>${empleado.nombre}</h3>
                <div class="dni">DNI: ****${empleado.dni.slice(-4)}</div>
                <div class="badge">${window.zonaActiva.nombre}</div>
                <div class="empleado-actions">
                    <button class="btn-historial" onclick="event.stopPropagation(); adminHistorial.mostrarHistorial(${empleadoJSON})">
                        <i class="fas fa-history"></i> Ver fichajes
                    </button>
                </div>
            `;
            
            container.appendChild(card);
        });
    },

    seleccionarEmpleado(empleado, event) {
        document.querySelectorAll('.empleado-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        event.currentTarget.classList.add('selected');
        window.empleadoSeleccionado = empleado;
        window.accionSeleccionada = null;
        
        adminFichaje.mostrarFormularioAccion();
    }
};
