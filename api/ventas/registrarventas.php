<?php

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

error_reporting(E_ALL);
ini_set('display_errors', 0);

require_once '../configbd/db.php';


// ======================================================
// RESPONDER PETICION OPTIONS
// ======================================================

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}


// ======================================================
// FUNCION PARA RESPONDER JSON
// ======================================================

function responderJson($codigo, $datos)
{
    http_response_code($codigo);

    echo json_encode(
        $datos,
        JSON_UNESCAPED_UNICODE
    );

    exit;
}


try {

    // ==================================================
    // 1. VALIDAR METODO POST
    // ==================================================

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Metodo no permitido');
    }


    // ==================================================
    // 2. RECIBIR JSON DESDE COMPRA.JS
    // ==================================================

    $contenido = file_get_contents('php://input');

    $input = json_decode($contenido, true);


    if (!is_array($input)) {
        throw new Exception(
            'No se recibieron datos validos de la compra'
        );
    }


    // ==================================================
    // 3. VALIDAR CLIENTE
    // ==================================================

    if (
        !isset($input['id_cliente']) ||
        !is_numeric($input['id_cliente']) ||
        (int)$input['id_cliente'] <= 0
    ) {
        throw new Exception(
            'No se pudo identificar al cliente'
        );
    }


    $idCliente = (int)$input['id_cliente'];


    // ==================================================
    // 4. VALIDAR PRODUCTOS
    // ==================================================

    if (
        !isset($input['productos']) ||
        !is_array($input['productos']) ||
        count($input['productos']) === 0
    ) {
        throw new Exception(
            'Debe seleccionar al menos un producto'
        );
    }


    // ==================================================
    // 5. CONECTAR A LA BASE DE DATOS
    // ==================================================

    $db = new Db();

    $conn = $db->conectar();


    if (!$conn) {
        throw new Exception(
            'Error de conexion a la base de datos'
        );
    }


    $conn->setAttribute(
        PDO::ATTR_ERRMODE,
        PDO::ERRMODE_EXCEPTION
    );


    // ==================================================
    // 6. INICIAR TRANSACCION
    // ==================================================

    $conn->beginTransaction();


    // ==================================================
    // 7. ID TENDERO
    // ==================================================
    //
    // TEMPORAL:
    // Estamos usando el tendero ID 4.
    //
    // Posteriormente podemos obtener automaticamente
    // el tendero correspondiente.
    //
    // ==================================================

    $idTendero = 4;


    // ==================================================
    // 8. CONSULTA DE PRODUCTOS
    // ==================================================

    $sqlProducto = "
        SELECT
            Id_Producto,
            Nombre,
            Precio,
            Stock
        FROM tbproductos
        WHERE Id_Producto = :id_producto
    ";


    $stmtProducto = $conn->prepare($sqlProducto);


    // ==================================================
    // 9. VARIABLES PARA LA VENTA
    // ==================================================

    $productosVenta = [];

    $totalVenta = 0;


    // ==================================================
    // 10. VALIDAR PRODUCTOS
    // ==================================================

    foreach ($input['productos'] as $producto) {


        // ----------------------------------------------
        // Validar ID
        // ----------------------------------------------

        if (
            !isset($producto['id']) ||
            !is_numeric($producto['id']) ||
            (int)$producto['id'] <= 0
        ) {
            throw new Exception(
                'Se recibio un producto sin ID valido'
            );
        }


        $idProducto = (int)$producto['id'];


        // ----------------------------------------------
        // Validar cantidad
        // ----------------------------------------------

        if (
            !isset($producto['cantidad']) ||
            !is_numeric($producto['cantidad'])
        ) {
            throw new Exception(
                'Cantidad invalida para el producto ID ' .
                $idProducto
            );
        }


        $cantidad = (int)$producto['cantidad'];


        if ($cantidad <= 0) {
            throw new Exception(
                'La cantidad debe ser mayor que cero para el producto ID ' .
                $idProducto
            );
        }


        // ----------------------------------------------
        // Consultar producto
        // ----------------------------------------------

        $stmtProducto->execute([
            ':id_producto' => $idProducto
        ]);


        $productoBD = $stmtProducto->fetch(
            PDO::FETCH_ASSOC
        );


        if (!$productoBD) {
            throw new Exception(
                'El producto con ID ' .
                $idProducto .
                ' no existe'
            );
        }


        // ----------------------------------------------
        // Obtener stock
        // ----------------------------------------------

        $stockActual = (int)$productoBD['Stock'];


        // ----------------------------------------------
        // Validar stock
        // ----------------------------------------------

        if ($stockActual < $cantidad) {
            throw new Exception(
                'Stock insuficiente para ' .
                $productoBD['Nombre'] .
                '. Disponible: ' .
                $stockActual
            );
        }


        // ----------------------------------------------
        // Precio real de la base de datos
        // ----------------------------------------------

        $precioUnitario = (float)$productoBD['Precio'];


        if ($precioUnitario <= 0) {
            throw new Exception(
                'El producto ' .
                $productoBD['Nombre'] .
                ' no tiene un precio valido'
            );
        }


        // ----------------------------------------------
        // Calcular subtotal
        // ----------------------------------------------

        $subtotal = $precioUnitario * $cantidad;


        // ----------------------------------------------
        // Sumar al total
        // ----------------------------------------------

        $totalVenta += $subtotal;


        // ----------------------------------------------
        // Guardar producto validado
        // ----------------------------------------------

        $productosVenta[] = [
            'id' => $idProducto,
            'nombre' => $productoBD['Nombre'],
            'cantidad' => $cantidad,
            'precio_unitario' => $precioUnitario,
            'subtotal' => $subtotal
        ];
    }


    // ==================================================
    // 11. VALIDAR TOTAL
    // ==================================================

    if ($totalVenta <= 0) {
        throw new Exception(
            'El total de la venta no es valido'
        );
    }


    // ==================================================
    // 12. CREAR DESCRIPCION DE PRODUCTOS
    // ==================================================
    //
    // Tu tabla tbventas tiene una columna obligatoria:
    //
    // Productos VARCHAR(60)
    //
    // Por eso debemos guardar algo en esa columna.
    //
    // ==================================================

    $listaNombres = [];


    foreach ($productosVenta as $producto) {

        $listaNombres[] =
            $producto['nombre'] .
            ' x' .
            $producto['cantidad'];
    }


    $descripcionProductos = implode(
        ', ',
        $listaNombres
    );


    // La columna Productos es VARCHAR(60)
    $descripcionProductos = substr(
        $descripcionProductos,
        0,
        60
    );


    // ==================================================
    // 13. REGISTRAR VENTA EN tbventas
    // ==================================================
    //
    // Segun la estructura que mostraste:
    //
    // Id_ventas
    // Fecha
    // Estado
    // Total_Venta
    // Id_Tendero
    // Id_Cliente
    // Fecha_Registro
    // Productos
    //
    // Id_ventas es AUTO_INCREMENT.
    // Fecha_Registro tiene CURRENT_TIMESTAMP.
    //
    // ==================================================

    $sqlVenta = "
        INSERT INTO tbventas
        (
            Fecha,
            Estado,
            Total_Venta,
            Id_Tendero,
            Id_Cliente,
            Productos
        )
        VALUES
        (
            CURDATE(),
            'COMPLETADA',
            :total,
            :id_tendero,
            :id_cliente,
            :productos
        )
    ";


    $stmtVenta = $conn->prepare($sqlVenta);


    $stmtVenta->bindValue(
        ':total',
        $totalVenta
    );


    $stmtVenta->bindValue(
        ':id_tendero',
        $idTendero,
        PDO::PARAM_INT
    );


    $stmtVenta->bindValue(
        ':id_cliente',
        $idCliente,
        PDO::PARAM_INT
    );


    $stmtVenta->bindValue(
        ':productos',
        $descripcionProductos,
        PDO::PARAM_STR
    );


    $stmtVenta->execute();


    // ==================================================
    // 14. OBTENER ID DE LA VENTA
    // ==================================================

    $idVenta = (int)$conn->lastInsertId();


    if ($idVenta <= 0) {
        throw new Exception(
            'No fue posible obtener el ID de la venta'
        );
    }


    // ==================================================
    // 15. PREPARAR DETALLE DE VENTA
    // ==================================================

    $sqlDetalle = "
        INSERT INTO tbdetalleventa
        (
            Id_Venta,
            Id_Producto,
            Cantidad,
            Precio_Unitario,
            Subtotal
        )
        VALUES
        (
            :id_venta,
            :id_producto,
            :cantidad,
            :precio,
            :subtotal
        )
    ";


    $stmtDetalle = $conn->prepare($sqlDetalle);


    // ==================================================
    // 16. PREPARAR DESCUENTO DE STOCK
    // ==================================================

    $sqlActualizarStock = "
        UPDATE tbproductos
        SET Stock = Stock - :cantidad
        WHERE Id_Producto = :id_producto
        AND Stock >= :cantidad
    ";


    $stmtActualizarStock =
        $conn->prepare($sqlActualizarStock);


    // ==================================================
    // 17. REGISTRAR DETALLES
    // ==================================================

    foreach ($productosVenta as $producto) {


        // ----------------------------------------------
        // Insertar detalle
        // ----------------------------------------------

        $stmtDetalle->execute([
            ':id_venta' => $idVenta,
            ':id_producto' => $producto['id'],
            ':cantidad' => $producto['cantidad'],
            ':precio' => $producto['precio_unitario'],
            ':subtotal' => $producto['subtotal']
        ]);


        // ----------------------------------------------
        // Descontar stock
        // ----------------------------------------------

        $stmtActualizarStock->execute([
            ':cantidad' => $producto['cantidad'],
            ':id_producto' => $producto['id']
        ]);


        // ----------------------------------------------
        // Verificar actualizacion
        // ----------------------------------------------

        if ($stmtActualizarStock->rowCount() === 0) {

            throw new Exception(
                'No fue posible actualizar el stock de ' .
                $producto['nombre']
            );
        }
    }


    // ==================================================
    // 18. CONFIRMAR TRANSACCION
    // ==================================================

    $conn->commit();


    // ==================================================
    // 19. RESPUESTA EXITOSA
    // ==================================================

    responderJson(
        200,
        [
            'success' => true,
            'message' => 'Compra registrada exitosamente',
            'id_venta' => $idVenta,
            'id_cliente' => $idCliente,
            'id_tendero' => $idTendero,
            'total' => $totalVenta,
            'productos_texto' => $descripcionProductos,
            'productos' => $productosVenta
        ]
    );


} catch (PDOException $e) {


    // ==================================================
    // ERROR DE BASE DE DATOS
    // ==================================================

    if (
        isset($conn) &&
        $conn instanceof PDO &&
        $conn->inTransaction()
    ) {

        $conn->rollBack();
    }


    responderJson(
        500,
        [
            'success' => false,
            'error' =>
                'Error en la base de datos: ' .
                $e->getMessage()
        ]
    );


} catch (Exception $e) {


    // ==================================================
    // OTROS ERRORES
    // ==================================================

    if (
        isset($conn) &&
        $conn instanceof PDO &&
        $conn->inTransaction()
    ) {

        $conn->rollBack();
    }


    responderJson(
        400,
        [
            'success' => false,
            'error' => $e->getMessage()
        ]
    );
}

?>