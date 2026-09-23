// ======================================================
// IMPORTAR FUNCIONES
// ======================================================

import { validarLogin } from "./login.js";


// ======================================================
// FUNCIÓN GENERAL PARA REDIRECCIONAR
// ======================================================

function url(destino) {
    location.href = destino;
}


// ======================================================
// BOTONES GENÉRICOS
// ======================================================


// Botón código
document.addEventListener("click", (e) => {

    if (e.target.matches("#btncodigo")) {
        location.href = "validar";
    }

});


// Botón restablecer
document.addEventListener("click", (e) => {

    if (e.target.matches("#btnreestablecer")) {
        location.href = "reestablecer";
    }

});


// ======================================================
// BOTONES INTERFAZ INICIO DE SESIÓN
// ======================================================

document.addEventListener("click", (e) => {

    // Botón registrarse
    if (e.target.matches("#btnregistrarse")) {
        location.href = "creacionusuario";
    }


    // Botón recordar contraseña
    if (e.target.matches("#btnrecordar")) {
        location.href = "reestablecer";
    }


    // Botón volver al menú principal
    if (e.target.matches("#btnvolver")) {
        location.href = "menuprincipal";
    }


    // Botón volver al inicio de sesión
    if (e.target.matches("#btniniciosesion")) {
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
// BOTONES MENÚ PRINCIPAL DEL CLIENTE
// ======================================================

document.addEventListener("click", (e) => {

    if (e.target.matches("#btnmenucomprar")) {
        location.href = "compra";
    }

    if (e.target.matches("#btnmenumicuenta")) {
        location.href = "infocuenta";
    }

    if (e.target.matches("#btnmenuhistorial")) {
        location.href = "historialcompras";
    }

    if (e.target.matches("#btnmenurecargar")) {
        location.href = "recargarcuenta";
    }

});


// ======================================================
// BOTONES MENÚ DEL TENDERO
// ======================================================

document.addEventListener("click", (e) => {

    // Historial de ventas
    if (e.target.matches("#btnhistorialventas")) {
        location.href = "historialtendero";
    }


    // Información del tendero
    if (e.target.matches("#btninfotendero")) {
        location.href = "infotendero";
    }


    // Nuevo producto
    if (e.target.matches("#btnnuevoproducto")) {
        location.href = "nuevoproducto";
    }


    // Lista de productos
    if (e.target.matches("#btnlistaproductos")) {
        location.href = "listaproductos";
    }


    // Registrar nueva venta
    if (e.target.matches("#btnmovimiento")) {
        location.href = "nuevaventa";
    }

});


// ======================================================
// BOTONES GENÉRICOS DEL TENDERO
// ======================================================

document.addEventListener("click", (e) => {

    // Volver al menú del tendero
    if (e.target.matches("#btnvolvertendero")) {
        location.href = "menutendero";
    }


    // Volver al inicio de sesión
    if (e.target.matches("#btniniciosesion")) {
        location.href = "iniciosesion";
    }

});


// ======================================================
// ======================================================
// HISTORIAL DE VENTAS DEL TENDERO
// ======================================================
// ======================================================


// Aquí vamos a guardar las ventas que llegan desde PHP.
// Esto también nos permitirá realizar los filtros.
let ventasCargadas = [];


// ======================================================
// FUNCIÓN PARA CARGAR LAS VENTAS
// ======================================================

async function cargarHistorialVentas() {

    // Buscar la tabla del historial
    const tablaVentas = document.getElementById("tablaVentas");


    // Si la tabla NO existe, significa que estamos en otra
    // página del proyecto, por lo tanto no hacemos nada.
    if (!tablaVentas) {
        return;
    }


    try {

        // Mostrar mensaje mientras consulta
        tablaVentas.innerHTML = `
            <tr>
                <td colspan="4">
                    Cargando historial de ventas...
                </td>
            </tr>
        `;


        // ==================================================
        // CONSULTAR API
        // ==================================================

        const response = await fetch("../api/ventas/listarventas.php");


        // Verificar respuesta HTTP
        if (!response.ok) {

            throw new Error(
                "Error HTTP: " + response.status
            );

        }


        // Convertir respuesta de PHP a JSON
        const data = await response.json();


        // Mostrar información en consola para pruebas
        console.log("Respuesta historial:", data);


        // ==================================================
        // VERIFICAR RESPUESTA DE LA API
        // ==================================================

        if (!data.success) {

            throw new Error(
                data.error || "No fue posible obtener las ventas"
            );

        }


        // Guardamos las ventas
        ventasCargadas = data.ventas || [];


        // ==================================================
        // MOSTRAR LAS VENTAS
        // ==================================================

        mostrarVentas(ventasCargadas);


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
// FUNCIÓN PARA MOSTRAR LAS VENTAS EN LA TABLA
// ======================================================

function mostrarVentas(ventas) {

    const tablaVentas = document.getElementById("tablaVentas");


    if (!tablaVentas) {
        return;
    }


    // Limpiar tabla
    tablaVentas.innerHTML = "";


    // ==================================================
    // SI NO HAY VENTAS
    // ==================================================

    if (!ventas || ventas.length === 0) {

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
    // RECORRER VENTAS
    // ==================================================

    ventas.forEach((venta) => {

        const fila = document.createElement("tr");


        fila.innerHTML = `

            <td>
                ${venta.Fecha ?? ""}
            </td>

            <td>
                ${venta.Id_Cliente ?? ""}
            </td>

            <td>
                ${venta.Estado ?? ""}
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


        tablaVentas.appendChild(fila);

    });

}


// ======================================================
// FILTRAR HISTORIAL DE VENTAS
// ======================================================

function filtrarHistorialVentas() {

    const fechaInicio =
        document.getElementById("fechaInicio")?.value || "";


    const fechaFin =
        document.getElementById("fechaFin")?.value || "";


    const buscarUsuario =
        document.getElementById("buscarUsuario")?.value
            .trim()
            .toLowerCase() || "";


    // ==================================================
    // FILTRAR
    // ==================================================

    const ventasFiltradas = ventasCargadas.filter((venta) => {


        // Obtener solamente YYYY-MM-DD
        // La fecha de MySQL normalmente llega como:
        // 2026-09-22 15:30:00

        const fechaVenta =
            venta.Fecha
                ? venta.Fecha.substring(0, 10)
                : "";


        // ID cliente convertido a texto
        const idCliente =
            String(venta.Id_Cliente ?? "")
                .toLowerCase();


        // ==================================================
        // FILTRO FECHA INICIO
        // ==================================================

        const cumpleFechaInicio =
            !fechaInicio ||
            fechaVenta >= fechaInicio;


        // ==================================================
        // FILTRO FECHA FIN
        // ==================================================

        const cumpleFechaFin =
            !fechaFin ||
            fechaVenta <= fechaFin;


        // ==================================================
        // FILTRO USUARIO
        // ==================================================

        const cumpleUsuario =
            !buscarUsuario ||
            idCliente.includes(buscarUsuario);


        return (
            cumpleFechaInicio &&
            cumpleFechaFin &&
            cumpleUsuario
        );

    });


    // Mostrar resultados
    mostrarVentas(ventasFiltradas);

}


// ======================================================
// BOTÓN FILTRAR
// ======================================================

document.addEventListener("click", (e) => {

    // closest permite que funcione incluso si se hace
    // clic directamente sobre el SVG del botón.
    const botonFiltrar = e.target.closest("#btnfiltrar");


    if (botonFiltrar) {

        filtrarHistorialVentas();

    }

});


// ======================================================
// BOTÓN DETALLE DE LA VENTA
// ======================================================

document.addEventListener("click", (e) => {

    const botonDetalle = e.target.closest(".btn-detalle");


    if (!botonDetalle) {
        return;
    }


    // Obtener ID de la venta
    const idVenta =
        botonDetalle.dataset.id;


    console.log(
        "ID venta seleccionada:",
        idVenta
    );


    /*
        Más adelante conectaremos este botón
        con la API de detalle de venta.

        Por el momento mostramos el ID.
    */

    alert(
        "Venta seleccionada: " + idVenta
    );

});


// ======================================================
// CARGAR HISTORIAL AUTOMÁTICAMENTE
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        cargarHistorialVentas();

    }
);

