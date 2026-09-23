// ======================================================
// MAIN.JS
// FUNCIONES GENERALES DEL PROYECTO
// ======================================================


// ======================================================
// IMPORTAR LOGIN
// ======================================================

import { validarLogin } from "./login.js";


// ======================================================
// FUNCION GENERAL PARA REDIRECCIONAR
// ======================================================

function url(destino) {
    location.href = destino;
}


// ======================================================
// BOTONES GENERICOS
// ======================================================


// BOTON CODIGO
document.addEventListener("click", (e) => {

    if (e.target.closest("#btncodigo")) {
        location.href = "validar";
    }

});


// BOTON RESTABLECER
document.addEventListener("click", (e) => {

    if (e.target.closest("#btnreestablecer")) {
        location.href = "reestablecer";
    }

});


// ======================================================
// BOTONES INICIO DE SESION
// ======================================================

document.addEventListener("click", (e) => {

    // REGISTRARSE
    if (e.target.closest("#btnregistrarse")) {
        location.href = "creacionusuario";
    }


    // RECORDAR CONTRASEÑA
    if (e.target.closest("#btnrecordar")) {
        location.href = "reestablecer";
    }


    // VOLVER AL MENU PRINCIPAL
    if (e.target.closest("#btnvolver")) {
        location.href = "menuprincipal";
    }


    // VOLVER AL INICIO DE SESION
    if (e.target.closest("#btniniciosesion")) {
        location.href = "iniciosesion";
    }

});


// ======================================================
// FORMULARIO LOGIN
// ======================================================

document.addEventListener("submit", (e) => {

    if (e.target.matches("#f_login")) {

        e.preventDefault();

        validarLogin();
    }

});


// ======================================================
// BOTONES MENU PRINCIPAL CLIENTE
// ======================================================

document.addEventListener("click", (e) => {

    // COMPRAR
    if (e.target.closest("#btnmenucomprar")) {
        location.href = "compra";
    }


    // MI CUENTA
    if (e.target.closest("#btnmenumicuenta")) {
        location.href = "infocuenta";
    }


    // HISTORIAL DE COMPRAS
    if (e.target.closest("#btnmenuhistorial")) {
        location.href = "historialcompras";
    }


    // RECARGAR CUENTA
    if (e.target.closest("#btnmenurecargar")) {
        location.href = "recargarcuenta";
    }

});


// ======================================================
// BOTONES MENU TENDERO
// ======================================================

document.addEventListener("click", (e) => {

    // HISTORIAL DE VENTAS
    if (e.target.closest("#btnhistorialventas")) {
        location.href = "historialtendero";
    }


    // INFORMACION DEL TENDERO
    if (e.target.closest("#btninfotendero")) {
        location.href = "infotendero";
    }


    // NUEVO PRODUCTO
    if (e.target.closest("#btnnuevoproducto")) {
        location.href = "nuevoproducto";
    }


    // LISTA DE PRODUCTOS
    if (e.target.closest("#btnlistaproductos")) {
        location.href = "listaproductos";
    }


    // NUEVA VENTA
    if (e.target.closest("#btnmovimiento")) {
        location.href = "nuevaventa";
    }


    // VOLVER AL MENU DEL TENDERO
    if (e.target.closest("#btnvolvertendero")) {
        location.href = "menutendero";
    }

});


// ======================================================
// ======================================================
// HISTORIAL DE VENTAS
// ======================================================
// ======================================================


// Aqui vamos a guardar todas las ventas obtenidas
// desde listarventas.php
let ventasCargadas = [];


// ======================================================
// CARGAR HISTORIAL DE VENTAS
// ======================================================

