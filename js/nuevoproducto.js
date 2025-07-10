import { enviarAjax } from "../js/tools.js";

document.addEventListener('DOMContentLoaded', function() {
    // Funciones para los botones
    const btnVolver = document.getElementById('btnvolvertendero');
    const btnLimpiar = document.getElementById('btnlimpiar');
    const btnGuardar = document.getElementById('btnguardar');

    const nombreProducto = document.getElementById('nombre-producto');
    const marcaProducto = document.getElementById('marca-producto');
    const medidaProducto = document.getElementById('medida-producto');
    const precioProducto = document.getElementById('precio-producto');
    const categoriaProducto = document.getElementById('categoria-producto');

    // Función para formatear el precio
    function formatearPrecio(valor) {
        // Eliminar todo excepto números
        const soloNumeros = valor.replace(/[^0-9]/g, '');
        // Formatear con separador de miles y signo $
        return '$' + new Intl.NumberFormat('es-CL').format(soloNumeros);
    }

    // Evento para formatear el precio mientras se escribe
    precioProducto.addEventListener('input', function(e) {
        const inicioSeleccion = e.target.selectionStart;
        const valorActual = e.target.value;
        
        // Formatear el valor
        e.target.value = formatearPrecio(valorActual);
        
        // Ajustar la posición del cursor
        const diferencia = e.target.value.length - valorActual.length;
        e.target.setSelectionRange(inicioSeleccion + diferencia, inicioSeleccion + diferencia);
    });

    // Evento para el botón Volver
    btnVolver.addEventListener('click', function() {
        window.history.back(); 
    });

    btnLimpiar.addEventListener('click', function() {
        document.querySelector('form').reset(); // Limpiar todo el formulario
    });

    btnGuardar.addEventListener('click', async function(e) {
        e.preventDefault(); 
        
        if (!nombreProducto.value.trim() || !medidaProducto.value || 
            !precioProducto.value.trim() || !categoriaProducto.value) {
            alert('Por favor complete todos los campos obligatorios');
            return;
        }

        // Obtener el valor numérico del precio (eliminar $ y puntos)
        const precioNumerico = parseFloat(precioProducto.value.replace(/[^0-9]/g, ''));

        if (isNaN(precioNumerico) || precioNumerico <= 0) {
            alert('Por favor ingrese un precio válido');
            return;
        }

        const formData = new FormData();
        formData.append('nombre', nombreProducto.value.trim());
        formData.append('marca', marcaProducto.value.trim());
        formData.append('medida', medidaProducto.value);
        formData.append('precio', precioNumerico); // Enviamos el valor numérico
        formData.append('categoria', categoriaProducto.value);

        try {
            // Enviar datos al servidor
            const respuesta = await fetch('../api/productos/guardarproducto.php', {
                method: 'POST',
                body: formData
            });
            
            const resultado = await respuesta.json();
            
            if (resultado.success) {
                alert('Producto guardado correctamente');
                btnLimpiar.click(); // Esto es para limpiar el formulario cuando se oprima el boton
            } else {
                alert('Error al guardar: ' + resultado.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error de conexión con el servidor');
        }
    });
});