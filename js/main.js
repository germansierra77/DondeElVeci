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

/*
<div class="contenido">
            <div id="idcliente">
                <div class="idcliente"> 
                <label for="idcliente" class="form-label">ID CLIENTE</label>
                <input type="text" class="form-control" id="idcliente" placeholder="357894">
            </div>
            <div class="form-floating">NOMBRE
                <input type="text" class="casillasinfo" placeholder="GERMAN SIERRA" disabled>
                <label for="floatingInputDisabled"></label>
              </div>
              <div class="form-floating">CORREO
                <input type="email" class="casillasinfo" placeholder="germansierra@mail.com" disabled>
                <label for="floatingInputDisabled"></label>
              </div>
              <div class="form-floating">CELULAR
                <input type="text" class="casillasinfo" placeholder="300300300" disabled>
                <label for="floatingInputDisabled"></label>
              </div>
            <form>
                <fieldset disabled>ESTADO DE CUENTA
                  <div class="casillaestado">
                    <label for="casillaestado" class="form-label">ACTIVO</label>
                  </div></fieldset>
                <div class="form-control">
                    <span class="casillasaldo">SALDO CUENTA $</span>
                    <input type="text" class="form-control" aria-label="label" placeholder="500.000">
                </div>
            </form></div>
        </div> */



