//FUNCION QUE SIRVE PARA QUE CUANDO SE OPRIMA EL BOTON LIMPIAR ELIMINE DATOS INGRESADOS
document.addEventListener('DOMContentLoaded', function() {
    // Obtener el botón limpiar
    const btnLimpiar = document.getElementById('btnlimpiar');
    
    // Agregar evento click al botón
    btnLimpiar.addEventListener('click', function() {
        // Limpiar campos de texto
        document.getElementById('nombre-producto').value = '';
        document.getElementById('marca-producto').value = '';
        document.getElementById('precio-producto').value = '';
        document.getElementById('categoria-producto').value = '';
        
        // Resetear el select a la opción por defecto
        document.getElementById('medida-producto').selectedIndex = 0;
        
        // Opcional: Dar foco al primer campo
        document.getElementById('nombre-producto').focus();
    });
});