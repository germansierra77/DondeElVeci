}document.getElementById('btnguardar').addEventListener('click', async function() {
    const btn = this;
    const originalText = btn.innerHTML;
    
    try {
        btn.disabled = true;
        btn.innerHTML = 'Guardando...';

        // Validar y preparar datos usando los IDs directos
        const producto = {
            nombre: document.getElementById('nombre-producto').value.trim(),
            marca: document.getElementById('marca-producto').value.trim(),
            medida: document.getElementById('medida-producto').value,
            precio: parseFloat(document.getElementById('precio-producto').value),
            categoria: document.getElementById('categoria-producto').value
        };

        // Resto del código permanece igual...
        const data = await enviarAjax({
            url: '../api/productos/guardarproducto.php',
            method: 'POST',
            param: producto,
            fresp: (response) => {
                console.log('Respuesta recibida:', response);
            }
        });

        alert('✅ ' + data.message);
        limpiarFormulario();
        
    } catch (error) {
        console.error('Error al guardar:', error);
        alert('❌ ' + error.message);
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
});

function limpiarFormulario() {
    document.getElementById('nombre-producto').value = '';
    document.getElementById('marca-producto').value = '';
    document.getElementById('medida-producto').value = '';
    document.getElementById('precio-producto').value = '';
    document.getElementById('categoria-producto').value = '';
}