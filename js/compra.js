document.addEventListener('DOMContentLoaded', function() {
    // Datos de ejemplo (en un caso real estos vendrían de una API)
    const productos = [
        { id: 1, nombre: "Arroz Diana", marca: "Diana",  medida: "Libra", precio: 3500 },
        { id: 2, nombre: "Leche Entera", marca: "Alpina",  medida: "Litro", precio: 4200 },
        { id: 3, nombre: "Café", marca: "Juan Valdez",  medida: "Libra", precio: 12500 },
        { id: 4, nombre: "Aceite", marca: "Gourmet",  medida: "Botella 900ml", precio: 18000 },
        { id: 5, nombre: "Azúcar", marca: "Incauca",  medida: "Libra", precio: 2800 }
    ];

    const cuerpoTabla = document.getElementById('cuerpo-tabla');
    const btnBuscar = document.getElementById('btn-buscar');
    const filtroNombre = document.getElementById('filtro-nombre');

    // Función para cargar productos en la tabla
    function cargarProductos(productosMostrar) {
        cuerpoTabla.innerHTML = '';
        
        productosMostrar.forEach(producto => {
            const fila = document.createElement('tr');
            
            fila.innerHTML = `
                <td>${producto.id}</td>
                <td>${producto.nombre}</td>
                <td>${producto.marca}</td>
                <td>${producto.medida}</td>
                <td>$${producto.precio.toLocaleString()}</td>
                <td>
                    <button class="btn-accion btn-editar">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn-accion btn-eliminar">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </td>
            `;
            
            cuerpoTabla.appendChild(fila);
        });
    }

    // Función para filtrar productos
    function filtrarProductos() {
        const nombre = filtroNombre.value.toLowerCase();
        
        const productosFiltrados = productos.filter(producto => {
            const cumpleNombre = producto.nombre.toLowerCase().includes(nombre);
            
            return cumpleNombre
        });
        
        cargarProductos(productosFiltrados);
    }

    // Eventos
    btnBuscar.addEventListener('click', filtrarProductos);
    filtroNombre.addEventListener('keyup', filtrarProductos);

    // Cargar todos los productos al inicio
    cargarProductos(productos);
});

document.getElementById('btn-buscar').addEventListener('click', function() {
  const nameFilter = document.getElementById('filtro-nombre').value.trim().toUpperCase();
  const tbody = document.querySelector('.listado tbody');
  Array.from(tbody.rows).forEach(row => {
    const nameText = row.cells[1].textContent.toUpperCase();
    const matchesName = !nameFilter || nameText.includes(nameFilter);
    row.style.display = (matchesName) ? '' : 'none';
  });
});