document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación
    const idUsuario = sessionStorage.getItem('idUsuario');
    const nombreUsuario = sessionStorage.getItem('nombreUsuario');
    
    if (!idUsuario) {
        window.location.href = 'iniciosesion';
        return;
    }

    // Elementos del DOM
    const idClienteInput = document.getElementById('idcliente1');
    const nombreClienteInput = document.getElementById('nombreCliente');
    const saldoClienteInput = document.getElementById('saldoCliente');
    const btnvolver = document.getElementById('btnvolver');
    const btnConfirmar = document.getElementById('btnConfirmarOperacion');
    const tabs = document.querySelectorAll('.operacion-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const modal = document.getElementById('verificacionModal');
    const closeModal = document.querySelector('.close-modal');
    const btnVerificarCodigo = document.getElementById('btnVerificarCodigo');
    const btnReenviarCodigo = document.getElementById('btnReenviarCodigo');
    const codigoVerificacionInput = document.getElementById('codigoVerificacion');
    
    // Variables de estado
    let codigoVerificacion = '';
    let operacionActual = 'recargar';
    let datosUsuario = null;
    let telefonoUsuario = '';

    // Inicialización
    init();

    async function init() {
        idClienteInput.value = idUsuario;
        nombreClienteInput.value = nombreUsuario;
        await cargarDatosUsuario(idUsuario);
        configurarEventos();
    }

    async function cargarDatosUsuario(id) {
        try {
            const response = await fetch(`../api/usuarios/getCliente.php?id=${id}`);
            
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
            
            const data = await response.json();
            
            if (data.code === 200) {
                datosUsuario = data.data;
                telefonoUsuario = String(data.data.Celular || '').trim();
                
                if (!telefonoUsuario) {
                    mostrarError('No se encontró número de teléfono registrado');
                    return;
                }
                
                await cargarSaldoUsuario(id);
            } else {
                mostrarError(data.msg || 'Error al cargar datos del usuario');
            }
        } catch (error) {
            console.error('Error:', error);
            mostrarError('Error al obtener datos: ' + error.message);
        }
    }

    async function cargarSaldoUsuario(id) {
        try {
            const response = await fetch(`../api/transacciones/obtenerSaldo.php?id=${id}`);
            const data = await response.json();
            
            if (data.code === 200) {
                saldoClienteInput.value = formatearMoneda(data.saldo);
            } else {
                throw new Error(data.msg || 'Error al obtener saldo');
            }
        } catch (error) {
            console.error('Error:', error);
            saldoClienteInput.value = '$0';
            mostrarError('Error al cargar saldo: ' + error.message);
        }
    }

    function configurarEventos() {
        // Configuración de pestañas
        tabs.forEach(tab => {
            tab.addEventListener('click', () => cambiarPestana(tab.getAttribute('data-tab')));
        });

        // Configuración del botón Volver
        btnvolver.addEventListener('click', function() {
            const tipoUsuario = sessionStorage.getItem('tipoUsuario');
            if (tipoUsuario === 'Tendero') {
                window.location.href = 'menutendero';
            } else {
                window.location.href = 'menuprincipal';
            }
        });

        btnConfirmar.addEventListener('click', iniciarOperacion);
        closeModal.addEventListener('click', cerrarModal);
        btnVerificarCodigo.addEventListener('click', verificarCodigo);
        btnReenviarCodigo.addEventListener('click', enviarCodigoVerificacion);
        
        codigoVerificacionInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') verificarCodigo();
        });
    }

    function cambiarPestana(tabId) {
        operacionActual = tabId;
        tabs.forEach(tab => tab.classList.toggle('active', tab.getAttribute('data-tab') === tabId));
        tabContents.forEach(content => content.classList.toggle('active', content.id === `${tabId}-content`));
    }

    async function iniciarOperacion() {
        const montoInput = operacionActual === 'recargar' ? 'montoRecarga' : 'montoRetiro';
        const entidadInput = operacionActual === 'recargar' ? 'btnentidadbancaria' : 'btnentidadbancariaRetiro';
        
        const monto = parseFloat(document.getElementById(montoInput).value);
        const entidadBancaria = document.getElementById(entidadInput).value;
        const cuentaDestino = operacionActual === 'retirar' ? document.getElementById('cuentaDestino').value : null;

        if (!monto || monto <= 0) {
            mostrarError('Ingrese un monto válido');
            document.getElementById(montoInput).focus();
            return;
        }

        if (entidadBancaria === 'ENTIDAD BANCARIA') {
            mostrarError('Seleccione una entidad bancaria');
            document.getElementById(entidadInput).focus();
            return;
        }

        if (operacionActual === 'retirar') {
            const saldoActual = parseFloat(saldoClienteInput.value.replace(/[^0-9.-]+/g, ""));
            if (monto > saldoActual) {
                mostrarError('Saldo insuficiente');
                document.getElementById(montoInput).focus();
                return;
            }
            
            if (!cuentaDestino) {
                mostrarError('Ingrese cuenta destino');
                document.getElementById('cuentaDestino').focus();
                return;
            }
        }

        sessionStorage.setItem('operacionPendiente', JSON.stringify({
            tipo: operacionActual,
            monto: monto,
            entidadBancaria: entidadBancaria,
            cuentaDestino: cuentaDestino
        }));

        if (await enviarCodigoVerificacion()) {
            abrirModal();
        }
    }

    async function enviarCodigoVerificacion() {
        try {
            if (!telefonoUsuario || !/^[0-9]+$/.test(telefonoUsuario)) {
                throw new Error('Número de teléfono no válido');
            }

            codigoVerificacion = Math.floor(100000 + Math.random() * 900000).toString();
            const telefonoFormateado = `57${telefonoUsuario.slice(-10)}`;
            const mensaje = `Hola ${datosUsuario.Nombres}, tu código es: ${codigoVerificacion}`;

            const { isConfirmed } = await Swal.fire({
                title: 'Verificación WhatsApp',
                html: `Envía este código:<br><h3>${codigoVerificacion}</h3>`,
                showCancelButton: true,
                confirmButtonText: 'Abrir WhatsApp',
                cancelButtonText: 'Copiar Código'
            });

            if (isConfirmed) {
                window.open(`https://wa.me/${telefonoFormateado}?text=${encodeURIComponent(mensaje)}`, '_blank');
            } else {
                await navigator.clipboard.writeText(codigoVerificacion);
                Swal.fire('Código copiado', 'Pégalo en WhatsApp', 'success');
            }

            return true;
        } catch (error) {
            console.error('Error:', error);
            mostrarError('Error al enviar código: ' + error.message);
            return false;
        }
    }

    function abrirModal() {
        modal.style.display = 'block';
        codigoVerificacionInput.value = '';
        codigoVerificacionInput.focus();
    }

    function cerrarModal() {
        modal.style.display = 'none';
    }

    function verificarCodigo() {
        const codigoIngresado = codigoVerificacionInput.value.trim();
        
        if (codigoIngresado === codigoVerificacion) {
            completarOperacion();
        } else {
            mostrarError('Código incorrecto');
            codigoVerificacionInput.focus();
        }
    }

    async function completarOperacion() {
        const operacion = JSON.parse(sessionStorage.getItem('operacionPendiente'));
        
        try {
            const endpoint = operacion.tipo === 'recargar' 
                ? '../api/transacciones/recargarCuenta.php' 
                : '../api/transacciones/retirarDinero.php';
            
            const body = {
                idUsuario: idUsuario,
                monto: operacion.monto,
                entidadBancaria: operacion.entidadBancaria
            };
            
            if (operacion.tipo === 'retirar') {
                body.cuentaDestino = operacion.cuentaDestino;
            }
            
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            
            const data = await response.json();
            
            if (data.code === 200) {
                mostrarExito(operacion.tipo === 'recargar' 
                    ? `Recarga exitosa: ${formatearMoneda(operacion.monto)}` 
                    : `Retiro exitoso: ${formatearMoneda(operacion.monto)}`);
                
                await cargarSaldoUsuario(idUsuario);
                limpiarFormulario(operacion.tipo);
                cerrarModal();
            } else {
                throw new Error(data.msg || 'Error en la operación');
            }
        } catch (error) {
            console.error('Error:', error);
            mostrarError('Error: ' + error.message);
        }
    }

    function limpiarFormulario(tipo) {
        if (tipo === 'recargar') {
            document.getElementById('montoRecarga').value = '';
            document.getElementById('btnentidadbancaria').selectedIndex = 0;
        } else {
            document.getElementById('montoRetiro').value = '';
            document.getElementById('btnentidadbancariaRetiro').selectedIndex = 0;
            document.getElementById('cuentaDestino').value = '';
        }
    }

    function formatearMoneda(valor) {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(valor);
    }

    function mostrarError(mensaje) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: mensaje,
            confirmButtonColor: '#3085d6'
        });
    }

    function mostrarExito(mensaje) {
        Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: mensaje,
            confirmButtonColor: '#3085d6'
        });
    }
});