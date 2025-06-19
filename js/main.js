document.addEventListener("DOMContentLoaded", () => {
    // Elementos del DOM
    const formLogin = document.getElementById("f_login");
    const btnRecordar = document.getElementById("btnrecordar");
    const btnRegistrarse = document.getElementById("btnregistrarse");

    // Evento de submit del formulario
    formLogin.addEventListener("submit", (e) => {
        e.preventDefault();
        if(validarLogin()) {
            window.location.href = "seleccionusuario";
        }
    });

    // Eventos de otros botones
    btnRecordar.addEventListener("click", () => {
        window.location.href = "reestablecer";
    });

    btnRegistrarse.addEventListener("click", () => {
        window.location.href = "creacionusuario";
    });
});

// Función para mostrar mensajes temporales
function showTemporaryMessage(element, message, duration = 3000) {
    element.innerHTML = message;
    // Limpiar cualquier temporizador previo
    if (element.messageTimer) {
        clearTimeout(element.messageTimer);
    }
    // Configurar nuevo temporizador
    element.messageTimer = setTimeout(() => {
        element.innerHTML = '';
    }, duration);
}

function validarLogin() {
    // Expresiones regulares
    const ExReg_mail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const ExRegContraseña = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,18}$/;

    const msgDiv = document.getElementById("msg_log");
    
    // Mostrar mensaje de procesamiento
    showTemporaryMessage(msgDiv, "Procesando...");
    
    // Obtener valores
    const usuario = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    
    console.log("User:", usuario, "Password:", password);

    let msg = "";
    let isValid = true;
    
    // Validaciones
    if (!usuario) {
        msg = "<b>Ingrese su correo electrónico</b>";
        isValid = false;
    } else if (!ExReg_mail.test(usuario)) {
        msg = "<b>Correo inválido</b>";
        isValid = false;
    }
    
    if (!password) {
        msg = msg ? "<b>Ingrese ambos campos</b>" : "<b>Ingrese su contraseña</b>";
        isValid = false;
    } else if (!ExRegContraseña.test(password)) {
        msg = msg ? "<b>Correo y contraseña inválidos</b>" : "<b>Contraseña inválida</b>";
        isValid = false;
    }
    
    // Mostrar resultado
    if (!isValid) {
        showTemporaryMessage(msgDiv, msg);
        return false;
    }
    
    showTemporaryMessage(msgDiv, "<b>Datos ingresados correctamente</b>");
    return true;
}



