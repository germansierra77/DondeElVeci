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

        if (isset($datos['idUsuario']) && isset($datos['monto']) && isset($datos['entidadBancaria']) && isset($datos['cuentaDestino'])) {
            $idUsuario = $datos['idUsuario'];
            $monto = $datos['monto'];
            $entidadBancaria = $datos['entidadBancaria'];
            $cuentaDestino = $datos['cuentaDestino'];

            $base = new Db();
            $conn = $base->conectar();

            // Iniciar transacción
            $conn->beginTransaction();

            try {
                // 1. Verificar que el usuario tenga saldo suficiente
                $sqlSaldo = "SELECT Saldo FROM tbsaldos WHERE IdUsuario = :idUsuario FOR UPDATE";
                $stmtSaldo = $conn->prepare($sqlSaldo);
                $stmtSaldo->bindValue(':idUsuario', $idUsuario, PDO::PARAM_INT);
                $stmtSaldo->execute();
                $saldo = $stmtSaldo->fetch(PDO::FETCH_ASSOC);

                if (!$saldo || $saldo['Saldo'] < $monto) {
                    http_response_code(400);
                    echo json_encode(["code" => 400, "msg" => "Saldo insuficiente para realizar el retiro"]);
                    return;
                }

                // 2. Registrar la transacción de retiro
                $sqlTransaccion = "INSERT INTO tbtransacciones (IdUsuario, Tipo, Monto, EntidadBancaria, CuentaDestino, Estado, Fecha) 
                                   VALUES (:idUsuario, 'retiro', :monto, :entidadBancaria, :cuentaDestino, 'completada', NOW())";
                $stmtTransaccion = $conn->prepare($sqlTransaccion);
                $stmtTransaccion->bindValue(':idUsuario', $idUsuario, PDO::PARAM_INT);
                $stmtTransaccion->bindValue(':monto', $monto, PDO::PARAM_STR);
                $stmtTransaccion->bindValue(':entidadBancaria', $entidadBancaria, PDO::PARAM_STR);
                $stmtTransaccion->bindValue(':cuentaDestino', $cuentaDestino, PDO::PARAM_STR);
                $stmtTransaccion->execute();

                // 3. Actualizar el saldo del usuario
                $sqlActualizarSaldo = "UPDATE tbsaldos 
                                      SET Saldo = Saldo - :monto, 
                                          FechaActualizacion = NOW() 
                                      WHERE IdUsuario = :idUsuario";
                $stmtActualizarSaldo = $conn->prepare($sqlActualizarSaldo);
                $stmtActualizarSaldo->bindValue(':monto', $monto, PDO::PARAM_STR);
                $stmtActualizarSaldo->bindValue(':idUsuario', $idUsuario, PDO::PARAM_INT);
                $stmtActualizarSaldo->execute();

                // Confirmar transacción
                $conn->commit();

                http_response_code(200);
                echo json_encode([
                    "code" => 200,
                    "msg" => "Retiro realizado exitosamente",
                    "montoRetirado" => $monto
                ]);
            } catch (Exception $e) {
                // Revertir transacción en caso de error
                $conn->rollBack();
                throw $e;
            }
        } else {
            http_response_code(400);
            echo json_encode(["code" => 400, "msg" => "Datos incompletos para el retiro"]);
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