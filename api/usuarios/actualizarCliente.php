<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once "../configbd/db.php";
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

try {
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $json = file_get_contents('php://input');
        $datos = json_decode($json, true);

        if (!isset($datos['id']) || !$datos['id']) {
            header("HTTP/1.1 400 Bad Request");
            echo json_encode(["code" => 400, "msg" => "ID de cliente requerido"]);
            exit;
        }

        $base = new Db();
        $conn = $base->conectar();

        // Consulta de actualización
        $sql = "UPDATE tbusuarios SET 
                Nombres = :nombres, 
                Apellidos = :apellidos, 
                Correo = :correo, 
                Celular = :telefono 
                WHERE Id = :id";

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':nombres', $datos['nombres']);
        $stmt->bindParam(':apellidos', $datos['apellidos']);
        $stmt->bindParam(':correo', $datos['correo']);
        $stmt->bindParam(':telefono', $datos['telefono']);
        $stmt->bindParam(':id', $datos['id'], PDO::PARAM_INT);

        if ($stmt->execute()) {
            if ($stmt->rowCount() > 0) {
                echo json_encode([
                    "code" => 200,
                    "msg" => "Datos actualizados correctamente"
                ]);
            } else {
                echo json_encode([
                    "code" => 200,
                    "msg" => "No se realizaron cambios (los datos son iguales)"
                ]);
            }
        } else {
            header("HTTP/1.1 500 Internal Server Error");
            echo json_encode(["code" => 500, "msg" => "Error al ejecutar la actualización"]);
        }
    } else {
        header("HTTP/1.1 405 Method Not Allowed");
        echo json_encode(["code" => 405, "msg" => "Método no permitido"]);
    }
} catch (Exception $e) {
    header("HTTP/1.1 500 Internal Server Error");
    echo json_encode([
        "code" => 500,
        "msg" => "Error en el servidor",
        "error" => $e->getMessage()
    ]);
}
?>