async function cargarHistorialVentas() {

    const tablaVentas =
        document.getElementById("tablaVentas");


    // Si no existe tablaVentas significa que estamos
    // en otra interfaz del proyecto
    if (!tablaVentas) {
        return;
    }


    try {

        // Mostrar mensaje de carga
        tablaVentas.innerHTML = `
            <tr>
                <td colspan="4">
                    Cargando historial de ventas...
                </td>
            </tr>
        `;


        // ==================================================
        // CONSULTAR API LISTAR VENTAS
        // ==================================================

        const response =
            await fetch(
                "../api/ventas/listarventas.php"
            );


        // Leemos primero como texto para detectar
        // posibles errores PHP
        const texto =
            await response.text();


        console.log(
            "Respuesta listarventas.php:",
            texto
        );


        // ==================================================
        // CONVERTIR A JSON
        // ==================================================

        let data;


        try {

            data = JSON.parse(texto);

        } catch (error) {

            throw new Error(
                "listarventas.php no devolvio JSON valido"
            );

        }


        // ==================================================
        // VALIDAR RESPUESTA
        // ==================================================

        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.error ||
                "No fue posible cargar el historial"
            );

        }


        // Guardar ventas
        ventasCargadas =
            data.ventas || [];


        console.log(
            "Ventas cargadas:",
            ventasCargadas
        );


        // Mostrar ventas
        mostrarVentas(
            ventasCargadas
        );


    } catch (error) {

        console.error(
            "Error cargando historial:",
            error
        );


        tablaVentas.innerHTML = `
            <tr>
                <td colspan="4">
                    Error al cargar el historial de ventas
                </td>
            </tr>
        `;

    }

}


// ======================================================
// MOSTRAR VENTAS EN LA TABLA
// ======================================================

function mostrarVentas(ventas) {

    const tablaVentas =
        document.getElementById("tablaVentas");


    if (!tablaVentas) {
        return;
    }


    // Limpiar tabla
    tablaVentas.innerHTML = "";


    // ==================================================
    // SI NO HAY VENTAS
    // ==================================================

    if (
        !ventas ||
        ventas.length === 0
    ) {

        tablaVentas.innerHTML = `
            <tr>
                <td colspan="4">
                    No hay ventas registradas
                </td>
            </tr>
        `;

        return;
    }


    // ==================================================
    // CREAR FILAS
    // ==================================================

    ventas.forEach((venta) => {

        const fila =
            document.createElement("tr");


        fila.innerHTML = `
            <td>
                ${venta.Fecha || ""}
            </td>

            <td>
                ${venta.Id_Cliente || ""}
            </td>

            <td>
                ${venta.Estado || ""}
            </td>

            <td>
                <button
                    type="button"
                    class="btn-detalle"
                    data-id="${venta.Id_Venta}"
                >
                    <i class="fas fa-search"></i>
                    Detalle
                </button>
            </td>
        `;


        tablaVentas.appendChild(
            fila
        );

    });

}


// ======================================================
// FILTRAR HISTORIAL
// ======================================================

function filtrarHistorialVentas() {

    const fechaInicio =
        document.getElementById(
            "fechaInicio"
        )?.value || "";


    const fechaFin =
        document.getElementById(
            "fechaFin"
        )?.value || "";


    const usuario =
        document.getElementById(
            "buscarUsuario"
        )?.value.trim() || "";


    const ventasFiltradas =
        ventasCargadas.filter(
            (venta) => {


                // ==========================================
                // FECHA DE LA VENTA
                // ==========================================

                const fechaVenta =
                    venta.Fecha
                        ? venta.Fecha.substring(0, 10)
                        : "";


                // ==========================================
                // ID DEL CLIENTE
                // ==========================================

                const idCliente =
                    String(
                        venta.Id_Cliente || ""
                    );


                // ==========================================
                // VALIDAR FECHA INICIO
                // ==========================================

                const cumpleInicio =
                    !fechaInicio ||
                    fechaVenta >= fechaInicio;


                // ==========================================
                // VALIDAR FECHA FIN
                // ==========================================

                const cumpleFin =
                    !fechaFin ||
                    fechaVenta <= fechaFin;


                // ==========================================
                // VALIDAR CLIENTE
                // ==========================================

                const cumpleUsuario =
                    !usuario ||
                    idCliente.includes(
                        usuario
                    );


                return (
                    cumpleInicio &&
                    cumpleFin &&
                    cumpleUsuario
                );

            }
        );


    // Mostrar resultados
    mostrarVentas(
        ventasFiltradas
    );

}


// ======================================================
// BOTON FILTRAR
// ======================================================

