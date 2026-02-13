// ============================================
// 📊 HISTORIAL - Ver fichajes de empleados
// ============================================
const adminHistorial = {
    // Mostrar modal de historial
    async mostrarHistorial(empleado) {
        // Crear modal si no existe
        let modal = document.getElementById('modalHistorial');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'modalHistorial';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h2><i class="fas fa-history"></i> Historial de fichajes</h2>
                        <button class="modal-close" onclick="adminHistorial.cerrarModal()">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div id="historialEmpleadoInfo" class="empleado-info"></div>
                        
                        <div class="filtros-historial">
                            <div class="filtro-group">
                                <label for="filtroMes">Mes:</label>
                                <select id="filtroMes" onchange="adminHistorial.cargarHistorial()">
                                    <option value="">Todos</option>
                                    <option value="1">Enero</option>
                                    <option value="2">Febrero</option>
                                    <option value="3">Marzo</option>
                                    <option value="4">Abril</option>
                                    <option value="5">Mayo</option>
                                    <option value="6">Junio</option>
                                    <option value="7">Julio</option>
                                    <option value="8">Agosto</option>
                                    <option value="9">Septiembre</option>
                                    <option value="10">Octubre</option>
                                    <option value="11">Noviembre</option>
                                    <option value="12">Diciembre</option>
                                </select>
                            </div>
                            <div class="filtro-group">
                                <label for="filtroAnio">Año:</label>
                                <select id="filtroAnio" onchange="adminHistorial.cargarHistorial()">
                                    <option value="">Todos</option>
                                </select>
                            </div>
                            <button class="btn-refresh" onclick="adminHistorial.cargarHistorial()">
                                <i class="fas fa-sync-alt"></i> Actualizar
                            </button>
                        </div>
                        
                        <div id="historialLoading" class="historial-loading" style="display: none;">
                            <div class="spinner"></div>
                            <p>Cargando fichajes...</p>
                        </div>
                        
                        <div id="historialError" class="alert error" style="display: none;"></div>
                        
                        <div id="historialTablaContainer" style="display: none;">
                            <div class="historial-resumen">
                                Total de registros: <span id="totalRegistros">0</span>
                            </div>
                            <div class="table-responsive">
                                <table class="historial-table">
                                    <thead>
                                        <tr>
                                            <th>Fecha</th>
                                            <th>Entrada</th>
                                            <th>Salida</th>
                                            <th>Local</th>
                                            <th>Horas</th>
                                            <th>Dispositivo</th>
                                        </tr>
                                    </thead>
                                    <tbody id="historialTableBody">
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            
            // Cargar años
            this.cargarAnios();
        }
        
        // Guardar empleado seleccionado
        this.empleadoActual = empleado;
        
        // Mostrar info del empleado
        document.getElementById('historialEmpleadoInfo').innerHTML = `
            <div class="empleado-badge">
                <i class="fas fa-user"></i>
                <strong>${empleado.nombre}</strong> - DNI: ${empleado.dni}
            </div>
        `;
        
        // Resetear filtros
        document.getElementById('filtroMes').value = '';
        document.getElementById('filtroAnio').value = new Date().getFullYear();
        
        // Mostrar modal
        modal.style.display = 'block';
        
        // Cargar historial
        this.cargarHistorial();
    },
    
    cerrarModal() {
        const modal = document.getElementById('modalHistorial');
        if (modal) {
            modal.style.display = 'none';
        }
    },
    
    cargarAnios() {
        const selectAnio = document.getElementById('filtroAnio');
        const anioActual = new Date().getFullYear();
        
        // Generar últimos 5 años
        for (let i = 0; i < 5; i++) {
            const anio = anioActual - i;
            const option = document.createElement('option');
            option.value = anio;
            option.textContent = anio;
            selectAnio.appendChild(option);
        }
        selectAnio.value = anioActual;
    },
    
    async cargarHistorial() {
        if (!this.empleadoActual) return;
        
        const loading = document.getElementById('historialLoading');
        const error = document.getElementById('historialError');
        const tablaContainer = document.getElementById('historialTablaContainer');
        
        loading.style.display = 'block';
        error.style.display = 'none';
        tablaContainer.style.display = 'none';
        
        try {
            const formData = new FormData();
            formData.append('action', 'getHistorialEmpleado');
            formData.append('dni', this.empleadoActual.dni);
            formData.append('zona', window.zonaActiva.id);
            
            const mes = document.getElementById('filtroMes').value;
            const anio = document.getElementById('filtroAnio').value;
            
            if (mes) formData.append('mes', mes);
            if (anio) formData.append('anio', anio);
            
            const response = await fetch(ADMIN_CONFIG.API_URL, {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.renderizarTabla(data.historial);
                document.getElementById('totalRegistros').textContent = data.total || 0;
                tablaContainer.style.display = 'block';
            } else {
                adminUI.showError(error, data.error || 'Error al cargar historial');
                error.style.display = 'block';
            }
        } catch (error) {
            adminUI.showError(error, 'Error de conexión');
            error.style.display = 'block';
        } finally {
            loading.style.display = 'none';
        }
    },
    
    renderizarTabla(historial) {
        const tbody = document.getElementById('historialTableBody');
        tbody.innerHTML = '';
        
        if (!historial || historial.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 40px;">
                        <i class="fas fa-calendar-times" style="font-size: 40px; color: #ccc; margin-bottom: 15px; display: block;"></i>
                        No hay fichajes para este período
                    </td>
                </tr>
            `;
            return;
        }
        
        historial.forEach(fichaje => {
            const row = document.createElement('tr');
            
            // Determinar si es entrada pendiente
            const esPendiente = !fichaje.horaSalida;
            
            row.innerHTML = `
                <td>${fichaje.fecha}</td>
                <td>${fichaje.horaEntrada}</td>
                <td class="${esPendiente ? 'pendiente' : ''}">
                    ${fichaje.horaSalida || '<span class="badge-pendiente">Pendiente</span>'}
                </td>
                <td>${fichaje.local}</td>
                <td class="horas-col">${fichaje.horas}</td>
                <td><small>${fichaje.dispositivo || 'N/A'}</small></td>
            `;
            
            tbody.appendChild(row);
        });
    }
};
