// Función para cargar los datos del cliente
async function cargarDatosCliente(idCliente) {
    try {
        // Construir la URL correctamente
        const url = `../api/usuarios/getCliente.php?id=${encodeURIComponent(idCliente)}`;
        
        const respuesta = await fetch(url);
        
        // Verificar si la respuesta es OK
        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }
        
        // Verificar el tipo de contenido
        const contentType = respuesta.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new TypeError("La respuesta no es JSON");
        }
        
        const data = await respuesta.json();
        
        if (data.code === 200) {
            // Llenar los campos del formulario con los datos obtenidos
            document.getElementById('casillaidcliente').value = data.data.id;
            document.getElementById('casillanombre').value = data.data.nombres;
            document.getElementById('casillaapellido').value = data.data.apellidos;
            document.getElementById('casillacorreo').value = data.data.correo;
            document.getElementById('casillaid').value = data.data.cedula;
            document.getElementById('casillatelefono').value = data.data.telefono;
            document.getElementById('casillatipousu').value = data.data.tipoUsuario;
        } else {
            console.error('Error al obtener datos del cliente:', data.msg);
            alert('Error al cargar los datos del cliente: ' + data.msg);
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        alert(`Error al conectar con el servidor: ${error.message}`);
    }
}

// Función para obtener el ID del cliente de sessionStorage
function obtenerIdCliente() {
    // Obtener de sessionStorage
    const idCliente = sessionStorage.getItem('idUsuario');
    
    if (!idCliente) {
        console.error('No se encontró ID de cliente en sessionStorage');
        alert('No se pudo identificar al cliente. Por favor inicie sesión nuevamente.');
        window.location.href = '../index.html';
        return null;
    }
    
    return idCliente;
}

// Al cargar la página, obtener y mostrar los datos del cliente
document.addEventListener('DOMContentLoaded', function() {
    const idCliente = obtenerIdCliente();
    
    if (idCliente) {
        cargarDatosCliente(idCliente);
    }
    
    // Configurar botones
    document.getElementById('btnvolver').addEventListener('click', function() {
        window.history.back();
    });
    
    document.getElementById('btnguardar').addEventListener('click', function() {
        alert('Función de guardar aún no implementada');
    });
});