// Función para cargar los datos del cliente
async function cargarDatosCliente(idCliente) {
    try {
        console.log('[DEBUG] Intentando cargar datos para ID:', idCliente);
        
        // Agregar timestamp para evitar caché
        const url = `../api/usuarios/getCliente.php?id=${idCliente}&t=${Date.now()}`;
        console.log('[DEBUG] URL de solicitud:', url);
        
        const respuesta = await fetch(url);
        console.log('[DEBUG] Estado de respuesta:', respuesta.status);
        
        // Verificar si la respuesta es JSON
        const contentType = respuesta.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const errorData = await respuesta.text();
            console.error('[DEBUG] Respuesta no JSON:', errorData);
            throw new Error('La respuesta del servidor no es válida');
        }
        
        const data = await respuesta.json();
        console.log('[DEBUG] Datos recibidos:', data);
        
        if (data.code === 200) {
            document.getElementById('casillaidcliente').value = data.data.id || '';
            document.getElementById('casillanombre').value = data.data.nombres || '';
            document.getElementById('casillaapellido').value = data.data.apellidos || '';
            document.getElementById('casillacorreo').value = data.data.correo || '';
            document.getElementById('casillaid').value = data.data.cedula || '';
            document.getElementById('casillatelefono').value = data.data.telefono || '';
            document.getElementById('casillatipousu').value = data.data.tipoUsuario || '';
            
            console.log('[DEBUG] Datos cargados correctamente');
        } else {
            console.error('[DEBUG] Error en respuesta:', data.msg);
            throw new Error(data.msg || 'Error al cargar datos del cliente');
        }
    } catch (error) {
        console.error('[ERROR] Detalles completos:', error);
        alert(`Error al cargar datos: ${error.message}`);
        
        // Redirigir si es un error de autenticación
        if (error.message.includes('No autorizado') || error.message.includes('ID inválido')) {
            window.location.href = '../index.html';
        }
    }
}

// Función para guardar los cambios en el servidor
async function guardarCambios() {
    const btnGuardar = document.getElementById('btnguardar');
    const btnOriginalHTML = btnGuardar.innerHTML;
    
    try {
        // Deshabilitar botón durante la operación
        btnGuardar.disabled = true;
        btnGuardar.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Guardando...';
        
        const idCliente = sessionStorage.getItem('idUsuario');
        if (!idCliente) {
            throw new Error('No se ha identificado la sesión del usuario');
        }
        
        console.log('[DEBUG] Preparando datos para guardar...');
        
        // Obtener valores del formulario
        const datosActualizados = {
            id: idCliente,
            nombres: document.getElementById('casillanombre').value.trim(),
            apellidos: document.getElementById('casillaapellido').value.trim(),
            correo: document.getElementById('casillacorreo').value.trim(),
            telefono: document.getElementById('casillatelefono').value.trim()
        };
        
        console.log('[DEBUG] Datos a enviar:', datosActualizados);
        
        // Validaciones
        if (!datosActualizados.nombres || !datosActualizados.apellidos || !datosActualizados.correo) {
            throw new Error('Nombre, apellido y correo son campos obligatorios');
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(datosActualizados.correo)) {
            throw new Error('Por favor ingrese un correo electrónico válido');
        }
        
        // Enviar datos al servidor
        const url = '../api/usuarios/actualizarCliente.php';
        console.log('[DEBUG] Enviando datos a:', url);
        
        const respuesta = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(datosActualizados)
        });
        
        console.log('[DEBUG] Estado de respuesta:', respuesta.status);
        
        // Verificar tipo de contenido
        const contentType = respuesta.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const errorText = await respuesta.text();
            console.error('[DEBUG] Respuesta no JSON:', errorText);
            throw new Error('Respuesta inesperada del servidor');
        }
        
        const resultado = await respuesta.json();
        console.log('[DEBUG] Resultado del servidor:', resultado);
        
        if (!respuesta.ok || resultado.code !== 200) {
            throw new Error(resultado.msg || 'Error al actualizar los datos');
        }
        
        alert('¡Datos actualizados correctamente!');
        console.log('[DEBUG] Datos guardados exitosamente');
        
        // Recargar datos para asegurar consistencia
        await cargarDatosCliente(idCliente);
        
    } catch (error) {
        console.error('[ERROR] Error al guardar:', error);
        alert(`Error: ${error.message}`);
    } finally {
        // Restaurar estado del botón
        btnGuardar.disabled = false;
        btnGuardar.innerHTML = btnOriginalHTML;
        console.log('[DEBUG] Operación de guardado completada');
    }
}

// Manejador de eventos cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('[DEBUG] Página cargada, iniciando proceso...');
    
    // Obtener ID del cliente desde sessionStorage
    const idCliente = sessionStorage.getItem('idUsuario');
    console.log('[DEBUG] ID de usuario en sesión:', idCliente);
    
    if (idCliente) {
        cargarDatosCliente(idCliente);
    } else {
        console.error('[ERROR] No se encontró ID de usuario');
        alert('No se ha identificado su sesión. Por favor inicie sesión nuevamente.');
        window.location.href = '../index.html';
    }
    
    // Configurar eventos de los botones
    document.getElementById('btnvolver').addEventListener('click', function() {
        console.log('[DEBUG] Botón volver clickeado');
        window.history.back();
    });
    
    document.getElementById('btnguardar').addEventListener('click', function() {
        console.log('[DEBUG] Botón guardar clickeado');
        guardarCambios();
    });
    
    console.log('[DEBUG] Configuración inicial completada');
});