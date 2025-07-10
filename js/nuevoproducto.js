import { enviarAjax } from "../js/tools.js";

document.addEventListener('DOMContentLoaded', function() {
    // Botones
    const btnVolver = document.getElementById('btnvolvertendero');
    const btnLimpiar = document.getElementById('btnlimpiar');
    const btnGuardar = document.getElementById('btnguardar');

    // Campos del formulario
    const nombreProducto = document.getElementById('nombre-producto');
    const marcaProducto = document.getElementById('marca-producto');
    const medidaProducto = document.getElementById('medida-producto');
    const precioProducto = document.getElementById('precio-producto');
    const categoriaProducto = document.getElementById('categoria-producto');

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

        if (isNaN(precioProducto.value) || parseFloat(precioProducto.value) <= 0) {
            alert('Por favor ingrese un precio válido');
            return;
        }

        const formData = new FormData();
        formData.append('nombre', nombreProducto.value.trim());
        formData.append('marca', marcaProducto.value.trim());
        formData.append('medida', medidaProducto.value);
        formData.append('precio', parseFloat(precioProducto.value));
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
                btnLimpiar.click(); // Limpiar formulario
            } else {
                alert('Error al guardar: ' + resultado.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error de conexión con el servidor');
        }
    });
});