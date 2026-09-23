let comprasCargadas = [];


// ======================================================
// FORMATEAR DINERO
// ======================================================

function formatearDinero(valor) {
    return "$" + Number(valor || 0).toLocaleString("es-CO");
}


// ======================================================
// CARGAR HISTORIAL DE COMPRAS
// ======================================================

async function cargarHistorialCompras() {

    const tabla = document.getElementById("tablaCompras");

    if (!tabla) {
        return;
    }


    const idCliente = sessionStorage.getItem("idUsuario");
    const tipoUsuario = sessionStorage.getItem("tipoUsuario");


    if (!idCliente) {

        tabla.innerHTML = `
            <tr>
                <td colspan="5">
                    No se pudo identificar al usuario.
                </td>
            </tr>
        `;

        return;
    }


    if (tipoUsuario !== "Cliente") {

        tabla.innerHTML = `
            <tr>
                <td colspan="5">
                    Esta opcion solo esta disponible para clientes.
                </td>
            </tr>
        `;

        return;
    }


    tabla.innerHTML = `
        <tr>
            <td colspan="5">
                Cargando historial de compras...
            </td>
        </tr>
    `;


    try {

        const url =
            "../api/ventas/historialcliente.php?id_cliente=" +
            encodeURIComponent(idCliente);


        const response = await fetch(url);

        const texto = await response.text();

        const data = JSON.parse(texto);


        if (!response.ok || !data.success) {

            throw new Error(
                data.error || "Error consultando compras"
            );
        }


        comprasCargadas = data.compras || [];


        mostrarCompras(comprasCargadas);


    } catch (error) {

        console.error(error);


        tabla.innerHTML = `
            <tr>
                <td colspan="5">
                    Error al cargar el historial de compras.
                </td>
            </tr>
        `;

    }

}


// ======================================================
// MOSTRAR COMPRAS
// ======================================================

function mostrarCompras(compras) {

    const tabla = document.getElementById("tablaCompras");

    if (!tabla) {
        return;
    }


    tabla.innerHTML = "";


    if (!compras || compras.length === 0) {

        tabla.innerHTML = `
            <tr>
                <td colspan="5">
                    No tienes compras registradas.
                </td>
            </tr>
        `;

        return;
    }


    compras.forEach((compra) => {

        const fila = document.createElement("tr");


        const productos =
            compra.Productos &&
            compra.Productos.trim() !== ""
                ? compra.Productos
                : "Ver detalle";


        const total =
            formatearDinero(compra.Total_Venta);


        fila.innerHTML = `
            <td>
                ${compra.Fecha || ""}
            </td>

            <td>
                ${productos}
            </td>

            <td>
                ${total}
            </td>

            <td>
                ${compra.Estado || ""}
            </td>

            <td>
                <button
                    type="button"
                    class="btn-detalle"
                    data-id="${compra.Id_Venta}"
                >
                    Detalle
                </button>
            </td>
        `;


        tabla.appendChild(fila);

    });

}


// ======================================================
// FILTRAR COMPRAS
// ======================================================

function filtrarCompras() {

    const fechaInicio =
        document.getElementById("fechaInicioCompra")?.value || "";


    const fechaFin =
        document.getElementById("fechaFinCompra")?.value || "";


    if (
        fechaInicio &&
        fechaFin &&
        fechaInicio > fechaFin
    ) {

        alert(
            "La fecha inicial no puede ser mayor que la fecha final."
        );

        return;
    }


    const resultado =
        comprasCargadas.filter((compra) => {

            const fecha =
                compra.Fecha
                    ? compra.Fecha.substring(0, 10)
                    : "";


            const cumpleInicio =
                !fechaInicio ||
                fecha >= fechaInicio;


            const cumpleFin =
                !fechaFin ||
                fecha <= fechaFin;


            return cumpleInicio && cumpleFin;

        });


    mostrarCompras(resultado);

}


// ======================================================
// BOTON FILTRAR
// ======================================================

document.addEventListener("click", (e) => {

    if (e.target.closest("#btnFiltrarCompras")) {

        filtrarCompras();

    }

});


// ======================================================
// ABRIR DETALLE DE COMPRA
// ======================================================

