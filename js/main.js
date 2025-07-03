// Importar el archivo de funciones
import { validarLogin } from "./login.js";

 function url(destino){
    location.href=destino
    }

//**ESTO BOTONES SON GENERICOS,LOS CUALES SIRVEN PARA CUALQUIERA DE LOS DOS MENUS */

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


//**ESTO SERAN LOS BOTONES PARA EL MENU DEL CLIENTE */

//BOTONES DE INTERFAZ DE INICIO DE SESION
document.addEventListener("click", (e) => { 
    //if(e.target.matches("#btningreso")) validarLogin ();
    if(e.target.matches("#btnregistrarse"))
    location.href="creacionusuario";
    if(e.target.matches("#btnrecordar"))
    location.href="reestablecer";

document.addEventListener("submit", (e) => {
    e.preventDefault()
    if (e.target.matches("#f_login"))
        validarLogin();
});


    //BOTON GENERICO QUE DA LA OPCION DE VOLVER AL MENU PRINCIPAL EN TODAS LAS INTERFACES
    if(e.target.matches("#btnvolver"))
    location.href="menuprincipal";

    //BOTON GENERICO QUE DA LA OPCION DE VOLVER AL INICIO DE SESION EN TODAS LAS INTERFACES
    if(e.target.matches("#btniniciosesion"))
    location.href="iniciosesion";

})

//BOTONES PARA EL RESTO DEL PROYECTO,SE VAN AJUSTANDO SEGUN SE VA REALIZANDO LAS APIS



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
    if(e.target.matches("#btnhistorialventas"))
    location.href="historialtendero"
    if(e.target.matches("#btninfotendero"))
    location.href="infotendero"
    if(e.target.matches("#btnmenuhistorial"))
    location.href="historialcompras"
    if(e.target.matches("#btnmenurecargar"))
    location.href="recargarcuenta"
})

    //BOTON GENERICO QUE DA LA OPCION DE VOLVER AL MENU TENDERO EN TODAS LAS INTERFACES
document.addEventListener("click",(e)=> {
    
    if(e.target.matches("#btnvolvertendero"))
    location.href="menutendero";

    //BOTON GENERICO QUE DA LA OPCION DE VOLVER AL INICIO DE SESION EN TODAS LAS INTERFACES
    if(e.target.matches("#btniniciosesion"))
    location.href="iniciosesion";
})
