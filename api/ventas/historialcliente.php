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

    if (!isset($_GET['id_cliente'])) {
        throw new Exception('No se recibio el ID del cliente');
    }

    if (!is_numeric($_GET['id_cliente'])) {
        throw new Exception('El ID del cliente no es valido');
    }

    $idCliente = (int) $_GET['id_cliente'];

    if ($idCliente <= 0) {
        throw new Exception('El ID del cliente no es valido');
    }

    $db = new Db();

    $conn = $db->conectar();

    if (!$conn) {
        throw new Exception(
            'No fue posible conectar con la base de datos'
        );
    }

    $conn->setAttribute(
        PDO::ATTR_ERRMODE,
        PDO::ERRMODE_EXCEPTION
    );

    $sql = "
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
        WHERE Id_Cliente = :id_cliente
        ORDER BY Id_ventas DESC
    ";

    $stmt = $conn->prepare($sql);

    $stmt->bindValue(
        ':id_cliente',
        $idCliente,
        PDO::PARAM_INT
    );

    $stmt->execute();

    $compras = $stmt->fetchAll(
        PDO::FETCH_ASSOC
    );

    http_response_code(200);

    echo json_encode([
        'success' => true,
        'id_cliente' => $idCliente,
        'cantidad' => count($compras),
        'compras' => $compras
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'error' =>
            'Error en la base de datos: ' .
            $e->getMessage(),
        'compras' => []
    ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {

    http_response_code(400);

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'compras' => []
    ], JSON_UNESCAPED_UNICODE);
}

?>