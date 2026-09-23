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

    // Crear conexion a la base de datos
    $db = new Db();
    $conn = $db->conectar();

    if (!$conn) {
        throw new Exception('No fue posible conectar con la base de datos');
    }

    // Configurar PDO
    $conn->setAttribute(
        PDO::ATTR_ERRMODE,
        PDO::ERRMODE_EXCEPTION
    );

    /*
     * IMPORTANTE:
     * En tu tabla tbventas la llave primaria
     * realmente se llama Id_ventas.
     *
     * Usamos AS Id_Venta para que main.js
     * pueda continuar usando venta.Id_Venta.
     */

    $sql = "SELECT
                Id_ventas AS Id_Venta,
                Fecha,
                Estado,
                Total_Venta,
                Id_Tendero,
                Id_Cliente,
                Fecha_Registro,
                Productos
            FROM tbventas
            ORDER BY Id_ventas DESC";

    // Preparar consulta
    $stmt = $conn->prepare($sql);

    // Ejecutar consulta
    $stmt->execute();

    // Obtener ventas
    $ventas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Respuesta correcta
    echo json_encode([
        'success' => true,
        'cantidad' => count($ventas),
        'ventas' => $ventas
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'error' => 'Error en la base de datos: ' . $e->getMessage(),
        'ventas' => []
    ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'ventas' => []
    ], JSON_UNESCAPED_UNICODE);

}

?>