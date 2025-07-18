<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once "../configbd/db.php";
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

try {
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $_POST = json_decode(file_get_contents("php://input"), true);
        try {
            // Validación de parámetros
            if (isset($_POST['usuario']) && isset($_POST['clave'])) {
                $base = new Db();
                $conn = $base->conectar();

                $user = $_POST['usuario'];
                $pass = $_POST['clave'];

                $sql = "SELECT `Id`, `Nombres`, `Apellidos`, `TipoUsuario` FROM `tbusuarios` 
                WHERE `Correo` = :user_name 
                AND `Contrasena` =:password_user";

                $stmt = $conn->prepare($sql);
                $stmt->bindValue(':user_name', trim($user), PDO::PARAM_STR);
                $stmt->bindValue(':password_user', trim($pass), PDO::PARAM_STR);

                if ($stmt->execute()) {
                    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

                    if (count($result) > 0) {
                        $idUser = $result[0]["Id"];
                        $userNombre = $result[0]["Nombres"] . " " . $result[0]["Apellidos"];
                        $tipoUsuario = $result[0]["TipoUsuario"];

                        header("HTTP/1.1 200 OK");
                        echo json_encode([
                            "code" => 200,
                            "idUser" => $idUser,
                            "usuario" => $userNombre,
                            "tipoUsuario" => $tipoUsuario,
                            "msg" => "Usuario validado OK"
                        ]);
                    } else {
                        header("HTTP/1.1 203 Non-Authoritative Information");
                        echo json_encode(["code" => 203, "msg" => "Las credenciales no son válidas"]);
                    }
                } else {
                    header("HTTP/1.1 500 Internal Server Error");
                    echo json_encode(["code" => 500, "msg" => "Error al ejecutar la consulta"]);
                }
            } else {
                header("HTTP/1.1 400 Bad Request");
                echo json_encode(["code" => 400, "msg" => "Error, faltan parámetros requeridos"]);
            }
        } catch (Exception $e) {
            header("HTTP/1.1 500 Internal Server Error");
            echo json_encode(["code" => 500, "msg" => "Error en el servidor\n" . $e->getMessage()]);
        }
    } else {
        header("HTTP/1.1 405 Method Not Allowed");
        echo json_encode(["code" => 405, "msg" => "Método HTTP no permitido"]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "code" => 500,
        "msg" => "Error en el servidor",
        "detalles" => $e->getMessage()
    ]);
}
?>