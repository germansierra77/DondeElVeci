// Importar el archivo de funciones
import { validarLogin } from "./login.js";

document.addEventListener("click", (e) => { 
    //if(e.target.matches("#btningreso")) validarLogin ();
    if(e.target.matches("#btnregistrarse"))
    location.href="creacionusuario";
    if(e.target.matches("#btnrecordar"))
    location.href="reestablecer";
})
document.addEventListener("submit", (e) => {
    e.preventDefault(); 
    console.log("Formulario enviado:", e.target);  // Verifica si entra aquí
    if (e.target.matches("#f_login")) {
        console.log("Ejecutando validarLogin...");
        validarLogin();
    }
});

