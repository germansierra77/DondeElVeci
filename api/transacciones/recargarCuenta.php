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

        if (isset($datos['idUsuario']) && isset($datos['monto']) && isset($datos['entidadBancaria'])) {
            $idUsuario = $datos['idUsuario'];
            $monto = $datos['monto'];
            $entidadBancaria = $datos['entidadBancaria'];

            $base = new Db();
            $conn = $base->conectar();

            // Iniciar transacción
            $conn->beginTransaction();

            try {
                // 1. Registrar la transacción de recarga
                $sqlTransaccion = "INSERT INTO tbtransacciones (IdUsuario, Tipo, Monto, EntidadBancaria, Estado, Fecha) 
                                   VALUES (:idUsuario, 'recarga', :monto, :entidadBancaria, 'completada', NOW())";
                $stmtTransaccion = $conn->prepare($sqlTransaccion);
                $stmtTransaccion->bindValue(':idUsuario', $idUsuario, PDO::PARAM_INT);
                $stmtTransaccion->bindValue(':monto', $monto, PDO::PARAM_STR);
                $stmtTransaccion->bindValue(':entidadBancaria', $entidadBancaria, PDO::PARAM_STR);
                $stmtTransaccion->execute();

                // 2. Actualizar el saldo del usuario
                // Verificar si ya existe un registro de saldo
                $sqlVerificarSaldo = "SELECT Saldo FROM tbsaldos WHERE IdUsuario = :idUsuario FOR UPDATE";
                $stmtVerificarSaldo = $conn->prepare($sqlVerificarSaldo);
                $stmtVerificarSaldo->bindValue(':idUsuario', $idUsuario, PDO::PARAM_INT);
                $stmtVerificarSaldo->execute();
                $saldoExistente = $stmtVerificarSaldo->fetch(PDO::FETCH_ASSOC);

                if ($saldoExistente) {
                    // Actualizar saldo existente
                    $sqlActualizarSaldo = "UPDATE tbsaldos 
                                          SET Saldo = Saldo + :monto, 
                                              FechaActualizacion = NOW() 
                                          WHERE IdUsuario = :idUsuario";
                } else {
                    // Crear nuevo registro de saldo
                    $sqlActualizarSaldo = "INSERT INTO tbsaldos (IdUsuario, Saldo, FechaCreacion, FechaActualizacion) 
                                        VALUES (:idUsuario, :monto, NOW(), NOW())";
                }

                $stmtActualizarSaldo = $conn->prepare($sqlActualizarSaldo);
                $stmtActualizarSaldo->bindValue(':idUsuario', $idUsuario, PDO::PARAM_INT);
                $stmtActualizarSaldo->bindValue(':monto', $monto, PDO::PARAM_STR);
                $stmtActualizarSaldo->execute();

                // Confirmar transacción
                $conn->commit();

                http_response_code(200);
                echo json_encode([
                    "code" => 200,
                    "msg" => "Recarga realizada exitosamente",
                    "montoRecargado" => $monto
                ]);
            } catch (Exception $e) {
                // Revertir transacción en caso de error
                $conn->rollBack();
                throw $e;
            }
        } else {
            http_response_code(400);
            echo json_encode(["code" => 400, "msg" => "Datos incompletos para la recarga"]);
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