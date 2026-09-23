// ======================================================
// COMPRA.JS
// CONSULTAR PRODUCTOS Y REGISTRAR COMPRA
// ======================================================

let productos = [];
let procesandoCompra = false;


// ======================================================
// CARGAR PRODUCTOS DESDE LA BASE DE DATOS
// ======================================================

async function cargarProductos(nombre = "") {

    const cuerpoTabla = document.getElementById("tabla-productos");

    if (!cuerpoTabla) {
        return;
    }

    try {

        cuerpoTabla.innerHTML = `
            <tr>
                <td colspan="6">
                    Cargando productos...
                </td>
            </tr>
        `;

        let url = "../api/productos/consultarproductos.php";

        if (nombre.trim() !== "") {
            url += "?nombre=" + encodeURIComponent(nombre.trim());
        }

        console.log("Consultando productos en:", url);

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(
                "Error HTTP al consultar productos: " + response.status
            );
        }

        const texto = await response.text();

        console.log(
            "Respuesta de consultarproductos.php:",
            texto
        );

        let data;

        try {
            data = JSON.parse(texto);
        } catch (error) {
            throw new Error(
                "consultarproductos.php no devolvió JSON válido"
            );
        }

        if (!data.success) {
            throw new Error(
                data.error ||
                "No fue posible consultar los productos"
            );
        }

        productos = data.productos || [];

        console.log(
            "Productos encontrados:",
            productos
        );

        mostrarProductos(productos);

    } catch (error) {

        console.error(
            "Error cargando productos:",
            error
        );

        cuerpoTabla.innerHTML = `
            <tr>
                <td colspan="6">
                    Error al cargar los productos
                </td>
            </tr>
        `;
    }
}


// ======================================================
// MOSTRAR PRODUCTOS EN LA TABLA
// ======================================================

function mostrarProductos(productosMostrar) {

    const cuerpoTabla =
        document.getElementById("tabla-productos");

    if (!cuerpoTabla) {
        return;
    }

    cuerpoTabla.innerHTML = "";

    if (
        !productosMostrar ||
        productosMostrar.length === 0
    ) {

        cuerpoTabla.innerHTML = `
            <tr>
                <td colspan="6">
                    No se encontraron productos
                </td>
            </tr>
        `;

        return;
    }

    productosMostrar.forEach((producto) => {

        const fila =
            document.createElement("tr");

        const stock =
            Number(producto.STOCK ?? 0);

        fila.innerHTML = `
            <td>
                ${producto.ID}
            </td>

            <td>
                ${producto.NOMBRE}
            </td>

            <td>
                ${producto.MARCA || "N/A"}
            </td>

            <td>
                ${producto.MEDIDA}
            </td>

            <td>
                ${producto.PRECIO}
            </td>

            <td>
                <input
                    type="number"
                    min="0"
                    max="${stock}"
                    value="0"
                    class="input-cantidad"
                    data-id="${producto.ID}"
                    data-nombre="${producto.NOMBRE}"
                    data-stock="${stock}"
                    ${stock <= 0 ? "disabled" : ""}
                >

                <div class="stock-producto">
                    Stock: ${stock}
                </div>
            </td>
        `;

        cuerpoTabla.appendChild(fila);
    });
}


// ======================================================
// BUSCAR PRODUCTO CON EL BOTÓN
// ======================================================

document.addEventListener("click", (e) => {

    const botonBuscar =
        e.target.closest("#btn-buscar");

    if (!botonBuscar) {
        return;
    }

    const filtro =
        document.getElementById("filtro-nombre");

    const nombre =
        filtro
            ? filtro.value.trim()
            : "";

    cargarProductos(nombre);
});


// ======================================================
// BUSCAR PRODUCTO PRESIONANDO ENTER
// ======================================================

document.addEventListener("keydown", (e) => {

    if (
        e.target.matches("#filtro-nombre") &&
        e.key === "Enter"
    ) {

        e.preventDefault();

        cargarProductos(
            e.target.value.trim()
        );
    }
});


// ======================================================
// SI BORRAN EL BUSCADOR, MOSTRAR TODO
// ======================================================

document.addEventListener("input", (e) => {

    if (!e.target.matches("#filtro-nombre")) {
        return;
    }

    if (e.target.value.trim() === "") {
        cargarProductos();
    }
});


// ======================================================
// VALIDAR CANTIDADES
// ======================================================

document.addEventListener("input", (e) => {

    if (!e.target.matches(".input-cantidad")) {
        return;
    }

    const input = e.target;

    const stock =
        Number(input.dataset.stock);

    let cantidad =
        Number(input.value);


    // No permitir valores negativos
    if (cantidad < 0) {
        input.value = 0;
        return;
    }


    // Si el campo está vacío
    if (input.value === "") {
        return;
    }


    // No permitir decimales
    cantidad = Math.floor(cantidad);

    input.value = cantidad;


    // No permitir superar el stock
    if (cantidad > stock) {

        input.value = stock;

        alert(
            "Stock insuficiente. Solo hay " +
            stock +
            " unidades disponibles."
        );
    }
});


// ======================================================
// OBTENER PRODUCTOS SELECCIONADOS
// ======================================================

function obtenerProductosSeleccionados() {

    const seleccionados = [];

    const inputs =
        document.querySelectorAll(
            ".input-cantidad"
        );

    inputs.forEach((input) => {

        const cantidad =
            Number(input.value);

        if (cantidad > 0) {

            seleccionados.push({
                id: Number(input.dataset.id),
                nombre: input.dataset.nombre,
                cantidad: cantidad
            });
        }
    });

    return seleccionados;
}


// ======================================================
// REGISTRAR COMPRA
// ======================================================

