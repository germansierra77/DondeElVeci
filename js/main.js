/*FUNCIONES DE BOTONES MENU PRINCIPAL*/
document.addEventListener("click", (e)=> {
    if(e.target.matches("#btningreso"))
    location.href="seleccionusuario"
    if(e.target.matches("#btnregistrarse"))
    location.href="creacionusuario"
    if(e.target.matches("#btnrecordar"))
    location.href="reestablecer"
})
/*FUNCIONES DE BOTONES SELECCION DE USUARIO*/
document.addEventListener("click", (e)=> {
    if(e.target.matches("#btniniciosesion"))
    location.href="iniciosesion"
    if(e.target.matches("#btnmenutendero"))
    location.href="menutendero"
    if(e.target.matches("#btnmenuprincipal"))
    location.href="menuprincipal"
})
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





