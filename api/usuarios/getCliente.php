<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once "../configbd/db.php";
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");
header("Expires: 0");

try {
    if ($_SERVER["REQUEST_METHOD"] == "GET") {
        $idCliente = isset($_GET['id']) ? $_GET['id'] : null;

        if ($idCliente) {
            $base = new Db();
            $conn = $base->conectar();

            // CONSULTA ACTUALIZADA para incluir todos los campos necesarios
            $sql = "SELECT Id, Nombres, Apellidos, Correo, Celular, Cedula, TipoUsuario 
                    FROM tbusuarios 
                    WHERE Id = :idCliente";
                    
            $stmt = $conn->prepare($sql);
            $stmt->bindValue(':idCliente', $idCliente, PDO::PARAM_INT);

            if ($stmt->execute()) {
                $result = $stmt->fetch(PDO::FETCH_ASSOC);

                if ($result) {
                    http_response_code(200);
                    echo json_encode([
                        "code" => 200,
                        "data" => $result,
                        "msg" => "Datos del cliente obtenidos correctamente"
                    ]);
                } else {
                    http_response_code(404);
                    echo json_encode(["code" => 404, "msg" => "Cliente no encontrado"]);
                }
            } else {
                http_response_code(500);
                echo json_encode(["code" => 500, "msg" => "Error al ejecutar la consulta"]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["code" => 400, "msg" => "Se requiere el ID del cliente"]);
        }
    } else {
        http_response_code(405);
        echo json_encode(["code" => 405, "msg" => "Método HTTP no permitido"]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "code" => 500,
        "msg" => "Error en el servidor",
        "error" => $e->getMessage()
    ]);
}
?>