async function registrarCompra() {

    // Evitar doble clic
    if (procesandoCompra) {
        return;
    }


    // ==================================================
    // OBTENER USUARIO QUE INICIÓ SESIÓN
    // ==================================================

    const idCliente =
        sessionStorage.getItem("idUsuario");

    const tipoUsuario =
        sessionStorage.getItem("tipoUsuario");

    const nombreUsuario =
        sessionStorage.getItem("nombreUsuario");


    console.log(
        "ID usuario conectado:",
        idCliente
    );

    console.log(
        "Tipo usuario:",
        tipoUsuario
    );

    console.log(
        "Nombre usuario:",
        nombreUsuario
    );


    // ==================================================
    // VALIDAR SESIÓN
    // ==================================================

    if (!idCliente) {

        alert(
            "No se pudo identificar al cliente.\n\n" +
            "Por favor inicie sesión nuevamente."
        );

        location.href = "iniciosesion";

        return;
    }


    // ==================================================
    // VALIDAR TIPO DE USUARIO
    // ==================================================

    if (tipoUsuario !== "Cliente") {

        alert(
            "La compra debe realizarse desde una cuenta de cliente."
        );

        return;
    }


    // ==================================================
    // OBTENER PRODUCTOS SELECCIONADOS
    // ==================================================

    const seleccionados =
        obtenerProductosSeleccionados();


    if (seleccionados.length === 0) {

        alert(
            "Debe seleccionar al menos un producto."
        );

        return;
    }


    console.log(
        "Productos que se van a comprar:",
        seleccionados
    );


    // ==================================================
    // CREAR RESUMEN DE CONFIRMACIÓN
    // ==================================================

    let resumen =
        "¿Desea confirmar la compra?\n\n";


    seleccionados.forEach((producto) => {

        resumen +=
            producto.nombre +
            " x " +
            producto.cantidad +
            "\n";
    });


    resumen +=
        "\nCliente ID: " +
        idCliente;


    const confirmar =
        window.confirm(resumen);


    if (!confirmar) {
        return;
    }


    // ==================================================
    // BLOQUEAR BOTÓN
    // ==================================================

    procesandoCompra = true;


    const botonComprar =
        document.getElementById("btncomprar");


    if (botonComprar) {

        botonComprar.disabled = true;

        botonComprar.innerHTML =
            "PROCESANDO...";
    }


    try {

        // ==================================================
        // PREPARAR DATOS PARA PHP
        // ==================================================

        const datosVenta = {

            id_cliente:
                Number(idCliente),

            productos:
                seleccionados
        };


        console.log(
            "Datos enviados a registrarventas.php:",
            datosVenta
        );


        // ==================================================
        // ENVIAR COMPRA
        // ==================================================

        const response =
            await fetch(
                "../api/ventas/registrarventas.php",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            datosVenta
                        )
                }
            );


        // ==================================================
        // LEER RESPUESTA COMO TEXTO
        // ==================================================
        //
        // Se hace así para poder visualizar errores PHP
        // aunque el servidor no devuelva JSON válido.
        //
        // ==================================================

        const respuestaTexto =
            await response.text();


        console.log(
            "Respuesta registrarventas.php:",
            respuestaTexto
        );


        // ==================================================
        // CONVERTIR A JSON
        // ==================================================

        let data;

        try {

            data =
                JSON.parse(
                    respuestaTexto
                );

        } catch (error) {

            throw new Error(
                "registrarventas.php no devolvió JSON válido.\n\n" +
                respuestaTexto
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
                "No fue posible registrar la compra"
            );
        }


        // ==================================================
        // COMPRA EXITOSA
        // ==================================================

        const total =
            Number(
                data.total || 0
            ).toLocaleString(
                "es-CO"
            );


        alert(
            "COMPRA REGISTRADA EXITOSAMENTE\n\n" +
            "Venta No. " +
            data.id_venta +
            "\n" +
            "Cliente ID: " +
            data.id_cliente +
            "\n" +
            "Total: $" +
            total
        );


        console.log(
            "Compra registrada correctamente:",
            data
        );


        // ==================================================
        // RECARGAR PRODUCTOS
        // ==================================================
        //
        // Esto permitirá mostrar inmediatamente
        // el nuevo stock después de comprar.
        //
        // ==================================================

        await cargarProductos();


    } catch (error) {

        console.error(
            "ERROR REGISTRANDO COMPRA:",
            error
        );


        alert(
            "No fue posible registrar la compra.\n\n" +
            error.message
        );


    } finally {

        // ==================================================
        // HABILITAR NUEVAMENTE EL BOTÓN
        // ==================================================

        procesandoCompra = false;


        if (botonComprar) {

            botonComprar.disabled = false;

            botonComprar.innerHTML = `
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    class="iconosbotones"
                    viewBox="0 0 16 16"
                >
                    <path
                        d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1z"
                    />
                </svg>

                COMPRAR
            `;
        }
    }
}


// ======================================================
// EVENTO BOTÓN COMPRAR
// ======================================================

document.addEventListener("click", (e) => {

    const botonComprar =
        e.target.closest("#btncomprar");


    if (!botonComprar) {
        return;
    }


    registrarCompra();
});


// ======================================================
// CARGAR PRODUCTOS AUTOMÁTICAMENTE
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const tabla =
            document.getElementById(
                "tabla-productos"
            );


        if (!tabla) {
            return;
        }


        console.log(
            "NUEVO compra.js cargado correctamente"
        );


        console.log(
            "ID usuario:",
            sessionStorage.getItem(
                "idUsuario"
            )
        );


        console.log(
            "Tipo usuario:",
            sessionStorage.getItem(
                "tipoUsuario"
            )
        );


        cargarProductos();
    }
);