<?php

    $servidor = "localhost";
    $base = "mibasededatos";
    $usuario = "root";
    $contrasena = "";

        $conexion = new mysqli($servidor,$usuario, $contrasena, $base);

        if ($conexion->connect_error){
            die("Error de conexion:" . $conexion->connect_error);
        }
    
    echo "Conexion exitosa";

?>