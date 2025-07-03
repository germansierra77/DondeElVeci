import {enviarAjax} from "../js/tools.js"
import { } from "../js/md5.js"

export function validarLogin() {
    const ExReg_mail = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const ExRegContraseña = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,18}$/;

    const $msg_log = document.querySelector("#msg_log");
    let msg = "";
    $msg_log.innerHTML = "Procesando...";

    let usuario = username.value, pass = password.value;
    password.value= md5(pass)

    if (!ExReg_mail.test(usuario)) {
        msg = "Correo inválido";
        if (pass === "") {
            msg = "Correo y Contraseña inválidos";
            setTimeout(() => {
            $msg_log.innerHTML = "";
        }, 3000);
        return false;
        }
    } else if (pass === "") {
        msg = "Contraseña requerida";
    }
    if (msg !== "") {
        $msg_log.innerHTML = `<b class="text-red">${msg}</b>`;
        setTimeout(() => {
            $msg_log.innerHTML = "";
        }, 3000);
        return false;
    }

    enviarAjax({
    url: "../api/login/login.php",
    method: "POST",
    param: {
        usuario: usuario,
        // El "md5" sirve para poder encriptar la contraseña y no salga el texto plano
        clave: md5(pass)
    },
    fresp: (data)=>{
        if(data.code==200){
            // Aqui se envia al menu segun el tipo de usuario ya que puede ser cliente o tendero 
            // y segun el tipo que esta en la base de datos varian las opciones
            if(data.tipoUsuario === "Tendero") {
                location.href = "menutendero";
            } else if(data.tipoUsuario === "Cliente") {
                location.href = "menuprincipal";
            } else {
                // Si no reconoce el tipo de usuario lo redirige a la pagina de inicio de sesion
                location.href = "iniciosesion";
            }
        }else{
            $msg_log.innerHTML = data.msg
        }
    }
    });
}
