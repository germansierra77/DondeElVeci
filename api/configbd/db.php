<?php
    $credenciales = file_get_contents("../configbd/config.json");
    $credenciales = json_decode($credenciales, true);
    
    class Db {
        private $servidor = "localhost";
        private $usuario = "root";
        private $contrasena = "";
        private $base = "mibasededatos";

        public function __construct() {
            global $credenciales;
            $this->servidor = $credenciales ["host"];
            $this->usuario = $credenciales ["user"];
            $this->contrasena = $credenciales ["pass"];
            $this->base = $credenciales ["db"];
        }
        public function conectar() {
            $conexion = new mysqli
            ($this->servidor,$this->usuario, $this->contrasena, $this->base);
                if($conexion->connect_error){
                    die("ERROR DE CONEXION".$conexion->connect_error);
                }
            return $conexion;               
        }
    }


    /* ESTO ES UNA FORMA DE CONECTAR LA BASE DE DATOS PERO NO ES LA MAS RECOMENDADA,
    LO MEJOR ES HACERLO MEDIANTE CLASES---

    $servidor = "localhost";
    $base = "mibasededatos";
    $usuario = "root";
    $contrasena = "";

        $conexion = new mysqli($servidor,$usuario, $contrasena, $base);

        if ($conexion->connect_error){
            die("Error de conexion:" . $conexion->connect_error);
        }
    
    echo "Conexion exitosa";
    $conexion->close();*/
?>