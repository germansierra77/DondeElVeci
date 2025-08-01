import { enviarAjax } from "../js/tools.js";

document.addEventListener('DOMContentLoaded', function() {
    // Botón de guardar
    document.getElementById('btnguardar').addEventListener('click', function() {
        guardarUsuario();
    });

    // Botón de volver
    document.getElementById('btniniciosesion').addEventListener('click', function() {
        window.location.href = 'iniciosesion';
        
    });
});

function guardarUsuario() {
    const form = document.getElementById('formCreacionUsuario');
    const formData = new FormData(form);

    // Validar campos antes de enviar
    if (!validarFormulario(formData)) {
        return;
    }

    fetch('../api/usuarios/crear_usuario.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Usuario registrado exitosamente');
            // Redirigir o limpiar el formulario
            form.reset();
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Ocurrió un error al procesar la solicitud');
    });
}

function validarFormulario(formData) {
    // Validar que la cédula sea un número válido
    const cedula = formData.get('Cedula');
    if (isNaN(cedula) || cedula <= 0) {
        alert('La cédula debe ser un número válido');
        return false;
    }

    // Validar formato de correo
    const correo = formData.get('Correo');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        alert('Por favor ingrese un correo electrónico válido');
        return false;
    }

    // Validar longitud de contraseña (puedes ajustar según tus necesidades)
    const contrasena = formData.get('Contrasena');
    if (contrasena.length < 6) {
        alert('La contraseña debe tener al menos 6 caracteres');
        return false;
    }

    return true;

}
