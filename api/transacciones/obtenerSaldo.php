<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once "../configbd/db.php";
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

try {
    if ($_SERVER["REQUEST_METHOD"] == "GET") {
        $idUsuario = isset($_GET['id']) ? $_GET['id'] : null;

        if ($idUsuario) {
            $base = new Db();
            $conn = $base->conectar();

            $sql = "SELECT Saldo FROM tbsaldos WHERE IdUsuario = :idUsuario";
            $stmt = $conn->prepare($sql);
            $stmt->bindValue(':idUsuario', $idUsuario, PDO::PARAM_INT);

            if ($stmt->execute()) {
                $result = $stmt->fetch(PDO::FETCH_ASSOC);

                if ($result) {
                    http_response_code(200);
                    echo json_encode([
                        "code" => 200,
                        "saldo" => $result['Saldo'],
                        "msg" => "Saldo obtenido correctamente"
                    ]);
                } else {
                    // Si no tiene saldo registrado, devolver 0
                    http_response_code(200);
                    echo json_encode([
                        "code" => 200,
                        "saldo" => 0,
                        "msg" => "El usuario no tiene saldo registrado"
                    ]);
                }
            } else {
                http_response_code(500);
                echo json_encode(["code" => 500, "msg" => "Error al ejecutar la consulta"]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["code" => 400, "msg" => "Se requiere el ID del usuario"]);
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