document.addEventListener("click", (e) => {

    const botonFiltrar =
        e.target.closest("#btnfiltrar");


    if (!botonFiltrar) {
        return;
    }


    filtrarHistorialVentas();

});


// ======================================================
// FORMATEAR DINERO
// ======================================================

function formatearDinero(valor) {

    const numero =
        Number(valor || 0);


    return "$" +
        numero.toLocaleString(
            "es-CO"
        );

}


// ======================================================
// ======================================================
// DETALLE DE VENTA
// ======================================================
// ======================================================


// ======================================================
// ABRIR DETALLE
// ======================================================

async function abrirDetalleVenta(idVenta) {

    const modal =
        document.getElementById(
            "modalDetalleVenta"
        );


    const tabla =
        document.getElementById(
            "tablaDetalleVenta"
        );


    // Si la interfaz no tiene el modal,
    // no hacemos nada
    if (!modal || !tabla) {

        console.error(
            "No se encontro el modal de detalle"
        );

        return;
    }


    // ==================================================
    // LIMPIAR INFORMACION ANTERIOR
    // ==================================================

    const detalleIdVenta =
        document.getElementById(
            "detalleIdVenta"
        );


    const detalleCliente =
        document.getElementById(
            "detalleCliente"
        );


    const detalleTendero =
        document.getElementById(
            "detalleTendero"
        );


    const detalleFecha =
        document.getElementById(
            "detalleFecha"
        );


    const detalleFechaRegistro =
        document.getElementById(
            "detalleFechaRegistro"
        );


    const detalleEstado =
        document.getElementById(
            "detalleEstado"
        );


    const detalleTotal =
        document.getElementById(
            "detalleTotal"
        );


    const detalleCantidadProductos =
        document.getElementById(
            "detalleCantidadProductos"
        );


    const detalleCantidadUnidades =
        document.getElementById(
            "detalleCantidadUnidades"
        );


    // Valores iniciales
    if (detalleIdVenta) {
        detalleIdVenta.textContent =
            idVenta;
    }


    if (detalleCliente) {
        detalleCliente.textContent =
            "-";
    }


    if (detalleTendero) {
        detalleTendero.textContent =
            "-";
    }


    if (detalleFecha) {
        detalleFecha.textContent =
            "-";
    }


    if (detalleFechaRegistro) {
        detalleFechaRegistro.textContent =
            "-";
    }


    if (detalleEstado) {
        detalleEstado.textContent =
            "-";
    }


    if (detalleTotal) {
        detalleTotal.textContent =
            "$0";
    }


    if (detalleCantidadProductos) {
        detalleCantidadProductos.textContent =
            "0";
    }


    if (detalleCantidadUnidades) {
        detalleCantidadUnidades.textContent =
            "0";
    }


    // Mensaje mientras carga
    tabla.innerHTML = `
        <tr>
            <td colspan="6">
                Cargando detalle de la venta...
            </td>
        </tr>
    `;


    // ==================================================
    // ABRIR MODAL
    // ==================================================

    if (!modal.open) {

        modal.showModal();

    }


    try {

        // ==================================================
        // CONSULTAR DETALLEVENTA.PHP
        // ==================================================

        const urlDetalle =
            "../api/ventas/detalleventa.php?id_venta=" +
            encodeURIComponent(idVenta);


        console.log(
            "Consultando detalle:",
            urlDetalle
        );


        const response =
            await fetch(
                urlDetalle
            );


        // Leer primero como texto
        const texto =
            await response.text();


        console.log(
            "Respuesta detalleventa.php:",
            texto
        );


        // ==================================================
        // CONVERTIR A JSON
        // ==================================================

        let data;


        try {

            data =
                JSON.parse(texto);

        } catch (error) {

            throw new Error(
                "detalleventa.php no devolvio JSON valido"
            );

        }


        // ==================================================
        // VALIDAR RESPUESTA
        // ==================================================

        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.error ||
                "No fue posible consultar el detalle de la venta"
            );

        }


        console.log(
            "Detalle de venta:",
            data
        );


        // ==================================================
        // MOSTRAR DATOS GENERALES
        // ==================================================

        if (detalleIdVenta) {

            detalleIdVenta.textContent =
                data.venta.Id_Venta;

        }


        if (detalleCliente) {

            detalleCliente.textContent =
                data.venta.Id_Cliente;

        }


        if (detalleTendero) {

            detalleTendero.textContent =
                data.venta.Id_Tendero;

        }


        if (detalleFecha) {

            detalleFecha.textContent =
                data.venta.Fecha;

        }


        if (detalleFechaRegistro) {

            detalleFechaRegistro.textContent =
                data.venta.Fecha_Registro || "-";

        }


        if (detalleEstado) {

            detalleEstado.textContent =
                data.venta.Estado;

        }


        if (detalleTotal) {

            detalleTotal.textContent =
                formatearDinero(
                    data.venta.Total_Venta
                );

        }


        if (detalleCantidadProductos) {

            detalleCantidadProductos.textContent =
                data.cantidad_productos || 0;

        }


        if (detalleCantidadUnidades) {

            detalleCantidadUnidades.textContent =
                data.cantidad_unidades || 0;

        }


        // ==================================================
        // LIMPIAR TABLA DE DETALLES
        // ==================================================

        tabla.innerHTML = "";


        // ==================================================
        // VALIDAR SI EXISTEN PRODUCTOS
        // ==================================================

        if (
            !data.detalles ||
            data.detalles.length === 0
        ) {

            tabla.innerHTML = `
                <tr>
                    <td colspan="6">
                        Esta venta no tiene productos registrados.
                    </td>
                </tr>
            `;

            return;
        }


        // ==================================================
        // MOSTRAR PRODUCTOS
        // ==================================================

        data.detalles.forEach(
            (detalle) => {


                const fila =
                    document.createElement(
                        "tr"
                    );


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


                tabla.appendChild(
                    fila
                );

            }
        );


    } catch (error) {

        // ==================================================
        // MOSTRAR ERROR
        // ==================================================

        console.error(
            "Error consultando detalle de venta:",
            error
        );


        tabla.innerHTML = `
            <tr>
                <td colspan="6">
                    Error al cargar el detalle de la venta.
                </td>
            </tr>
        `;

    }

}


