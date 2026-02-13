// Variables globales
let productosVenta = [];
let totalVenta = 0;
let clienteSeleccionado = null;

document.addEventListener('DOMContentLoaded', function() {
    cargarProductos();
    
    // Event listeners para productos
    document.getElementById('btn-buscar-producto').addEventListener('click', buscarProductos);
    document.getElementById('buscador').addEventListener('keyup', function(e) {
        if (e.key === 'Enter') buscarProductos();
    });
    
    // Event listeners para cliente
    document.getElementById('btn-buscar-cliente').addEventListener('click', buscarCliente);
    document.getElementById('buscador-cliente').addEventListener('keyup', function(e) {
        if (e.key === 'Enter') buscarCliente();
    });
    document.getElementById('btn-cambiar-cliente').addEventListener('click', cambiarCliente);
    
    // Event listeners para venta
    document.getElementById('btn-cancelar-venta').addEventListener('click', cancelarVenta);
    document.getElementById('btn-confirmar-venta').addEventListener('click', confirmarVenta);
});

// ===== FUNCIONES DE PRODUCTOS =====
async function cargarProductos() {
    const listaProductos = document.getElementById('lista-productos');
    
    try {
        listaProductos.innerHTML = '<div class="cargando-productos">Cargando productos...</div>';
        
        const response = await fetch('/dondeelveci/api/productos/consultarproductos.php', {
            headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) throw new Error(`Error ${response.status}`);
        const data = await response.json();
        if (!data.success) throw new Error(data.error || 'Error al cargar productos');
        
        mostrarProductos(data.productos);
        
    } catch (error) {
        listaProductos.innerHTML = `<div class="error-carga">Error: ${error.message}</div>`;
    }
}

async function buscarProductos() {
    const termino = document.getElementById('buscador').value.trim();
    const listaProductos = document.getElementById('lista-productos');
    
    try {
        listaProductos.innerHTML = '<div class="cargando-productos">Buscando...</div>';
        
        const response = await fetch(`/dondeelveci/api/productos/consultarproductos.php?nombre=${encodeURIComponent(termino)}`);
        const data = await response.json();
        
        mostrarProductos(data.productos);
        
    } catch (error) {
        listaProductos.innerHTML = `<div class="error-carga">Error: ${error.message}</div>`;
    }
}

function mostrarProductos(productos) {
    const listaProductos = document.getElementById('lista-productos');
    
    if (!productos || productos.length === 0) {
        listaProductos.innerHTML = '<div class="sin-resultados">No se encontraron productos</div>';
        return;
    }

    let html = '';
    productos.forEach(producto => {
        const precioLimpio = producto.PRECIO.replace('$', '').replace(/\./g, '');
        const stock = producto.STOCK || 0;
        
        html += `
            <div class="producto-item" data-id="${producto.ID}" data-nombre="${producto.NOMBRE}" 
                 data-precio="${precioLimpio}" data-stock="${stock}">
                <div class="producto-info">
                    <span class="producto-nombre">${producto.NOMBRE}</span>
                    <span class="producto-marca">${producto.MARCA || 'Sin marca'}</span>
                    <span class="producto-precio">${producto.PRECIO}</span>
                    <span class="producto-stock">Stock: ${stock}</span>
                </div>
                <div class="producto-cantidad">
                    <button class="btn-cantidad menos" onclick="disminuirCantidad(this)">-</button>
                    <input type="number" class="input-cantidad" value="0" min="0" max="${stock}" 
                           onchange="actualizarCantidad(this)">
                    <button class="btn-cantidad mas" onclick="aumentarCantidad(this)">+</button>
                </div>
            </div>
        `;
    });
    
    listaProductos.innerHTML = html;
}

// ===== FUNCIONES DE CANTIDAD =====
window.aumentarCantidad = function(btn) {
    const input = btn.parentElement.querySelector('.input-cantidad');
    const max = parseInt(input.getAttribute('max')) || 999;
    const nuevoValor = parseInt(input.value) + 1;
    
    if (nuevoValor <= max) {
        input.value = nuevoValor;
        actualizarCantidad(input);
    } else {
        alert('No hay suficiente stock disponible');
    }
};

window.disminuirCantidad = function(btn) {
    const input = btn.parentElement.querySelector('.input-cantidad');
    const nuevoValor = parseInt(input.value) - 1;
    if (nuevoValor >= 0) {
        input.value = nuevoValor;
        actualizarCantidad(input);
    }
};

window.actualizarCantidad = function(input) {
    const productoItem = input.closest('.producto-item');
    const productoId = productoItem.dataset.id;
    const productoNombre = productoItem.dataset.nombre;
    const precio = parseInt(productoItem.dataset.precio);
    const cantidad = parseInt(input.value) || 0;
    const stock = parseInt(productoItem.dataset.stock) || 0;
    
    // Validar stock
    if (cantidad > stock) {
        alert(`Solo hay ${stock} unidades disponibles de ${productoNombre}`);
        input.value = stock;
        return;
    }
    
    const index = productosVenta.findIndex(p => p.id === productoId);
    
    if (cantidad > 0) {
        if (index >= 0) {
            productosVenta[index].cantidad = cantidad;
            productosVenta[index].subtotal = precio * cantidad;
        } else {
            productosVenta.push({
                id: productoId,
                nombre: productoNombre,
                precio: precio,
                cantidad: cantidad,
                subtotal: precio * cantidad
            });
        }
        productoItem.classList.add('producto-seleccionado');
    } else {
        if (index >= 0) {
            productosVenta.splice(index, 1);
        }
        productoItem.classList.remove('producto-seleccionado');
    }
    
    calcularTotal();
};

function calcularTotal() {
    totalVenta = productosVenta.reduce((sum, p) => sum + p.subtotal, 0);
    document.getElementById('total-valor').textContent = '$' + totalVenta.toLocaleString('es-CO');
}

// ===== FUNCIONES DE CLIENTE =====
async function buscarCliente() {
    const busqueda = document.getElementById('buscador-cliente').value.trim();
    
    if (!busqueda) {
        mostrarErrorCliente('Ingrese un ID o correo para buscar');
        return;
    }

    try {
        // Determinar si la búsqueda es por ID (solo números) o por correo
        const esId = /^\d+$/.test(busqueda);
        const url = esId 
            ? `/dondeelveci/api/usuarios/buscarUsuario.php?id=${busqueda}`
            : `/dondeelveci/api/usuarios/buscarUsuario.php?correo=${encodeURIComponent(busqueda)}`;

        const response = await fetch(url);
        const data = await response.json();
        
        if (data.code === 200 && data.data) {
            seleccionarCliente(data.data);
        } else if (data.code === 404) {
            mostrarErrorCliente('Cliente no encontrado');
        } else {
            mostrarErrorCliente('Error al buscar cliente: ' + (data.msg || 'Desconocido'));
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarErrorCliente('Error de conexión al buscar cliente');
    }
}

function seleccionarCliente(cliente) {
    clienteSeleccionado = cliente;
    
    document.getElementById('cliente-nombre').textContent = `${cliente.Nombres} ${cliente.Apellidos}`;
    document.getElementById('cliente-documento').textContent = `ID: ${cliente.Id} | Cel: ${cliente.Celular || 'N/A'}`;
    
    document.querySelector('.cliente-busqueda').style.display = 'none';
    document.getElementById('cliente-seleccionado').style.display = 'flex';
    document.getElementById('cliente-error').style.display = 'none';
}

function cambiarCliente() {
    clienteSeleccionado = null;
    
    document.querySelector('.cliente-busqueda').style.display = 'flex';
    document.getElementById('cliente-seleccionado').style.display = 'none';
    document.getElementById('buscador-cliente').value = '';
    document.getElementById('buscador-cliente').focus();
}

function mostrarErrorCliente(mensaje) {
    const errorDiv = document.getElementById('cliente-error');
    errorDiv.textContent = mensaje;
    errorDiv.style.display = 'block';
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 3000);
}

// ===== FUNCIONES DE VENTA =====
function cancelarVenta() {
    if (productosVenta.length > 0 && confirm('¿Cancelar la venta?')) {
        document.querySelectorAll('.input-cantidad').forEach(input => input.value = 0);
        document.querySelectorAll('.producto-item').forEach(item => item.classList.remove('producto-seleccionado'));
        productosVenta = [];
        calcularTotal();
    }
}

async function confirmarVenta() {
    if (productosVenta.length === 0) {
        alert('No hay productos seleccionados');
        return;
    }

    if (!clienteSeleccionado) {
        alert('Debe seleccionar un cliente para la venta');
        document.getElementById('buscador-cliente').focus();
        return;
    }

    if (!confirm(`¿Confirmar venta para ${clienteSeleccionado.Nombres} ${clienteSeleccionado.Apellidos} por $${totalVenta.toLocaleString('es-CO')}?`)) {
        return;
    }

    try {
        const btnConfirmar = document.getElementById('btn-confirmar-venta');
        btnConfirmar.disabled = true;
        btnConfirmar.textContent = 'PROCESANDO...';

        const response = await fetch('/dondeelveci/api/ventas/registrarventas.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id_cliente: clienteSeleccionado.Id,
                total: totalVenta,
                productos: productosVenta.map(p => ({
                    id: p.id,
                    nombre: p.nombre,
                    cantidad: p.cantidad,
                    precio_unitario: p.precio,
                    subtotal: p.subtotal
                }))
            })
        });

        const data = await response.json();

        if (data.success) {
            alert(`¡Venta registrada exitosamente para ${clienteSeleccionado.Nombres}!`);
            cancelarVenta();
            cambiarCliente();
        } else {
            throw new Error(data.error || 'Error al registrar venta');
        }

    } catch (error) {
        alert('Error: ' + error.message);
    } finally {
        const btnConfirmar = document.getElementById('btn-confirmar-venta');
        btnConfirmar.disabled = false;
        btnConfirmar.textContent = 'CONFIRMAR VENTA';
    }
}