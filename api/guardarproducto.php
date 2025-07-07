<?php
// Línea 3 CORREGIDA (usa exactamente este código):
require_once __DIR__.'/../configbd/db.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$ruta = __DIR__.'/../configbd/db.php';
echo json_encode([
    'existe' => file_exists($ruta),
    'ruta_real' => $ruta,
    'directorio_actual' => __DIR__,
    'contenido' => scandir(__DIR__.'/..')
]);
exit();

// Configuración de errores
ini_set('display_errors', 0);
ini_set('log_errors', 1);
error_reporting(E_ALL);
ini_set('error_log', __DIR__.'/php_errors.log');


try {
    // Solo aceptar POST
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Método no permitido', 405);
    }

    // Obtener datos JSON
    $input = file_get_contents('php://input');
    if (empty($input)) {
        throw new Exception('No se recibieron datos', 400);
    }

    $data = json_decode($input, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Formato JSON inválido', 400);
    }

    // Validación de campos requeridos
    $required = ['nombre', 'medida', 'precio', 'categoria'];
    foreach ($required as $field) {
        if (!isset($data[$field]) || empty(trim($data[$field]))) {
            throw new Exception("El campo $field es requerido", 400);
        }
    }

    // Validar que precio sea numérico
    if (!is_numeric($data['precio']) || $data['precio'] <= 0) {
        throw new Exception("El precio debe ser un número mayor a cero", 400);
    }

    // Conexión y consulta
    $db = new Db();
    $conn = $db->conectar();

    // Verificar si la conexión es válida
    if ($conn instanceof PDO) {
        $sql = "INSERT INTO tbproductos 
               (nombre, marca, medida, precio, categoria, fecha_creacion) 
               VALUES (:nombre, :marca, :medida, :precio, :categoria, NOW())";

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':nombre', $data['nombre']);
        $stmt->bindParam(':marca', $data['marca'] ?? '');
        $stmt->bindParam(':medida', $data['medida']);
        $stmt->bindValue(':precio', (float)$data['precio'], PDO::PARAM_STR);
        $stmt->bindParam(':categoria', $data['categoria']);

        if (!$stmt->execute()) {
            $errorInfo = $stmt->errorInfo();
            throw new Exception("Error al guardar en la base de datos: ".$errorInfo[2]);
        }

        echo json_encode([
            'success' => true,
            'message' => 'Producto guardado correctamente',
            'id' => $conn->lastInsertId()
        ]);
    } else {
        throw new Exception("Error de conexión a la base de datos", 500);
    }

} catch (PDOException $e) {
    error_log("PDO Error: ".$e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error de base de datos',
        'error' => $e->getMessage()
    ]);
} catch (Exception $e) {
    error_log("Error: ".$e->getMessage());
    http_response_code($e->getCode() ?: 500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
        'code' => $e->getCode()
    ]);
}
?>