async function abrirDetalleCompra(idVenta) {

    const modal =
        document.getElementById("modalDetalleCompra");


    const tabla =
        document.getElementById("tablaDetalleCompra");


    if (!modal || !tabla) {
        return;
    }


    // Mostrar datos iniciales
    document.getElementById("compraIdVenta").textContent =
        idVenta;

    document.getElementById("compraFecha").textContent =
        "-";

    document.getElementById("compraEstado").textContent =
        "-";

    document.getElementById("compraTendero").textContent =
        "-";

    document.getElementById("compraCantidadProductos").textContent =
        "0";

    document.getElementById("compraCantidadUnidades").textContent =
        "0";

    document.getElementById("compraTotal").textContent =
        "$0";


    tabla.innerHTML = `
        <tr>
            <td colspan="6">
                Cargando detalle...
            </td>
        </tr>
    `;


    if (!modal.open) {

        modal.showModal();

    }


    try {

        const url =
            "../api/ventas/detalleventa.php?id_venta=" +
            encodeURIComponent(idVenta);


        const response = await fetch(url);

        const texto = await response.text();

        const data = JSON.parse(texto);


        if (!response.ok || !data.success) {

            throw new Error(
                data.error ||
                "No fue posible consultar el detalle"
            );

        }


        // ==================================================
        // VALIDAR QUE LA COMPRA SEA DEL CLIENTE
        // ==================================================

        const idClienteActual =
            Number(
                sessionStorage.getItem("idUsuario")
            );


        const idClienteVenta =
            Number(data.venta.Id_Cliente);


        if (idClienteActual !== idClienteVenta) {

            throw new Error(
                "Esta compra no pertenece al usuario conectado."
            );

        }


        // ==================================================
        // MOSTRAR INFORMACION GENERAL
        // ==================================================

        document.getElementById("compraIdVenta").textContent =
            data.venta.Id_Venta;


        document.getElementById("compraFecha").textContent =
            data.venta.Fecha;


        document.getElementById("compraEstado").textContent =
            data.venta.Estado;


        document.getElementById("compraTendero").textContent =
            data.venta.Id_Tendero;


        document.getElementById("compraCantidadProductos").textContent =
            data.cantidad_productos || 0;


        document.getElementById("compraCantidadUnidades").textContent =
            data.cantidad_unidades || 0;


        document.getElementById("compraTotal").textContent =
            formatearDinero(
                data.venta.Total_Venta
            );


        // ==================================================
        // PRODUCTOS
        // ==================================================

        tabla.innerHTML = "";


        if (!data.detalles || data.detalles.length === 0) {

            tabla.innerHTML = `
                <tr>
                    <td colspan="6">
                        Esta compra no tiene productos registrados.
                    </td>
                </tr>
            `;

            return;
        }


        data.detalles.forEach((detalle) => {

            const fila = document.createElement("tr");


            fila.innerHTML = `
                <td>
                    ${detalle.Nombre || ""}
                </td>

                <td>
                    ${detalle.Marca || "N/A"}
                </td>

                <td>
                    ${detalle.Medida || ""}
                </td>

                <td>
                    ${detalle.Cantidad || 0}
                </td>

                <td>
                    ${formatearDinero(
                        detalle.Precio_Unitario
                    )}
                </td>

                <td>
                    ${formatearDinero(
                        detalle.Subtotal
                    )}
                </td>
            `;


            tabla.appendChild(fila);

        });


    } catch (error) {

        console.error(error);


        tabla.innerHTML = `
            <tr>
                <td colspan="6">
                    ${error.message}
                </td>
            </tr>
        `;

    }

}


// ======================================================
// BOTON DETALLE
// ======================================================

document.addEventListener("click", (e) => {

    const boton =
        e.target.closest(".btn-detalle");


    if (!boton) {
        return;
    }


    const idVenta = boton.dataset.id;


    if (idVenta) {

        abrirDetalleCompra(idVenta);

    }

});


// ======================================================
// CERRAR DETALLE
// ======================================================

document.addEventListener("click", (e) => {

    if (!e.target.closest("#btnCerrarDetalleCompra")) {
        return;
    }


    const modal =
        document.getElementById("modalDetalleCompra");


    if (modal && modal.open) {

        modal.close();

    }

});


// ======================================================
// INICIAR
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    cargarHistorialCompras
);