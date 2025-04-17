/*#1 ----FUNCIONES DE BOTONES DE INT. INICIO DE SESION---*/

/*#1.1 - INT. INICIO SESION -> (B) INGRESAR -> INT.SELECCION USUARIO*/
document.addEventListener("click", (e)=> {
    if(e.target.matches("#btningreso"))
    location.href="seleccionusuario"
})

/*#1.2 - INT. INICIO SESION -> (B) OLVIDASTE CONTRASEÑA -> INT. REESTABLECER*/
document.addEventListener("click", (e)=> {
    if(e.target.matches("#btnrecordar"))
    location.href="reestablecer"})

/*#1.3 - INT. INICIO SESION -> (B) REGISTRARTE -> INT. CREACION USUARIO*/
document.addEventListener("click", (e)=> {
    if(e.target.matches("#btnregistrarse"))
    location.href="creacionusuario"
})

/*#2 ---FUNCIONES DE BOTONES INT. SELECCION USUARIO---*/

/*#2.1 - INT. SELECCION USUARIO -> (B) CLIENTE -> INT. MENU PRINCIPAL*/
document.addEventListener("click", (e)=> {
    if(e.target.matches("#btncliente"))
    location.href="menuprincipal"
})

/*#2.2 - INT. SELECCION USUARIO -> (B) TENDERO -> INT.MENU TENDERO */
document.addEventListener("click", (e)=> {
    if(e.target.matches("#btntendero"))
    location.href="menutendero"
})

/*#2.3 - INT. SELECCION USUARIO -> (B) VOLVER -> INT. INICIO SESION*/
document.addEventListener("click", (e)=> {
    if(e.target.matches("#btnvolver"))
    location.href="iniciosesion"
})

/*#3 ---FUNCIONES DE BOTONES INT. REESTABLECER---*/

/*3.1 - INT. REESTABLECER -> (B) VOLVER -> INT.INICIO SESION*/
document.addEventListener("click", (e)=> {
    if(e.target.matches("#btnvolver"))
    location.href="iniciosesion"
})
/*3.2 - INT. REESTABLECER -> (B) ENVIAR CODIGO -> INT. VALIDAR*/
document.addEventListener("click", (e)=> {
    if(e.target.matches("#btncodigo"))
    location.href="validar"
})

/*#4 ---FUNCIONES DE BOTONES INT. CREACION DE USUARIO---*/

/*4.1 - INT. CREACION DE USUARIO -> (B) VOLVER -> INT.INICIO SESION*/
document.addEventListener("click", (e)=> {
    if(e.target.matches("#btnvolver"))
    location.href="iniciosesion"
})

/*4.2 - INT. CREACION USUARIO -> (B) GUARDAR -> SELECCION USUARIO*/
document.addEventListener("click", (e)=> {
    if(e.target.matches("#btnguardar"))
    location.href="seleccionusuario"
})

/*#5 ---FUNCIONES DE BOTONES INT. MENU PRINCIPAL---*/

/*#5.1 INT. MENU PRINCIPAL -> (B) COMPRAR -> INT. COMPRA*/
document.addEventListener("click", (e)=> {
    if(e.target.matches("#ventanacomprar"))
    location.href="compra"
})

/*5.2 INT. MENU PRINCIPAL -> (B) MI CUENTA -> INT. INFO CUENTA*/
document.addEventListener("click", (e)=> {
    if(e.target.matches("#ventanamicuenta"))
    location.href="infocuenta"
})

/*5.3 INT. MENU PRINCIPAL -> (B) HISTORIAL -> INT. HISTORIAL COMPRAS*/
document.addEventListener("click", (e)=> {
    if(e.target.matches("#ventanahistorial"))
    location.href="historialcompras"
})

/*5.3 INT. MENU PRINCIPAL -> (B) RECARGAR CUENTA -> INT. RECARGAR CUENTA*/
document.addEventListener("click", (e)=> {
    if(e.target.matches("#ventanarecargar"))
    location.href="recargarcuenta"
})

















/*FUNCIONES PARA LA INTERFAZ COMPRA*/

/*FUNCION PARA REGRESAR AL MENU PRINCIPAL*/
document.addEventListener("click", (e) => {
    if(e.target.matches("#btnvolvermenu"))
        location.href="menuprincipal"
})


