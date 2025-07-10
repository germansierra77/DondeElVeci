import { enviarAjax } from "../js/tools.js";

document.addEventListener('DOMContentLoaded', function() {
    const cuerpoTabla = document.getElementById('cuerpo-tabla');
    const btnBuscar = document.getElementById('btn-buscar');
    const btnActualizar = document.getElementById('btn-actualizar');
    const filtroNombre = document.getElementById('filtro-nombre');
    const filtroCategoria = document.getElementById('filtro-categoria');

    async function cargarProductos() {
        try {
            // Mostrar estado de carga
            cuerpoTabla.innerHTML = `<tr><td colspan="7" class="cargando">Cargando productos...</td></tr>`;
            
            // URL absoluta - IMPORTANTE: Verifica que esta ruta sea correcta
            const url = '/dondeelveci/api/productos/consultarproductos.php';
            
            // Parámetros de búsqueda
            const params = {
                nombre: filtroNombre.value.trim(),
                categoria: filtroCategoria.value.trim()
            };

            console.log('Solicitando:', url, 'con parámetros:', params);

            const response = await fetch(`${url}?${new URLSearchParams(params)}`, {
                headers: {
                    'Accept': 'application/json'
                }
            });

            console.log('Respuesta recibida. Estado:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            console.log('Datos recibidos:', data);

            if (!data.success) {
                throw new Error(data.error || 'Error en los datos recibidos');
            }

            mostrarProductos(data.productos);
            
        } catch (error) {
            console.error('Error al cargar productos:', error);
            cuerpoTabla.innerHTML = `
                <tr>
                    <td colspan="7" class="error">
                        Error: ${error.message}
                        <br><small>Verifique la consola para más detalles</small>
                    </td>
                </tr>`;
        }
    }

    function mostrarProductos(productos) {
        cuerpoTabla.innerHTML = '';
        
        if (!productos || productos.length === 0) {
            cuerpoTabla.innerHTML = `<tr><td colspan="7">No se encontraron productos</td></tr>`;
            return;
        }

        productos.forEach(producto => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${producto.ID}</td>
                <td>${producto.NOMBRE}</td>
                <td>${producto.MARCA}</td>
                <td>${producto.CATEGORIA}</td>
                <td>${producto.MEDIDA}</td>
                <td>${producto.PRECIO}</td>
                <td>
                    <button class="btn-editar" data-id="${producto.ID}">Editar</button>
                    <button class="btn-eliminar" data-id="${producto.ID}">Eliminar</button>
                </td>
            `;
            cuerpoTabla.appendChild(fila);
        });
    }

    // Event listeners
    btnBuscar.addEventListener('click', cargarProductos);
    btnActualizar.addEventListener('click', cargarProductos);
    
    // Carga inicial
    cargarProductos();
});