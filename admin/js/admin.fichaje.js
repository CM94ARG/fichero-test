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
                        <label for="local">Local</label
