<?php
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(0);

require_once __DIR__ . '/../configbd/db.php';
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['code' => 405, 'msg' => 'Método no permitido']);
        exit;
    }

    $json = file_get_contents('php://input');
    $datos = json_decode($json, true);

    if (empty($datos['id']) || empty($datos['nuevaClave'])) {
        http_response_code(400);
        echo json_encode(['code' => 400, 'msg' => 'Datos incompletos']);
        exit;
    }

    $base = new Db();
    $conn = $base->conectar();

    // Encriptar la nueva contraseña (usando MD5 como en tu login)
    $claveEncriptada = md5($datos['nuevaClave']);

    $sql = "UPDATE tbusuarios SET Contrasena = :clave WHERE Id = :id";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':clave', $claveEncriptada);
    $stmt->bindParam(':id', $datos['id']);

    if ($stmt->execute()) {
        echo json_encode([
            'code' => 200,
            'msg' => 'Contraseña actualizada correctamente'
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['code' => 500, 'msg' => 'Error al actualizar contraseña']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'code' => 500,
        'msg' => 'Error en el servidor',
        'error' => $e->getMessage()
    ]);
}
?>