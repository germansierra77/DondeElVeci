// Importar el archivo de funciones
import { validarLogin } from "./login.js";

document.addEventListener("click", (e) => { 
    //if(e.target.matches("#btningreso")) validarLogin ();
    if(e.target.matches("#btnregistrarse"))
    location.href="creacionusuario";
    if(e.target.matches("#btnrecordar"))
    location.href="reestablecer";
    
    
    //BOTON GENERICO QUE DA LA OPCION DE VOLVER AL MENU PRINCIPAL EN TODAS LAS INTERFACES
    if(e.target.matches("#btnvolver"))
    location.href="menuprincipal";

    //BOTON GENERICO QUE DA LA OPCION DE VOLVER AL INICIO DE SESION EN TODAS LAS INTERFACES
    if(e.target.matches("#btniniciosesion"))
    location.href="iniciosesion";

})
document.addEventListener("submit", (e) => {
    e.preventDefault()
    if (e.target.matches("#f_login"))
        validarLogin();
});


function url(destino){
    location.href=destino
}


//BOTONES PARA EL RESTO DEL PROYECTO,SE VAN AJUSTANDO SEGUN SE VA REALIZANDO LAS APIS


/*FUNCIONES DE BOTONES REESTABLECER*/
document.addEventListener("click", (e)=> {
    if(e.target.matches("#btncodigo"))
    location.href="validar"
})
/*FUNCIONES DE BOTONES VALIDAR*/
document.addEventListener("click", (e)=> {
    if(e.target.matches("#btnreestablecer"))
    location.href="reestablecer"
    if(e.target.matches("#btnvalidacioncodigo"))
    location.href="seleccionusuario"
})
/*FUNCIONES DE BOTONES MENU PRINCIPAL*/
document.addEventListener("click",(e)=> {
    if(e.target.matches("#btnmenucomprar"))
    location.href="compra"
    if(e.target.matches("#btnmenumicuenta"))
    location.href="infocuenta"
    if(e.target.matches("#btnmenuhistorial"))
    location.href="historialcompras"
    if(e.target.matches("#btnmenurecargar"))
    location.href="recargarcuenta"
})


/*FUNCIONES DE BOTONES MENU TENDERO*/
document.addEventListener("click",(e)=> {
    if(e.target.matches("#btnmovimientos"))
    location.href="movimientos"
    if(e.target.matches("#btninfotendero"))
    location.href="infotendero"
    if(e.target.matches("#btnmenuhistorial"))
    location.href="historialcompras"
    if(e.target.matches("#btnmenurecargar"))
    location.href="recargarcuenta"
})
