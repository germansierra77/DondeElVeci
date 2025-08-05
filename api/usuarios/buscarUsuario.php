<?php
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(0);

require_once __DIR__ . '/../configbd/db.php';
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

try {
    if ($_SERVER['REQUEST_METHOD'] == 'GET') {
        $base = new Db();
        $conn = $base->conectar();

        // Buscar por ID o Correo
        if (isset($_GET['id'])) {
            $id = $_GET['id'];
            $sql = "SELECT Id, Nombres, Apellidos, Correo, Celular as telefono 
                    FROM tbusuarios WHERE Id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->execute([$id]);
        } 
        elseif (isset($_GET['correo'])) {
            $correo = $_GET['correo'];
            $sql = "SELECT Id, Nombres, Apellidos, Correo, Celular as telefono 
                    FROM tbusuarios WHERE Correo = ?";
            $stmt = $conn->prepare($sql);
            $stmt->execute([$correo]);
        } 
        else {
            http_response_code(400);
            echo json_encode(['code' => 400, 'msg' => 'Parámetro de búsqueda no especificado']);
            exit;
        }

        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($usuario) {
            echo json_encode([
                'code' => 200,
                'data' => $usuario,
                'msg' => 'Usuario encontrado'
            ]);
        } else {
            http_response_code(404);
            echo json_encode(['code' => 404, 'msg' => 'Usuario no encontrado']);
        }
    } else {
        http_response_code(405);
        echo json_encode(['code' => 405, 'msg' => 'Método no permitido']);
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