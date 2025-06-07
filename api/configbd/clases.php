<?php
    class Producto {
        private $codigo;
        private $nombre;
        private $precio;
        private $medida;

        public function __construct($c,$n,$p,$m) {
            $this->codigo = $c;
            $this->nombre = $n;
            $this->precio = $p;
            $this->medida = $m;
        }
      /*------METODOS------*/
        public function obtenerPrecio(){
            echo "El precio es ".$this->precio." pesos";
        }
        public function calcularTotal(){
            return $this->precio*5000;
        } 
        public function obtenerNombre(){
            echo "El producto consultado es ".$this->nombre;
        }
        public function obtenerFicha(){
            echo "El producto consultado es "."=>".$this->nombre."=>"."su codigo es"."=>".$this->codigo.
            "=>"."Que tiene un valor de ".$this->precio." por ".$this->medida;
        }
        public function getNombre(){
            return $this->nombre;
        }
        public function setNombre($n){
            $this->nombre= $n;
        }
    }
     class Abarrotes extends Producto {
        private $codigo;
        private $nombre;
        private $precio;
        private $medida;
        private $marca;
        
        public function __construct($c,$n,$p,$m,$mr) {
            $this->codigo = $c;
            $this->nombre = $n;
            $this->precio = $p;
            $this->medida = $m;
            $this->marca = $mr;
        }
        /*----METODOS CLASE ABARROTES---*/
        public function obtenerPrecio(){
            echo "El precio es ".$this->precio." pesos";
        }
        public function calcularTotal(){
            return $this->precio*5000;
        } 
        public function obtenerNombre(){
            echo "El producto consultado es ".$this->nombre;
        }
        public function obtenerFicha(){
            echo "El producto consultado es "."=>".$this->nombre."=>"."su codigo es"."=>".$this->codigo.
            "=>"."Que tiene un valor de ".$this->precio." por ".$this->medida." y es marca ".$this->marca;
        }
        public function getNombre(){
            return $this->nombre;
        }
    }
         class Frutas extends Producto {
        private $codigo;
        private $nombre;
        private $precio;
        private $medida;
        
        public function __construct($c,$n,$p,$m) {
            $this->codigo = $c;
            $this->nombre = $n;
            $this->precio = $p;
            $this->medida = $m;
        }
        /*----METODOS CLASE FRUTAS---*/
        public function obtenerPrecio(){
            echo "El precio es ".$this->precio." pesos";
        }
        public function calcularTotal(){
            return $this->precio*5000;
        } 
        public function obtenerNombre(){
            echo "El producto consultado es ".$this->nombre;
        }
        public function obtenerFicha(){
            echo "El producto consultado es "."=>".$this->nombre."=>"."su codigo es"."=>".$this->codigo.
            "=>"."Que tiene un valor de ".$this->precio." por ".$this->medida;
        }
        public function getNombre(){
            return $this->nombre;
        }
    }
    $elemento1 = new Producto ("01","Arroz","$800","libra");
    $elemento2 = new Abarrotes ("02","Frijol","$1200","Libra","Diana");
    $elemento3 = new Frutas ("03","Manzana","$700","Libra");
     
    echo $elemento3->obtenerPrecio();
    echo "<br>";
    echo $elemento2->obtenerFicha();
    echo "<br>";
    echo $elemento1->getNombre();
    echo "<br>";
    echo $elemento1->setNombre("Arveja");
    echo $elemento1->getNombre();
    echo "<br>";
?>