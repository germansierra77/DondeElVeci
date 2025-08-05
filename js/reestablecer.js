document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const btnPorId = document.getElementById('btnPorId');
    const btnPorCorreo = document.getElementById('btnPorCorreo');
    const formularioId = document.getElementById('formulario-id');
    const formularioCorreo = document.getElementById('formulario-correo');
    const btnBuscarUsuario = document.getElementById('btnbuscarusuario');
    const btnVolver = document.getElementById('btnvolver');
    
    // Elementos de modales
    const modalUsuario = document.getElementById('modalUsuario');
    const modalCodigo = document.getElementById('modalCodigo');
    const modalContrasena = document.getElementById('modalContrasena');
    const cerrarModales = document.querySelectorAll('.cerrar-modal');
    
    let metodoActual = 'id';
    let codigoGenerado = '';
    let usuarioEncontrado = null;

    // Cambiar entre métodos (ID/Correo)
    btnPorId.addEventListener('click', function() {
        metodoActual = 'id';
        btnPorId.classList.add('metodo-activo');
        btnPorCorreo.classList.remove('metodo-activo');
        formularioId.style.display = 'block';
        formularioCorreo.style.display = 'none';
    });

    btnPorCorreo.addEventListener('click', function() {
        metodoActual = 'correo';
        btnPorCorreo.classList.add('metodo-activo');
        btnPorId.classList.remove('metodo-activo');
        formularioCorreo.style.display = 'block';
        formularioId.style.display = 'none';
    });

    // Buscar usuario por ID o Correo
    btnBuscarUsuario.addEventListener('click', async function() {
        let identificador = '';
        let endpoint = '';
        
        if (metodoActual === 'id') {
            identificador = document.getElementById('casillaidcliente').value.trim();
            endpoint = `../api/usuarios/buscarUsuario.php?id=${encodeURIComponent(identificador)}`;
            if (!identificador) {
                alert('Por favor ingresa un ID válido');
                return;
            }
        } else {
            identificador = document.getElementById('casillacorreobusqueda').value.trim();
            endpoint = `../api/usuarios/buscarUsuario.php?correo=${encodeURIComponent(identificador)}`;
            if (!identificador || !identificador.includes('@')) {
                alert('Por favor ingresa un correo electrónico válido');
                return;
            }
        }

        try {
            // Mostrar carga
            btnBuscarUsuario.disabled = true;
            btnBuscarUsuario.innerHTML = '<i class="fas fa-spinner fa-spin"></i> BUSCANDO...';

            // Hacer la petición a la API
            const respuesta = await fetch(endpoint);
            const data = await respuesta.json();
            
            if (data.code === 200) {
                usuarioEncontrado = data.data;
                
                // Mostrar información en modal
                document.getElementById('modal-nombre').value = usuarioEncontrado.Nombres || '';
                document.getElementById('modal-apellido').value = usuarioEncontrado.Apellidos || '';
                document.getElementById('modal-celular').value = usuarioEncontrado.telefono || '';
                
                modalUsuario.style.display = 'flex';
            } else {
                alert('Usuario no encontrado: ' + data.msg);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al buscar usuario');
        } finally {
            btnBuscarUsuario.disabled = false;
            btnBuscarUsuario.innerHTML = '<i class="fas fa-search"></i> BUSCAR USUARIO';
        }
    });

    // Enviar código de verificación
    document.getElementById('modal-enviarcodigo').addEventListener('click', async function() {
        if (!usuarioEncontrado) return;
        
        // Generar código de 6 dígitos
        codigoGenerado = Math.floor(100000 + Math.random() * 900000).toString();
        
        try {
            const btn = document.getElementById('modal-enviarcodigo');
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ENVIANDO...';
            
            // Aquí deberías integrar con tu servicio de SMS/Email real
            console.log(`Código generado para ${usuarioEncontrado.telefono}: ${codigoGenerado}`);
            alert(`Código enviado al número registrado: ${codigoGenerado}`);
            
            modalUsuario.style.display = 'none';
            modalCodigo.style.display = 'flex';
            
        } catch (error) {
            console.error('Error:', error);
            alert('Error al enviar el código');
        } finally {
            const btn = document.getElementById('modal-enviarcodigo');
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-paper-plane"></i> ENVIAR CÓDIGO';
        }
    });

    // Verificar código
    document.getElementById('modal-verificarcodigo').addEventListener('click', function() {
        const codigoIngresado = document.getElementById('modal-codigo').value.trim();
        
        if (codigoIngresado !== codigoGenerado) {
            alert('Código de verificación incorrecto');
            return;
        }
        
        modalCodigo.style.display = 'none';
        modalContrasena.style.display = 'flex';
    });

    // Guardar nueva contraseña
    document.getElementById('modal-guardar').addEventListener('click', async function() {
        const nuevaClave = document.getElementById('modal-nuevaclave').value.trim();
        const confirmarClave = document.getElementById('modal-confirmarclave').value.trim();
        
        if (nuevaClave.length < 6) {
            alert('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        if (nuevaClave !== confirmarClave) {
            alert('Las contraseñas no coinciden');
            return;
        }

        try {
            const btn = document.getElementById('modal-guardar');
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> GUARDANDO...';
            
            // Enviar nueva contraseña al servidor
            const respuesta = await fetch('../api/credenciales/actualizarClave.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: usuarioEncontrado.Id,
                    nuevaClave: nuevaClave
                })
            });

            const data = await respuesta.json();
            
            if (data.code === 200) {
                alert('Contraseña actualizada correctamente');
                window.location.href = 'iniciosesion.html';
            } else {
                alert('Error al actualizar: ' + data.msg);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al conectar con el servidor');
        } finally {
            const btn = document.getElementById('modal-guardar');
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-save"></i> GUARDAR CONTRASEÑA';
        }
    });

    // Cerrar modales
    cerrarModales.forEach(btn => {
        btn.addEventListener('click', function() {
            modalUsuario.style.display = 'none';
            modalCodigo.style.display = 'none';
            modalContrasena.style.display = 'none';
        });
    });

    // Cerrar modal al hacer clic fuera del contenido
    window.addEventListener('click', function(event) {
        if (event.target === modalUsuario) modalUsuario.style.display = 'none';
        if (event.target === modalCodigo) modalCodigo.style.display = 'none';
        if (event.target === modalContrasena) modalContrasena.style.display = 'none';
    });

    // Botón volver
    btnVolver.addEventListener('click', function() {
        window.history.back();
    });
});

    // Verificar código
    document.getElementById('modal-verificarcodigo').addEventListener('click', function() {
        const codigoIngresado = document.getElementById('modal-codigo').value.trim();
        
        if (codigoIngresado !== codigoGenerado) {
            alert('Código de verificación incorrecto');
            return;
        }
        
        modalCodigo.style.display = 'none';
        modalContrasena.style.display = 'flex';
    });

    // Guardar nueva contraseña
    document.getElementById('modal-guardar').addEventListener('click', async function() {
        const nuevaClave = document.getElementById('modal-nuevaclave').value.trim();
        const confirmarClave = document.getElementById('modal-confirmarclave').value.trim();
        
        if (nuevaClave.length < 6) {
            alert('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        if (nuevaClave !== confirmarClave) {
            alert('Las contraseñas no coinciden');
            return;
        }

        try {
            const btn = document.getElementById('modal-guardar');
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> GUARDANDO...';
            
            // Simular guardado en servidor (reemplazar con tu API real)
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            alert('Contraseña actualizada correctamente');
            window.location.href = 'iniciosesion.html';
            
        } catch (error) {
            console.error('Error:', error);
            alert('Error al guardar la contraseña');
        } finally {
            const btn = document.getElementById('modal-guardar');
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-save"></i> GUARDAR CONTRASEÑA';
        }
    });

    // Cerrar modales
    cerrarModales.forEach(btn => {
        btn.addEventListener('click', function() {
            modalUsuario.style.display = 'none';
            modalCodigo.style.display = 'none';
            modalContrasena.style.display = 'none';
        });
    });

    // Cerrar modal al hacer clic fuera del contenido
    window.addEventListener('click', function(event) {
        if (event.target === modalUsuario) modalUsuario.style.display = 'none';
        if (event.target === modalCodigo) modalCodigo.style.display = 'none';
        if (event.target === modalContrasena) modalContrasena.style.display = 'none';
    });

    // Botón volver
    btnVolver.addEventListener('click', function() {
        window.history.back();
    });