<?php
    require_once "../configbd/db.php";
    header("Access-control-Allow-Origin: *");
    header("Content-Type: application/json");

    if($_SERVER["REQUEST_METHOD"] == "GET"){
        $data= json_decode(file_get_contents("php://input"));
    try {
            $base = new Db();
            $conn = $base->conectar();
            header("HTTP/1.1 200 OK");
            echo json_encode(array("code"=>200,"msg"=> "Conexion exitosa"));
    } catch (Exception $e) {
        header("HTTP/1.1 500 Internal Server Error");
        echo json_encode(array("code"=>500,"msg" => "Error en el servidor /n".$e->getMessage()));
    }
    }else{
        header("HTTP/1.1 400 Bad Request");
        echo json_encode(array("code"=>400,"msg" => "Solicitud incorrecta por parte del cliente"));
    }

?>