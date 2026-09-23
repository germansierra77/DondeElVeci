<?php

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

error_reporting(E_ALL);
ini_set('display_errors', 0);

require_once '../configbd/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {

    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        throw new Exception('Metodo no permitido');
    }

    if (!isset($_GET['id_venta'])) {
        throw new Exception('No se recibio el ID de la venta');
    }

    if (!is_numeric($_GET['id_venta'])) {
        throw new Exception('El ID de la venta no es valido');
    }

    $idVenta = (int) $_GET['id_venta'];

    if ($idVenta <= 0) {
        throw new Exception('El ID de la venta no es valido');
    }

    $db = new Db();
    $conn = $db->conectar();

    if (!$conn) {
        throw new Exception('No fue posible conectar con la base de datos');
    }

    $conn->setAttribute(
        PDO::ATTR_ERRMODE,
        PDO::ERRMODE_EXCEPTION
    );

    $sqlVenta = "
        SELECT
            Id_ventas AS Id_Venta,
            Fecha,
            Estado,
            Total_Venta,
            Id_Tendero,
            Id_Cliente,
            Fecha_Registro,
            Productos
        FROM tbventas
        WHERE Id_ventas = :id_venta
        LIMIT 1
    ";

    $stmtVenta = $conn->prepare($sqlVenta);

    $stmtVenta->bindValue(
        ':id_venta',
        $idVenta,
        PDO::PARAM_INT
    );

    $stmtVenta->execute();

    $venta = $stmtVenta->fetch(PDO::FETCH_ASSOC);

    if (!$venta) {

        http_response_code(404);

        echo json_encode([
            'success' => false,
            'error' => 'La venta solicitada no existe',
            'venta' => null,
            'detalles' => []
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    $sqlDetalle = "
        SELECT
            dv.Id_Detalle,
            dv.Id_Venta,
            dv.Id_Producto,
            dv.Cantidad,
            dv.Precio_Unitario,
            dv.Subtotal,
            p.Nombre,
            p.Marca,
            p.Medida,
            p.Categoria
        FROM tbdetalleventa AS dv
        INNER JOIN tbproductos AS p
            ON dv.Id_Producto = p.Id_Producto
        WHERE dv.Id_Venta = :id_venta
        ORDER BY dv.Id_Detalle ASC
    ";

    $stmtDetalle = $conn->prepare($sqlDetalle);

    $stmtDetalle->bindValue(
        ':id_venta',
        $idVenta,
        PDO::PARAM_INT
    );

    $stmtDetalle->execute();

    $detalles = $stmtDetalle->fetchAll(PDO::FETCH_ASSOC);

    $cantidadUnidades = 0;
    $totalDetalles = 0;

    foreach ($detalles as $detalle) {

        $cantidadUnidades += (int) $detalle['Cantidad'];

        $totalDetalles += (float) $detalle['Subtotal'];
    }

    http_response_code(200);

    echo json_encode([
        'success' => true,
        'message' => 'Detalle de venta consultado correctamente',
        'venta' => [
            'Id_Venta' => (int) $venta['Id_Venta'],
            'Fecha' => $venta['Fecha'],
            'Estado' => $venta['Estado'],
            'Total_Venta' => (float) $venta['Total_Venta'],
            'Id_Tendero' => (int) $venta['Id_Tendero'],
            'Id_Cliente' => (int) $venta['Id_Cliente'],
            'Fecha_Registro' => $venta['Fecha_Registro'],
            'Productos' => $venta['Productos']
        ],
        'detalles' => $detalles,
        'cantidad_productos' => count($detalles),
        'cantidad_unidades' => $cantidadUnidades,
        'total_detalles' => $totalDetalles
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'error' => 'Error en la base de datos: ' . $e->getMessage(),
        'venta' => null,
        'detalles' => []
    ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {

    http_response_code(400);

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'venta' => null,
        'detalles' => []
    ], JSON_UNESCAPED_UNICODE);
}

?>