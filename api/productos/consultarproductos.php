<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once '../configbd/db.php';

try {
    $db = new Db();
    $conn = $db->conectar();
    
    if (!$conn) {
        throw new Exception("Error de conexión a la base de datos");
    }

    $sql = "SELECT 
                Id_Producto AS ID,
                Nombre AS NOMBRE,
                Marca AS MARCA,
                Categoria AS CATEGORIA,
                Medida AS MEDIDA,
                Precio AS PRECIO
            FROM tbproductos
            WHERE 1=1"; // Condición siempre verdadera para facilitar agregar filtros

    // Parámetros para filtros
    $params = [];

    // Filtro por nombre
    if (isset($_GET['nombre']) && !empty($_GET['nombre'])) {
        $sql .= " AND Nombre LIKE :nombre";
        $params[':nombre'] = '%' . $_GET['nombre'] . '%';
    }

    // Filtro por categoría
    if (isset($_GET['categoria']) && !empty($_GET['categoria'])) {
        $sql .= " AND Categoria = :categoria";
        $params[':categoria'] = $_GET['categoria'];
    }

    // Preparar y ejecutar consulta
    $stmt = $conn->prepare($sql);
    
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }

    if (!$stmt->execute()) {
        throw new Exception("Error al ejecutar la consulta");
    }

    $productos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Formatear precios
    foreach ($productos as &$producto) {
        $producto['PRECIO'] = '$' . number_format($producto['PRECIO'], 0, ',', '.');
    }

    // Respuesta exitosa
    echo json_encode([
        'success' => true,
        'productos' => $productos,
        'count' => count($productos),
        'timestamp' => date('Y-m-d H:i:s')
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'error_info' => isset($conn) ? $conn->errorInfo() : null,
        'suggestion' => 'Verifique la conexión a la base de datos'
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'suggestion' => 'Error en el servidor'
    ]);
}
?>