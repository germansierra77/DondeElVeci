<?php
    include_once "llaves.php";
    
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
            try {
                $conexion = new PDO("mysql:host=$this->servidor;dbname=$this->base",$this->usuario,
                $this->contrasena);
                $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                return $conexion;
                } catch (PDOException $e){
                    return "Error:" . $e->getMessage();
                }
        }
    }
?>