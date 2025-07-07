// FUNCIÓN PARA LIMPIAR FORMULARIO
document.addEventListener('DOMContentLoaded', function() {
    const btnLimpiar = document.getElementById('btnlimpiar');
    
    btnLimpiar.addEventListener('click', function() {
        // Limpiar campos de texto
        document.getElementById('nombre-producto').value = '';
        document.getElementById('marca-producto').value = '';
        document.getElementById('precio-producto').value = '';
        document.getElementById('categoria-producto').value = '';
        document.getElementById('medida-producto').value = '';
        
        // Opcional: Dar foco al primer campo
        document.getElementById('nombre-producto').focus();
    });
});

// FUNCIÓN PARA GUARDAR PRODUCTO
document.getElementById('btnguardar').addEventListener('click', async function() {
    const btn = this;
    const originalText = btn.innerHTML;
    
    try {
        btn.disabled = true;
        btn.innerHTML = 'Guardando...';

        const producto = {
            nombre: document.getElementById('nombre-producto').value.trim(),
            marca: document.getElementById('marca-producto').value.trim(),
            medida: document.getElementById('medida-producto').value,
            precio: parseFloat(document.getElementById('precio-producto').value),
            categoria: document.getElementById('categoria-producto').value
        };

        // Validación mejorada
        if (!producto.nombre) throw new Error('El nombre del producto es requerido');
        if (!producto.medida) throw new Error('Debes seleccionar una unidad de medida');
        if (!producto.categoria) throw new Error('Debes seleccionar una categoría');
        if (isNaN(producto.precio) || producto.precio <= 0) {
            throw new Error('El precio debe ser un número mayor a cero');
        }

        const response = await fetch('../api/guardarproducto.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(producto)
        });

        const text = await response.text();
        let data;
        
        try {
            data = text ? JSON.parse(text) : {};
        } catch (e) {
            console.error('Respuesta no JSON:', text);
            throw new Error('Error en el servidor: respuesta inválida');
        }

        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Error al guardar el producto');
        }

        alert('✅ ' + data.message);
        // Limpiar formulario después de guardar
        document.getElementById('nombre-producto').value = '';
        document.getElementById('marca-producto').value = '';
        document.getElementById('precio-producto').value = '';
        document.getElementById('categoria-producto').value = '';
        document.getElementById('medida-producto').value = '';
        
    } catch (error) {
        console.error('Error:', error);
        alert('❌ ' + error.message);
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
});