<?php
require_once __DIR__.'/../configbd/db.php';

// Establecer headers primero para evitar cualquier salida antes
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Configuración de errores
ini_set('display_errors', 0);
ini_set('log_errors', 1);
error_reporting(E_ALL);
ini_set('error_log', __DIR__.'/php_errors.log');

function enviarRespuesta($success, $message, $data = [], $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data
    ]);
    exit;
}

try {
    // Verificar método POST
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        enviarRespuesta(false, 'Método no permitido', [], 405);
    }

    // Obtener datos JSON
    $input = file_get_contents('php://input');
    if (empty($input)) {
        enviarRespuesta(false, 'No se recibieron datos', [], 400);
    }

    $data = json_decode($input, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        enviarRespuesta(false, 'Formato JSON inválido: ' . json_last_error_msg(), [], 400);
    }

    // Validación de campos
    $required = ['nombre', 'medida', 'precio', 'categoria'];
    foreach ($required as $field) {
        if (!isset($data[$field]) || empty(trim($data[$field]))) {
            enviarRespuesta(false, "El campo $field es requerido", [], 400);
        }
    }

    // Validar precio
    if (!is_numeric($data['precio']) || $data['precio'] <= 0) {
        enviarRespuesta(false, "El precio debe ser un número mayor a cero", [], 400);
    }

    // Conexión a la base de datos
    $db = new Db();
    $conn = $db->conectar();

    if (!($conn instanceof PDO)) {
        enviarRespuesta(false, "Error de conexión a la base de datos", [], 500);
    }

    // Configurar PDO
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Insertar producto
    $sql = "INSERT INTO tbproductos 
            (Nombre, Marca, Medida, Precio, Categoria) 
            VALUES (:nombre, :marca, :medida, :precio, :categoria)";
    
    $stmt = $conn->prepare($sql);
    
    // Limpieza de datos
    $nombre = trim($data['nombre']);
    $marca = isset($data['marca']) ? trim($data['marca']) : null;
    $medida = trim($data['medida']);
    $precio = (float)$data['precio'];
    $categoria = trim($data['categoria']);
    
    // Bind de parámetros
    $stmt->bindParam(':nombre', $nombre, PDO::PARAM_STR);
    $stmt->bindParam(':marca', $marca, $marca === null ? PDO::PARAM_NULL : PDO::PARAM_STR);
    $stmt->bindParam(':medida', $medida, PDO::PARAM_STR);
    $stmt->bindParam(':precio', $precio);
    $stmt->bindParam(':categoria', $categoria, PDO::PARAM_STR);

    if (!$stmt->execute()) {
        enviarRespuesta(false, "Error al guardar el producto", [], 500);
    }

    // Respuesta exitosa
    enviarRespuesta(true, 'Producto guardado correctamente', ['id' => $conn->lastInsertId()]);

} catch (PDOException $e) {
    error_log("PDOException: ".$e->getMessage());
    enviarRespuesta(false, 'Error de base de datos: ' . $e->getMessage(), [], 500);
} catch (Exception $e) {
    error_log("Exception: ".$e->getMessage());
    enviarRespuesta(false, $e->getMessage(), [], $e->getCode() ?: 500);
}
?>