// ======================================================
// BOTON DETALLE DE VENTA
// ======================================================

document.addEventListener("click", (e) => {

    const botonDetalle =
        e.target.closest(
            ".btn-detalle"
        );


    if (!botonDetalle) {
        return;
    }


    const idVenta =
        botonDetalle.dataset.id;


    if (!idVenta) {

        alert(
            "No fue posible identificar la venta."
        );

        return;
    }


    console.log(
        "Abriendo detalle venta:",
        idVenta
    );


    abrirDetalleVenta(
        idVenta
    );

});


// ======================================================
// CERRAR DETALLE
// ======================================================

document.addEventListener("click", (e) => {

    const botonCerrar =
        e.target.closest(
            "#btnCerrarDetalle"
        );


    if (!botonCerrar) {
        return;
    }


    const modal =
        document.getElementById(
            "modalDetalleVenta"
        );


    if (
        modal &&
        modal.open
    ) {

        modal.close();

    }

});


// ======================================================
// CERRAR MODAL AL HACER CLIC FUERA DEL CONTENIDO
// ======================================================

document.addEventListener("click", (e) => {

    const modal =
        document.getElementById(
            "modalDetalleVenta"
        );


    if (!modal) {
        return;
    }


    // Solo evaluar si el modal esta abierto
    if (!modal.open) {
        return;
    }


    // Si el clic fue directamente sobre
    // el fondo del dialog
    if (e.target === modal) {

        const rect =
            modal.getBoundingClientRect();


        const estaDentro =
            (
                e.clientX >= rect.left &&
                e.clientX <= rect.right &&
                e.clientY >= rect.top &&
                e.clientY <= rect.bottom
            );


        if (!estaDentro) {

            modal.close();

        }

    }

});


// ======================================================
// INICIALIZACION DEL PROYECTO
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {


        // ==================================================
        // DETECTAR HISTORIAL DE VENTAS
        // ==================================================

        const tablaVentas =
            document.getElementById(
                "tablaVentas"
            );


        if (tablaVentas) {

            console.log(
                "Historial de ventas detectado"
            );


            cargarHistorialVentas();

        }

    }
);

