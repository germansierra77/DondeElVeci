<?php
    //var_dump(file_get_contents("config.json"));
    $credenciales= null;
    (@file_get_contents("../configbd/.key")) ?
    $credenciales = file_get_contents("../configbd/.key") : $credenciales = file_get_contents("../configbd/config.json");
    $credenciales= json_decode($credenciales,true);
    //var_dump($credenciales);
?>