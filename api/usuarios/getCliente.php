<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once "../configbd/db.php";
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

try {
    if ($_SERVER["REQUEST_METHOD"] == "GET") {
        // Obtener el ID del cliente de los parámetros GET
        $idCliente = isset($_GET['id']) ? $_GET['id'] : null;

        if ($idCliente) {
            $base = new Db();
            $conn = $base->conectar();

            // Consulta para obtener los datos del cliente
            $sql = "SELECT `Id`, `Nombres`, `Apellidos`, `Correo`, `Cedula`, `Celular`, `TipoUsuario` 
                    FROM `tbusuarios` 
                    WHERE `Id` = :idCliente";

            $stmt = $conn->prepare($sql);
            $stmt->bindValue(':idCliente', $idCliente, PDO::PARAM_INT);

            if ($stmt->execute()) {
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

                if (count($result) > 0) {
                    $cliente = $result[0];
                    
                    header("HTTP/1.1 200 OK");
                    echo json_encode([
                        "code" => 200,
                        "data" => [
                            "id" => $cliente['Id'],
                            "nombres" => $cliente['Nombres'],
                            "apellidos" => $cliente['Apellidos'],
                            "correo" => $cliente['Correo'],
                            "cedula" => $cliente['Cedula'],
                            "telefono" => $cliente['Celular'],
                            "tipoUsuario" => $cliente['TipoUsuario']
                        ],
                        "msg" => "Datos del cliente obtenidos correctamente"
                    ]);
                } else {
                    header("HTTP/1.1 404 Not Found");
                    echo json_encode(["code" => 404, "msg" => "Cliente no encontrado"]);
                }
            } else {
                header("HTTP/1.1 500 Internal Server Error");
                echo json_encode(["code" => 500, "msg" => "Error al ejecutar la consulta"]);
            }
        } else {
            header("HTTP/1.1 400 Bad Request");
            echo json_encode(["code" => 400, "msg" => "Se requiere el ID del cliente"]);
        }
    } else {
        header("HTTP/1.1 405 Method Not Allowed");
        echo json_encode(["code" => 405, "msg" => "Método HTTP no permitido"]);
    }
} catch (Exception $e) {
    header("HTTP/1.1 500 Internal Server Error");
    echo json_encode([
        "code" => 500,
        "msg" => "Error en el servidor",
        "detalles" => $e->getMessage()
    ]);
}
?>